from __future__ import annotations

import hashlib
import json
from datetime import timedelta
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from .core import Config, audit, require_gate
from .models import (FinancingOffer, FinancingRequest, Match, Participant, Quote, utcnow)
from .pricing import price
from .trust import evaluate


class Forbidden(Exception):
    pass


class RiskDenied(Exception):
    def __init__(self, reasons: list[str]):
        super().__init__(",".join(reasons))
        self.reasons = reasons


def _validate_bounds(cfg: Config, lo: Decimal, hi: Decimal, tenor: int, currency: str) -> None:
    if currency != "BDT":
        raise ValueError("unsupported currency")
    if lo < cfg.dec("MIN_TRANSACTION_AMOUNT") or hi > cfg.dec("MAX_TRANSACTION_AMOUNT"):
        raise ValueError("amount outside configured platform limits")
    if not cfg.int("MIN_TENOR") <= tenor <= cfg.int("MAX_TENOR"):
        raise ValueError("tenor outside configured platform limits")


def create_request(db: Session, cfg: Config, pid: str, amount: Decimal, currency: str, tenor: int, purpose: str):
    _validate_bounds(cfg, amount, amount, tenor, currency)
    req = FinancingRequest(participant_id=pid, amount=amount, currency=currency, tenor_weeks=tenor, purpose=purpose[:200])
    db.add(req)
    db.flush()
    audit(db, pid, "request.published", "request", req.id, {"amount": str(amount), "tenor": tenor})
    return req


def create_offer(db: Session, cfg: Config, pid: str, lo: Decimal, hi: Decimal, tenor: int, bps: int, currency: str = "BDT"):
    _validate_bounds(cfg, lo, hi, tenor, currency)
    if not 0 <= bps <= cfg.int("MAX_CHARGE_BPS_PER_WEEK"):
        raise ValueError("charge outside configured cap")
    offer = FinancingOffer(participant_id=pid, min_amount=lo, max_amount=hi, currency=currency,
                           max_tenor_weeks=tenor, charge_bps_per_week=bps)
    db.add(offer)
    db.flush()
    audit(db, pid, "offer.published", "offer", offer.id, {"min": str(lo), "max": str(hi)})
    return offer


def _compatible(req: FinancingRequest, offer: FinancingOffer) -> bool:
    return (offer.state == "PUBLISHED" and req.state == "PUBLISHED" and offer.participant_id != req.participant_id
            and offer.currency == req.currency and offer.min_amount <= req.amount <= offer.max_amount
            and req.tenor_weeks <= offer.max_tenor_weeks)


def _persist(db: Session, req: FinancingRequest, offer: FinancingOffer) -> Match:
    m = db.scalar(select(Match).where(Match.request_id == req.id, Match.offer_id == offer.id))
    if m is None:
        m = Match(request_id=req.id, offer_id=offer.id)
        db.add(m)
        db.flush()
    return m


def matches_for_request(db: Session, req: FinancingRequest, actor_pid: str) -> list[Match]:
    require_gate(db, "MARKETPLACE_MATCHING")
    if req.participant_id != actor_pid:
        raise Forbidden("not your request")
    offers = db.scalars(select(FinancingOffer).where(FinancingOffer.state == "PUBLISHED")).all()
    return [_persist(db, req, o) for o in offers if _compatible(req, o)]


def matches_for_offer(db: Session, offer: FinancingOffer, actor_pid: str) -> list[Match]:
    require_gate(db, "MARKETPLACE_MATCHING")
    if offer.participant_id != actor_pid:
        raise Forbidden("not your offer")
    reqs = db.scalars(select(FinancingRequest).where(FinancingRequest.state == "PUBLISHED")).all()
    return [_persist(db, r, offer) for r in reqs if _compatible(r, offer)]


def terms_hash(match: Match, priced: dict, tenor: int, cfg_version: int) -> str:
    body = json.dumps({"m": match.id, "p": str(priced["principal"]), "c": str(priced["party_charge"]),
                       "f": str(priced["platform_fee"]), "t": tenor, "s": priced["schedule"], "cv": cfg_version},
                      sort_keys=True)
    return hashlib.sha256(body.encode()).hexdigest()


def make_quote(db: Session, cfg: Config, match: Match, actor_pid: str) -> Quote:
    require_gate(db, "MARKETPLACE_MATCHING")
    req, offer = db.get(FinancingRequest, match.request_id), db.get(FinancingOffer, match.offer_id)
    if actor_pid not in (req.participant_id, offer.participant_id):
        raise Forbidden("not a party to this match")
    now = utcnow()
    recipient, funder = db.get(Participant, req.participant_id), db.get(Participant, offer.participant_id)
    decision = evaluate(db, cfg, recipient=recipient, funder=funder, principal=req.amount, tenor=req.tenor_weeks,
                        charge_bps=offer.charge_bps_per_week, now=now)
    if decision.outcome != "ALLOW":
        raise RiskDenied(decision.reasons)
    priced = price(req.amount, req.currency, req.tenor_weeks, offer.charge_bps_per_week, cfg)
    quote = Quote(match_id=match.id, principal=priced["principal"], currency=req.currency, tenor_weeks=req.tenor_weeks,
                  party_charge=priced["party_charge"], platform_fee=priced["platform_fee"],
                  total_due_to_funder=priced["total_due_to_funder"], schedule=priced["schedule"],
                  config_version=cfg.version, pricing_version=priced["pricing_version"],
                  terms_hash=terms_hash(match, priced, req.tenor_weeks, cfg.version),
                  expires_at=now + timedelta(hours=cfg.int("QUOTE_TTL_HOURS")), created_by=actor_pid)
    db.add(quote)
    db.flush()
    audit(db, actor_pid, "quote.issued", "quote", quote.id, {"terms_hash": quote.terms_hash})
    return quote
