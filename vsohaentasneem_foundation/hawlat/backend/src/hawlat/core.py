"""Cross-cutting services: configuration, audit, outbox, gates, ledger."""
from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .gates.registry import Gate, GateRegistry, GateStatus
from .models import (AuditLog, ConfigurationVersion, GateState, LedgerEntry, Notification,
                     OutboxEvent, TransactionParty, new_id)

DEFAULT_CONFIG: dict = {
    "MIN_TRANSACTION_AMOUNT": "50",
    "MAX_TRANSACTION_AMOUNT": "500000",
    "MIN_TENOR": 1,  # store builds may require longer minimum terms; see docs/STORE_SUBMISSION.md
    "MAX_TENOR": 50,
    "MAX_ACTIVE_EXPOSURE": "500000",
    "MAX_COUNTERPARTY_EXPOSURE": "200000",
    "MAX_DAILY_VOLUME": "2000000",
    "MAX_PRODUCT_LIMIT": "500000",
    "COMPLETED_TXN_THRESHOLD": 3,
    "NEWCOMER_MAX_AMOUNT": "5000",
    "PLATFORM_FEE_BPS": 100,  # [LEGAL_REVIEW_REQUIRED]
    "MAX_CHARGE_BPS_PER_WEEK": 500,  # [LEGAL_REVIEW_REQUIRED]
    "QUOTE_TTL_HOURS": 24,
}

DEFAULT_GATES = {
    "MARKETPLACE_MATCHING": ["LEGAL_OPINION"],
    "PAYMENT_SETTLEMENT": ["AUTHORIZED_PAYMENT_PARTNER"],
    "IDENTITY_VERIFICATION_PROVIDER": ["KYC_PARTNER"],
    "PUBLIC_REPUTATION_SHARING": ["DATA_PROTECTION_REVIEW"],
}


class Config:
    def __init__(self, version: int, values: dict):
        self.version, self._v = version, values

    def dec(self, key: str) -> Decimal:
        return Decimal(str(self._v[key]))

    def int(self, key: str) -> int:
        return int(self._v[key])


def bootstrap(db: Session) -> None:
    """Idempotently seed config v1 and default-deny gates."""
    if db.scalar(select(func.count()).select_from(ConfigurationVersion)) == 0:
        db.add(ConfigurationVersion(version=1, values=DEFAULT_CONFIG, created_by="system"))
    for feature, required in DEFAULT_GATES.items():
        if db.get(GateState, feature) is None:
            db.add(GateState(feature=feature, status="PLANNED", required=required, satisfied=[], approvals=[]))
    db.flush()


def current_config(db: Session) -> Config:
    row = db.scalars(select(ConfigurationVersion).order_by(ConfigurationVersion.version.desc())).first()
    return Config(row.version, row.values)


def publish_config(db: Session, values: dict, actor: str) -> Config:
    base = dict(current_config(db)._v)
    unknown = set(values) - set(DEFAULT_CONFIG)
    if unknown:
        raise ValueError(f"unknown config keys: {sorted(unknown)}")
    base.update(values)
    version = current_config(db).version + 1
    db.add(ConfigurationVersion(version=version, values=base, created_by=actor))
    audit(db, actor, "config.published", "configuration", str(version), {"keys": sorted(values)})
    db.flush()
    return Config(version, base)


# ---- audit (hash chained) ----
def audit(db: Session, actor: str, action: str, entity: str, entity_id: str, detail: dict | None = None) -> None:
    last = db.scalars(select(AuditLog).order_by(AuditLog.seq.desc())).first()
    seq = (last.seq + 1) if last else 1
    prev = last.hash if last else "0" * 64
    detail = detail or {}
    body = json.dumps([seq, actor, action, entity, entity_id, detail, prev], sort_keys=True, default=str)
    db.add(AuditLog(seq=seq, actor=actor, action=action, entity=entity, entity_id=entity_id,
                    detail=detail, prev_hash=prev, hash=hashlib.sha256(body.encode()).hexdigest()))
    db.flush()


def verify_audit_chain(db: Session) -> bool:
    prev = "0" * 64
    for r in db.scalars(select(AuditLog).order_by(AuditLog.seq)):
        body = json.dumps([r.seq, r.actor, r.action, r.entity, r.entity_id, r.detail, prev], sort_keys=True, default=str)
        if r.prev_hash != prev or r.hash != hashlib.sha256(body.encode()).hexdigest():
            return False
        prev = r.hash
    return True


