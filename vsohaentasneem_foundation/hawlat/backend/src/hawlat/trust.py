"""Reputation (append-only events) and eligibility/risk decisions."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from .core import Config, audit
from .models import (Participant, ReputationAppeal, ReputationEvent, RiskEvent, Transaction,
                     TransactionParty)

LIVE_STATES = ("AGREED", "PENDING_SETTLEMENT", "ACTIVE", "PARTIALLY_REPAID", "DISPUTED")


# ---- reputation ----
def add_event(db: Session, participant_id: str, delta: int, reason: str, source: str, ref_id: str | None = None) -> None:
    db.add(ReputationEvent(participant_id=participant_id, delta=delta, reason_code=reason, source=source, ref_id=ref_id))
    db.flush()


def reputation(db: Session, cfg: Config, participant_id: str) -> dict:
    events = db.scalars(select(ReputationEvent).where(ReputationEvent.participant_id == participant_id)).all()
    score = max(0, min(1000, 500 + sum(e.delta for e in events)))
    completed = sum(1 for e in events if e.reason_code == "TXN_COMPLETED")
    tier = "NEW" if completed == 0 else "BUILDING" if completed < cfg.int("COMPLETED_TXN_THRESHOLD") else "ESTABLISHED"
    return {"score": score, "tier": tier, "completed_count": completed,
            "marketplace_privileges": "ENHANCED" if completed >= cfg.int("COMPLETED_TXN_THRESHOLD") else "STANDARD",
            "note": "Reputation never guarantees eligibility; each quote is evaluated independently.",
            "reason_codes": sorted({e.reason_code for e in events})}


def file_appeal(db: Session, participant_id: str, event_id: str, reason: str) -> ReputationAppeal:
    ev = db.get(ReputationEvent, event_id)
    if ev is None or ev.participant_id != participant_id:
        raise LookupError("event not found")
    appeal = ReputationAppeal(participant_id=participant_id, event_id=event_id, reason=reason)
    db.add(appeal)
    db.flush()
    audit(db, participant_id, "reputation.appeal_filed", "appeal", appeal.id, {"event": event_id})
    return appeal


def decide_appeal(db: Session, appeal_id: str, uphold: bool, reviewer: str) -> None:
    appeal = db.get(ReputationAppeal, appeal_id)
    if appeal is None or appeal.state != "OPEN":
        raise LookupError("open appeal not found")
    ev = db.get(ReputationEvent, appeal.event_id)
    appeal.state, appeal.decided_by = ("UPHELD" if uphold else "REJECTED"), reviewer
    if uphold:  # original event is preserved; a compensating event reverses its effect
        add_event(db, appeal.participant_id, -ev.delta, "APPEAL_UPHELD", "appeal", appeal.id)
    audit(db, reviewer, "reputation.appeal_decided", "appeal", appeal.id, {"upheld": uphold})


# ---- eligibility / risk ----
@dataclass
class RiskDecision:
    outcome: str  # ALLOW | DENY
    reasons: list[str]


def _exposure(db: Session, recipient_id: str, funder_id: str | None = None) -> Decimal:
    total = Decimal(0)
    rows = db.execute(select(Transaction, TransactionParty).join(TransactionParty, TransactionParty.transaction_id == Transaction.id)
                      .where(TransactionParty.participant_id == recipient_id, TransactionParty.role == "RECIPIENT",
                             Transaction.state.in_(LIVE_STATES))).all()
    for tx, _ in rows:
        if funder_id:
            f = db.scalar(select(TransactionParty).where(TransactionParty.transaction_id == tx.id,
                                                          TransactionParty.role == "FUNDER"))
            if f.participant_id != funder_id:
                continue
        total += tx.total_due - tx.repaid
    return total


def _daily_volume(db: Session, now: datetime) -> Decimal:
    total = Decimal(0)
    for tx in db.scalars(select(Transaction)):
        if tx.created_at.date() == now.date():
            total += tx.principal
    return total


def evaluate(db: Session, cfg: Config, *, recipient: Participant, funder: Participant, principal: Decimal,
             tenor: int, charge_bps: int, now: datetime) -> RiskDecision:
    reasons: list[str] = []
    if recipient.id == funder.id:
        reasons.append("SELF_DEALING")
    for p, tag in ((recipient, "RECIPIENT"), (funder, "FUNDER")):
        if p.status != "ACTIVE":
            reasons.append(f"{tag}_NOT_ACTIVE")
        if p.verification_level < 1:
            reasons.append(f"{tag}_NOT_VERIFIED")
    if not cfg.dec("MIN_TRANSACTION_AMOUNT") <= principal <= cfg.dec("MAX_TRANSACTION_AMOUNT"):
        reasons.append("AMOUNT_OUT_OF_BOUNDS")
    if principal > cfg.dec("MAX_PRODUCT_LIMIT"):
        reasons.append("PRODUCT_LIMIT_EXCEEDED")
    if tenor < cfg.int("MIN_TENOR") or tenor > cfg.int("MAX_TENOR"):
        reasons.append("TENOR_OUT_OF_BOUNDS")
    if charge_bps > cfg.int("MAX_CHARGE_BPS_PER_WEEK"):
        reasons.append("CHARGE_ABOVE_CAP")
    rep = reputation(db, cfg, recipient.id)
    if rep["completed_count"] < cfg.int("COMPLETED_TXN_THRESHOLD") and principal > cfg.dec("NEWCOMER_MAX_AMOUNT"):
        reasons.append("NEWCOMER_AMOUNT_LIMIT")
    if rep["score"] < 300:
        reasons.append("REPUTATION_TOO_LOW")
    if _exposure(db, recipient.id) + principal > cfg.dec("MAX_ACTIVE_EXPOSURE"):
        reasons.append("MAX_ACTIVE_EXPOSURE")
    if _exposure(db, recipient.id, funder.id) + principal > cfg.dec("MAX_COUNTERPARTY_EXPOSURE"):
        reasons.append("MAX_COUNTERPARTY_EXPOSURE")
    if _daily_volume(db, now) + principal > cfg.dec("MAX_DAILY_VOLUME"):
        reasons.append("MAX_DAILY_VOLUME")
    outcome = "DENY" if reasons else "ALLOW"
    db.add(RiskEvent(participant_id=recipient.id, subject="quote", outcome=outcome,
                     reason_codes=reasons, config_version=cfg.version))
    db.flush()
    return RiskDecision(outcome, reasons)
