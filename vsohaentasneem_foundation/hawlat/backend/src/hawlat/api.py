import hashlib
import os
import json
from dataclasses import dataclass
from decimal import Decimal
from typing import Annotated, Callable

from fastapi import Depends, FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import ENCODERS_BY_TYPE
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from . import core, identity, marketplace, trust, txn
from .db import Settings, make_engine, make_session_factory
from .gates.registry import GateBlocked, GateStatus
from .models import (Base, ReputationAppeal, ReputationEvent, User, FinancingOffer, FinancingRequest, IdempotencyKey, ImmutableRecord, Match,
                     Notification, Participant, Quote, Transaction, TransactionTransition, LedgerEntry)
from .payments import get_payment_adapter
from .transactions.state_machine import InvalidTransition


# Money is always serialised as an exact decimal string, never a JSON float/int.
ENCODERS_BY_TYPE[Decimal] = str


@dataclass
class Principal:
    user_id: str
    role: str
    pid: str


class RegisterIn(BaseModel):
    email: str
    password: str = Field(min_length=10)
    display_name: str = Field(min_length=1, max_length=120)


class LoginIn(BaseModel):
    email: str
    password: str


class RequestIn(BaseModel):
    amount: Decimal = Field(gt=0)
    currency: str = "BDT"
    tenor_weeks: int = Field(gt=0)
    purpose: str = ""


class OfferIn(BaseModel):
    min_amount: Decimal = Field(gt=0)
    max_amount: Decimal = Field(gt=0)
    max_tenor_weeks: int = Field(gt=0)
    charge_bps_per_week: int = Field(ge=0)


class RepaymentIn(BaseModel):
    amount: Decimal = Field(gt=0)


class ReasonIn(BaseModel):
    reason: str = Field(min_length=3, max_length=500)


class DisputeIn(ReasonIn):
    transaction_id: str


class AppealIn(ReasonIn):
    event_id: str


class GateAdvanceIn(BaseModel):
    to: GateStatus


class RequirementIn(BaseModel):
    requirement: str


class ConfigIn(BaseModel):
    values: dict


class DeleteIn(BaseModel):
    password: str


class AppealDecisionIn(BaseModel):
    uphold: bool