# ---- outbox ----
def emit(db: Session, type_: str, aggregate_id: str, payload: dict) -> str:
    event_id = new_id()
    db.add(OutboxEvent(id=event_id, type=type_, aggregate_id=aggregate_id, payload=payload))
    return event_id


def dispatch_outbox(db: Session, limit: int = 100) -> int:
    """At-least-once consumer: turns transition events into notifications; handlers must be idempotent."""
    rows = db.scalars(select(OutboxEvent).where(OutboxEvent.published_at.is_(None))
                      .order_by(OutboxEvent.created_at).limit(limit)).all()
    for ev in rows:
        try:
            if ev.type == "transaction.transitioned":
                parties = db.scalars(select(TransactionParty).where(TransactionParty.transaction_id == ev.aggregate_id))
                for p in parties:
                    db.add(Notification(participant_id=p.participant_id, kind=ev.type,
                                        body=f"Transaction is now {ev.payload['new_state']}"))
            ev.published_at = datetime.now(timezone.utc)
        except Exception:
            ev.attempts += 1
    db.flush()
    return len(rows)


# ---- gates (DB-backed wrapper over the in-memory registry) ----
def _registry(db: Session) -> GateRegistry:
    reg = GateRegistry()
    for g in db.scalars(select(GateState)):
        reg.register(Gate(g.feature, frozenset(g.required), GateStatus(g.status), set(g.satisfied)))
    return reg


def require_gate(db: Session, feature: str) -> None:
    _registry(db).require(feature)


def satisfy_requirement(db: Session, feature: str, requirement: str, actor: str) -> None:
    g = db.get(GateState, feature)
    if requirement not in g.required:
        raise ValueError("not a requirement of this gate")
    g.satisfied = sorted(set(g.satisfied) | {requirement})
    audit(db, actor, "gate.requirement_satisfied", "gate", feature, {"requirement": requirement})


def advance_gate(db: Session, feature: str, to: GateStatus, actor: str) -> str:
    g = db.get(GateState, feature)
    approvals = set(g.approvals) | {actor}
    reg = _registry(db)
    if to is GateStatus.ENABLED and len(approvals) < 2:
        g.approvals = sorted(approvals)
        audit(db, actor, "gate.approval_recorded", "gate", feature, {"to": to.value})
        return "PENDING_SECOND_APPROVER"
    reg.advance(feature, to, approvals)
    g.status, g.approvals, g.version = to.value, [], g.version + 1
    audit(db, actor, "gate.advanced", "gate", feature, {"to": to.value})
    emit(db, "gate.changed", feature, {"status": to.value})
    return to.value


def kill_switch(db: Session, feature: str, actor: str) -> None:
    g = db.get(GateState, feature)
    g.status, g.approvals, g.version = GateStatus.SUSPENDED.value, [], g.version + 1
    audit(db, actor, "gate.kill_switch", "gate", feature, {})
    emit(db, "gate.changed", feature, {"status": "SUSPENDED"})


# ---- ledger ----
class LedgerError(Exception):
    pass


def post_journal(db: Session, lines: list[tuple[str, str, Decimal]], currency: str,
                 transaction_id: str | None, memo: str) -> str:
    """lines = (account, DEBIT|CREDIT, amount). Must balance and be positive."""
    debit = sum((a for _, d, a in lines if d == "DEBIT"), Decimal(0))
    credit = sum((a for _, d, a in lines if d == "CREDIT"), Decimal(0))
    if not lines or debit != credit or any(a <= 0 for _, _, a in lines):
        raise LedgerError("journal must be non-empty, positive and balanced")
    journal_id = new_id()
    for account, direction, amount in lines:
        db.add(LedgerEntry(journal_id=journal_id, account=account, direction=direction, amount=amount,
                           currency=currency, transaction_id=transaction_id, memo=memo))
    db.flush()
    return journal_id


def account_balance(db: Session, account: str) -> Decimal:
    total = Decimal(0)
    for e in db.scalars(select(LedgerEntry).where(LedgerEntry.account == account)):
        total += e.amount if e.direction == "DEBIT" else -e.amount
    return total


PLATFORM_FEE_ACCOUNT = "platform:fee_receivable"


def party_account(participant_id: str) -> str:
    return f"obligation:{participant_id}"