def create_app(settings: Settings | None = None, database_url: str | None = None) -> FastAPI:
    settings = settings or Settings()
    adapter = get_payment_adapter(settings)  # fails fast in production until a partner adapter is approved
    engine = make_engine(database_url or settings.database_url)
    Base.metadata.create_all(engine) if settings.env != "production" else None  # production uses Alembic only
    factory = make_session_factory(engine)
    with factory() as s:
        core.bootstrap(s)
        s.commit()

    app = FastAPI(title="HAWLAT API", version="1.0", docs_url=None if settings.env == "production" else "/docs")
    app.state.session_factory = factory
    origins = [o for o in os.environ.get("HAWLAT_CORS_ORIGINS", "https://localhost,capacitor://localhost,http://localhost").split(",") if o]
    app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["GET", "POST", "DELETE"],
                       allow_headers=["Authorization", "Content-Type", "Idempotency-Key"])

    def get_db():
        db = factory()
        try:
            yield db
            db.commit()
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    DB = Annotated[Session, Depends(get_db)]

    def principal(db: DB, authorization: Annotated[str | None, Header()] = None) -> Principal:
        if not authorization or not authorization.lower().startswith("bearer "):
            raise HTTPException(401, "authentication required")
        try:
            c = identity.decode(authorization[7:], settings.jwt_secret)
        except identity.AuthError:
            raise HTTPException(401, "invalid token")
        part = db.get(Participant, c["pid"])
        if part is None or part.status == "DELETED":
            raise HTTPException(401, "account no longer exists")
        return Principal(c["sub"], c["role"], c["pid"])

    P = Annotated[Principal, Depends(principal)]

    def admin(p: P) -> Principal:
        if p.role not in ("admin", "compliance"):
            raise HTTPException(403, "admin role required")
        return p

    A = Annotated[Principal, Depends(admin)]
    IdemKey = Annotated[str | None, Header(alias="Idempotency-Key")]

    def idem(db: Session, p: Principal, route: str, key: str | None, body: dict, fn: Callable[[], dict]) -> dict:
        if not key:
            raise HTTPException(400, "Idempotency-Key header required")
        h = hashlib.sha256(json.dumps(body, sort_keys=True, default=str).encode()).hexdigest()
        row = db.scalar(select(IdempotencyKey).where(IdempotencyKey.actor == p.pid, IdempotencyKey.route == route,
                                                     IdempotencyKey.key == key))
        if row:
            if row.request_hash != h:
                raise HTTPException(422, "Idempotency-Key reused with a different request")
            return row.response
        result = json.loads(json.dumps(fn(), default=str))
        db.add(IdempotencyKey(actor=p.pid, route=route, key=key, request_hash=h, response=result))
        return result

    def problem(status: int, code: str, detail: str, **extra) -> JSONResponse:
        return JSONResponse({"type": "about:blank", "code": code, "detail": detail, **extra}, status_code=status,
                            media_type="application/problem+json")

    @app.exception_handler(GateBlocked)
    async def _gate(_: Request, e: GateBlocked):
        return problem(403, "GATE_BLOCKED", str(e), feature=e.feature, gate_status=e.status.value, missing=sorted(e.missing))

    @app.exception_handler(marketplace.RiskDenied)
    async def _risk(_: Request, e):
        return problem(422, "RISK_DENIED", "request not eligible", reasons=e.reasons)

    @app.exception_handler(InvalidTransition)
    async def _inv(_: Request, e):
        return problem(409, "INVALID_TRANSITION", str(e))

    @app.exception_handler(marketplace.Forbidden)
    async def _forb(_: Request, e):
        return problem(403, "FORBIDDEN", str(e))

    @app.exception_handler(LookupError)
    async def _nf(_: Request, e):
        return problem(404, "NOT_FOUND", str(e))

    @app.exception_handler(ValueError)
    async def _val(_: Request, e):
        return problem(422, "VALIDATION", str(e))

    @app.exception_handler(ImmutableRecord)
    async def _imm(_: Request, e):
        return problem(409, "IMMUTABLE", str(e))

    v1 = "/api/v1"

    @app.get("/healthz")
    def healthz():
        return {"status": "ok"}

    @app.get("/readyz")
    def readyz(db: DB):
        db.execute(select(1))
        return {"status": "ready"}

    # ---- auth / identity ----
    @app.post(f"{v1}/auth/register", status_code=201)
    def register(body: RegisterIn, db: DB):
        part = identity.register(db, body.email, body.password, body.display_name)
        return {"participant_id": part.id}

    @app.post(f"{v1}/auth/login")
    def login(body: LoginIn, db: DB):
        try:
            return {"access_token": identity.login(db, body.email, body.password, settings.jwt_secret), "token_type": "bearer"}
        except identity.AuthError:
            raise HTTPException(401, "invalid credentials")

    @app.get(f"{v1}/participants/me")
    def me(p: P, db: DB):
        part = db.get(Participant, p.pid)
        return {"id": part.id, "display_name": part.display_name, "verification_level": part.verification_level,
                "status": part.status, "role": p.role}

    @app.delete(f"{v1}/participants/me")
    def delete_me(body: DeleteIn, p: P, db: DB):
        """Account deletion required by Apple/Google. Personal data is erased; financial records are anonymised and kept."""
        user = db.get(User, p.user_id)
        if p.role != "participant":
            raise HTTPException(403, "staff accounts are removed by an administrator")
        try:
            identity.verify_password(user, body.password)
        except identity.AuthError:
            raise HTTPException(403, "password incorrect")
        live = db.scalars(select(Transaction).join(txn.TransactionParty, txn.TransactionParty.transaction_id == Transaction.id)
                          .where(txn.TransactionParty.participant_id == p.pid, Transaction.state.in_(trust.LIVE_STATES))).first()
        if live:
            raise HTTPException(409, "You have an unfinished transaction. Complete or resolve it before deleting your account.")
        for r in db.scalars(select(FinancingRequest).where(FinancingRequest.participant_id == p.pid, FinancingRequest.state == "PUBLISHED")):
            r.state = "CANCELLED"
        for o in db.scalars(select(FinancingOffer).where(FinancingOffer.participant_id == p.pid, FinancingOffer.state == "PUBLISHED")):
            o.state = "CANCELLED"
        identity.anonymise(db, user, db.get(Participant, p.pid))
        core.audit(db, p.pid, "participant.deleted", "participant", p.pid, {})
        return {"deleted": True}
    @app.get(f"{v1}/reputation/me")
    def my_rep(p: P, db: DB):
        return trust.reputation(db, core.current_config(db), p.pid)

    @app.post(f"{v1}/reputation/appeals", status_code=201)
    def appeal(body: AppealIn, p: P, db: DB):
        return {"appeal_id": trust.file_appeal(db, p.pid, body.event_id, body.reason).id}

    # ---- marketplace ----
    @app.post(f"{v1}/requests", status_code=201)
    def post_request(body: RequestIn, p: P, db: DB, key: IdemKey = None):
        return idem(db, p, "POST /requests", key, body.model_dump(mode="json"), lambda: {
            "id": marketplace.create_request(db, core.current_config(db), p.pid, body.amount, body.currency,
                                             body.tenor_weeks, body.purpose).id})

    @app.post(f"{v1}/offers", status_code=201)
    def post_offer(body: OfferIn, p: P, db: DB, key: IdemKey = None):
        return idem(db, p, "POST /offers", key, body.model_dump(mode="json"), lambda: {
            "id": marketplace.create_offer(db, core.current_config(db), p.pid, body.min_amount, body.max_amount,
                                           body.max_tenor_weeks, body.charge_bps_per_week).id})

    @app.get(f"{v1}/requests")
    def my_requests(p: P, db: DB):
        rows = db.scalars(select(FinancingRequest).where(FinancingRequest.participant_id == p.pid)
                          .order_by(FinancingRequest.created_at.desc())).all()
        return [{"id": r.id, "amount": r.amount, "currency": r.currency, "tenor_weeks": r.tenor_weeks,
                 "purpose": r.purpose, "state": r.state} for r in rows]

    @app.get(f"{v1}/offers")
    def my_offers(p: P, db: DB):
        rows = db.scalars(select(FinancingOffer).where(FinancingOffer.participant_id == p.pid)
                          .order_by(FinancingOffer.created_at.desc())).all()
        return [{"id": o.id, "min_amount": o.min_amount, "max_amount": o.max_amount, "max_tenor_weeks": o.max_tenor_weeks,
                 "charge_bps_per_week": o.charge_bps_per_week, "state": o.state} for o in rows]

    def _counterparty(db: Session, pid: str) -> dict:
        part = db.get(Participant, pid)
        rep = trust.reputation(db, core.current_config(db), pid)
        return {"display_name": part.display_name, "verified": part.verification_level >= 1,
                "tier": rep["tier"], "completed_count": rep["completed_count"]}

    @app.get(f"{v1}/requests/{{request_id}}/matches")
    def req_matches(request_id: str, p: P, db: DB):
        req = db.get(FinancingRequest, request_id)
        if req is None:
            raise LookupError("request not found")
        out = []
        for m in marketplace.matches_for_request(db, req, p.pid):
            o = db.get(FinancingOffer, m.offer_id)
            out.append({"match_id": m.id, "offer_id": o.id, "charge_bps_per_week": o.charge_bps_per_week,
                        "max_tenor_weeks": o.max_tenor_weeks, "counterparty": _counterparty(db, o.participant_id)})
        return out

    @app.get(f"{v1}/offers/{{offer_id}}/matches")
    def offer_matches(offer_id: str, p: P, db: DB):
        offer = db.get(FinancingOffer, offer_id)
        if offer is None:
            raise LookupError("offer not found")
        out = []
        for m in marketplace.matches_for_offer(db, offer, p.pid):
            r = db.get(FinancingRequest, m.request_id)
            out.append({"match_id": m.id, "request_id": r.id, "amount": r.amount, "tenor_weeks": r.tenor_weeks,
                        "purpose": r.purpose, "counterparty": _counterparty(db, r.participant_id)})
        return out
    @app.post(f"{v1}/matches/{{match_id}}/quotes", status_code=201)
    def quote(match_id: str, p: P, db: DB, key: IdemKey = None):
        def run():
            m = db.get(Match, match_id)
            if m is None:
                raise LookupError("match not found")
            q = marketplace.make_quote(db, core.current_config(db), m, p.pid)
            return _quote_out(q)
        return idem(db, p, f"POST /matches/{match_id}/quotes", key, {}, run)

    def _quote_out(q: Quote) -> dict:
        return {"id": q.id, "principal": q.principal, "currency": q.currency, "tenor_weeks": q.tenor_weeks,
                "party_charge": q.party_charge, "platform_fee": q.platform_fee,
                "total_due_to_funder": q.total_due_to_funder, "schedule": q.schedule, "terms_hash": q.terms_hash,
                "config_version": q.config_version, "expires_at": q.expires_at,
                "notice": "HAWLAT is not a party to this transaction and does not provide the financing."}

    @app.get(f"{v1}/quotes/{{quote_id}}")
    def get_quote(quote_id: str, p: P, db: DB):
        q = db.get(Quote, quote_id)
        if q is None:
            raise LookupError("quote not found")
        m = db.get(Match, q.match_id)
        if p.pid not in (db.get(FinancingRequest, m.request_id).participant_id, db.get(FinancingOffer, m.offer_id).participant_id):
            raise marketplace.Forbidden("not a party to this quote")
        return _quote_out(q)

    @app.post(f"{v1}/quotes/{{quote_id}}/accept")
    def accept(quote_id: str, p: P, db: DB, key: IdemKey = None):
        def run():
            q = db.get(Quote, quote_id)
            if q is None:
                raise LookupError("quote not found")
            return txn.accept_quote(db, core.current_config(db), q, p.pid)
        return idem(db, p, f"POST /quotes/{quote_id}/accept", key, {}, run)

    # ---- transactions ----
    def _tx_view(db: Session, tx: Transaction) -> dict:
        return {"id": tx.id, "state": tx.state, "principal": tx.principal, "currency": tx.currency,
                "total_due": tx.total_due, "repaid": tx.repaid, "platform_fee": tx.platform_fee,
                "parties": txn.parties(db, tx.id)}

    @app.get(f"{v1}/transactions")
    def my_transactions(p: P, db: DB):
        txs = db.scalars(select(Transaction).join(txn.TransactionParty, txn.TransactionParty.transaction_id == Transaction.id)
                         .where(txn.TransactionParty.participant_id == p.pid).order_by(Transaction.created_at.desc())).all()
        return [dict(_tx_view(db, t), my_role=next(r for r, pid in txn.parties(db, t.id).items() if pid == p.pid)) for t in txs]
    @app.get(f"{v1}/transactions/{{tx_id}}")
    def get_tx(tx_id: str, p: P, db: DB):
        tx, _ = txn._tx_for(db, tx_id, p.pid)
        return _tx_view(db, tx)

    @app.get(f"{v1}/transactions/{{tx_id}}/timeline")
    def timeline(tx_id: str, p: P, db: DB):
        txn._tx_for(db, tx_id, p.pid)
        rows = db.scalars(select(TransactionTransition).where(TransactionTransition.transaction_id == tx_id)
                          .order_by(TransactionTransition.occurred_at)).all()
        return [{"previous_state": r.previous_state, "new_state": r.new_state, "actor": r.actor, "reason": r.reason,
                 "event_id": r.event_id, "at": r.occurred_at} for r in rows]

    @app.post(f"{v1}/transactions/{{tx_id}}/settle")
    def settle(tx_id: str, p: P, db: DB, key: IdemKey = None):
        return idem(db, p, f"POST /transactions/{tx_id}/settle", key, {},
                    lambda: _tx_view(db, txn.settle(db, tx_id, p.pid, adapter)))

    @app.post(f"{v1}/transactions/{{tx_id}}/repayments")
    def repay(tx_id: str, body: RepaymentIn, p: P, db: DB, key: IdemKey = None):
        return idem(db, p, f"POST /transactions/{tx_id}/repayments", key, body.model_dump(mode="json"),
                    lambda: _tx_view(db, txn.record_repayment(db, tx_id, p.pid, body.amount)))

    @app.post(f"{v1}/disputes", status_code=201)
    def dispute(body: DisputeIn, p: P, db: DB, key: IdemKey = None):
        return idem(db, p, "POST /disputes", key, body.model_dump(mode="json"),
                    lambda: {"id": txn.open_dispute(db, body.transaction_id, p.pid, body.reason).id})

    @app.get(f"{v1}/passport/me")
    def passport(p: P, db: DB):
        acct = core.party_account(p.pid)
        rows = db.scalars(select(LedgerEntry).where(LedgerEntry.account == acct).order_by(LedgerEntry.created_at)).all()
        txs = db.scalars(select(Transaction).join(txn.TransactionParty, txn.TransactionParty.transaction_id == Transaction.id)
                         .where(txn.TransactionParty.participant_id == p.pid)).all()
        return {"statement_type": "record-only; not a wallet; HAWLAT holds no funds",
                "reputation": trust.reputation(db, core.current_config(db), p.pid),
                "net_obligation_balance": core.account_balance(db, acct),
                "transactions": [{"id": t.id, "state": t.state} for t in txs],
                "ledger": [{"journal_id": e.journal_id, "direction": e.direction, "amount": e.amount, "memo": e.memo} for e in rows]}

    @app.get(f"{v1}/notifications")
    def notifications(p: P, db: DB):
        rows = db.scalars(select(Notification).where(Notification.participant_id == p.pid)).all()
        return [{"id": n.id, "kind": n.kind, "body": n.body, "read": n.read} for n in rows]

    # ---- admin / compliance ----
    @app.post(f"{v1}/admin/participants/{{participant_id}}/verify")
    def verify(participant_id: str, a: A, db: DB):
        part = db.get(Participant, participant_id)
        if part is None:
            raise LookupError("participant not found")
        part.verification_level = max(part.verification_level, 1)
        core.audit(db, a.pid, "participant.verified", "participant", part.id, {"provider": "MANUAL"})
        return {"verification_level": part.verification_level}

    @app.get(f"{v1}/admin/participants/unverified")
    def unverified(a: A, db: DB):
        rows = db.scalars(select(Participant).where(Participant.verification_level < 1, Participant.status == "ACTIVE")).all()
        return [{"id": r.id, "display_name": r.display_name, "created_at": r.created_at} for r in rows]

    @app.get(f"{v1}/admin/reputation/appeals")
    def open_appeals(a: A, db: DB):
        rows = db.scalars(select(ReputationAppeal).where(ReputationAppeal.state == "OPEN")).all()
        out = []
        for r in rows:
            ev = db.get(ReputationEvent, r.event_id)
            out.append({"id": r.id, "participant_id": r.participant_id, "reason": r.reason,
                        "event": {"reason_code": ev.reason_code, "delta": ev.delta}})
        return out

    @app.get(f"{v1}/admin/config")
    def get_config(a: A, db: DB):
        c = core.current_config(db)
        return {"version": c.version, "values": c._v}

    @app.get(f"{v1}/admin/gates")
    def gates(a: A, db: DB):
        return [{"feature": g.feature, "status": g.status, "required": g.required, "satisfied": g.satisfied,
                 "approvals": g.approvals} for g in db.scalars(select(core.GateState))]

    @app.post(f"{v1}/admin/gates/{{feature}}/satisfy")
    def satisfy(feature: str, body: RequirementIn, a: A, db: DB):
        core.satisfy_requirement(db, feature, body.requirement, a.pid)
        return {"ok": True}

    @app.post(f"{v1}/admin/gates/{{feature}}/advance")
    def advance(feature: str, body: GateAdvanceIn, a: A, db: DB):
        return {"result": core.advance_gate(db, feature, body.to, a.pid)}

    @app.post(f"{v1}/admin/kill-switches/{{feature}}")
    def kill(feature: str, a: A, db: DB):
        core.kill_switch(db, feature, a.pid)
        return {"status": "SUSPENDED"}

    @app.post(f"{v1}/admin/config")
    def config(body: ConfigIn, a: A, db: DB):
        return {"version": core.publish_config(db, body.values, a.pid).version}

    @app.post(f"{v1}/admin/reputation/appeals/{{appeal_id}}/decide")
    def decide(appeal_id: str, body: AppealDecisionIn, a: A, db: DB):
        trust.decide_appeal(db, appeal_id, body.uphold, a.pid)
        return {"ok": True}

    @app.post(f"{v1}/admin/transactions/{{tx_id}}/default")
    def default(tx_id: str, body: ReasonIn, a: A, db: DB):
        return _tx_view(db, txn.mark_default(db, tx_id, a.pid, body.reason))

    @app.post(f"{v1}/admin/outbox/dispatch")
    def dispatch(a: A, db: DB):
        return {"dispatched": core.dispatch_outbox(db)}

    @app.get(f"{v1}/admin/audit/verify")
    def audit_verify(a: A, db: DB):
        return {"chain_valid": core.verify_audit_chain(db)}

    return app
