from __future__ import annotations

from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from .core import (PLATFORM_FEE_ACCOUNT, Config, audit, emit, party_account, post_journal, require_gate)
from .marketplace import Forbidden, RiskDenied
from .models import (Agreement, Dispute, FinancingOffer, FinancingRequest, Match, Participant, Quote,
                     RepaymentEvent, Transaction, TransactionParty, TransactionTransition, utcnow)
from .payments import PaymentPort
from .transactions.state_machine import InvalidTransition, TxState, transition as sm_transition
from .trust import add_event, evaluate


def parties(db: Session, tx_id: str) -> dict[str, str]:
    return {p.role: p.participant_id for p in
            db.scalars(select(TransactionParty).where(TransactionParty.transaction_id == tx_id))}


def move(db: Session, tx: Transaction, new: TxState, actor: str, reason: str) -> None:
    t = sm_transition(TxState(tx.state), new, actor=actor, reason=reason)
    db.add(TransactionTransition(transaction_id=tx.id, previous_state=t.previous_state.value,
                                 new_state=t.new_state.value, actor=actor, reason=reason, event_id=t.event_id,
                                 occurred_at=t.timestamp))
    tx.state, tx.version = new.value, tx.version + 1
    emit(db, "transaction.transitioned", tx.id,
         {"previous_state": t.previous_state.value, "new_state": new.value, "actor": actor, "reason": reason,
          "event_id": t.event_id})
    audit(db, actor, "transaction.transitioned", "transaction", tx.id, {"to": new.value, "reason": reason})
    db.flush()


def accept_quote(db: Session, cfg: Config, quote: Quote, actor_pid: str) -> dict:
    require_gate(db, "MARKETPLACE_MATCHING")
    match = db.get(Match, quote.match_id)
    req, offer = db.get(FinancingRequest, match.request_id), db.get(FinancingOffer, match.offer_id)
    role = "RECIPIENT" if actor_pid == req.participant_id else "FUNDER" if actor_pid == offer.participant_id else None
    if role is None:
        raise Forbidden("not a party to this quote")
    now = utcnow()
    if quote.expires_at.replace(tzinfo=now.tzinfo) < now:
        raise ValueError("quote expired")
    # eligibility is re-evaluated at agreement time, not trusted from quote time
    decision = evaluate(db, cfg, recipient=db.get(Participant, req.participant_id), funder=db.get(Participant, offer.participant_id),
                        principal=quote.principal, tenor=quote.tenor_weeks, charge_bps=offer.charge_bps_per_week, now=now)
    if decision.outcome != "ALLOW":
        raise RiskDenied(decision.reasons)
    ag = db.scalar(select(Agreement).where(Agreement.quote_id == quote.id))
    if ag is None:
        ag = Agreement(quote_id=quote.id, terms_hash=quote.terms_hash)
        db.add(ag)
        db.flush()
    if role == "FUNDER":
        ag.funder_signed_at = ag.funder_signed_at or now
    else:
        ag.recipient_signed_at = ag.recipient_signed_at or now
    audit(db, actor_pid, "agreement.signed", "agreement", ag.id, {"role": role, "terms_hash": ag.terms_hash})
    tx = db.scalar(select(Transaction).where(Transaction.agreement_id == ag.id))
    if tx is None and ag.funder_signed_at and ag.recipient_signed_at:
        tx = Transaction(agreement_id=ag.id, state=TxState.ACCEPTED.value, principal=quote.principal, currency=quote.currency,
                         total_due=quote.total_due_to_funder, platform_fee=quote.platform_fee)
        db.add(tx)
        db.flush()
        db.add_all([TransactionParty(transaction_id=tx.id, participant_id=offer.participant_id, role="FUNDER"),
                    TransactionParty(transaction_id=tx.id, participant_id=req.participant_id, role="RECIPIENT")])
        db.flush()
        move(db, tx, TxState.AGREED, actor_pid, "both parties signed identical terms")
        req.state = "MATCHED"
    return {"agreement_id": ag.id, "terms_hash": ag.terms_hash, "transaction_id": tx.id if tx else None,
            "state": tx.state if tx else "AWAITING_COUNTERPARTY_SIGNATURE"}


def _tx_for(db: Session, tx_id: str, actor_pid: str, role: str | None = None) -> tuple[Transaction, dict[str, str]]:
    tx = db.get(Transaction, tx_id)
    if tx is None:
        raise LookupError("transaction not found")
    pr = parties(db, tx_id)
    if actor_pid not in pr.values() or (role and pr.get(role) != actor_pid):
        raise Forbidden("not permitted for this transaction")
    return tx, pr


def settle(db: Session, tx_id: str, actor_pid: str, adapter: PaymentPort) -> Transaction:
    tx, pr = _tx_for(db, tx_id, actor_pid, "FUNDER")
    require_gate(db, "PAYMENT_SETTLEMENT")
    move(db, tx, TxState.PENDING_SETTLEMENT, actor_pid, "settlement requested")
    ref = adapter.disburse(tx.id, tx.principal, tx.currency)
    move(db, tx, TxState.ACTIVE, actor_pid, f"disbursement confirmed via {adapter.name} ref={ref}")
    post_journal(db, [(party_account(pr["RECIPIENT"]), "DEBIT", tx.total_due),
                      (party_account(pr["FUNDER"]), "CREDIT", tx.total_due)], tx.currency, tx.id, "obligation created")
    post_journal(db, [(party_account(pr["RECIPIENT"]), "DEBIT", tx.platform_fee),
                      (PLATFORM_FEE_ACCOUNT, "CREDIT", tx.platform_fee)], tx.currency, tx.id, "platform service fee")
    return tx


def record_repayment(db: Session, tx_id: str, actor_pid: str, amount: Decimal) -> Transaction:
    tx, pr = _tx_for(db, tx_id, actor_pid, "FUNDER")
    if tx.state not in (TxState.ACTIVE.value, TxState.PARTIALLY_REPAID.value):
        raise InvalidTransition(f"repayments cannot be recorded in state {tx.state}")
    outstanding = tx.total_due - tx.repaid
    if amount <= 0 or amount > outstanding:
        raise ValueError("amount must be positive and not exceed outstanding")
    db.add(RepaymentEvent(transaction_id=tx.id, amount=amount, recorded_by=actor_pid))
    post_journal(db, [(party_account(pr["FUNDER"]), "DEBIT", amount), (party_account(pr["RECIPIENT"]), "CREDIT", amount)],
                 tx.currency, tx.id, "repayment received (recorded by funder)")
    tx.repaid += amount
    if tx.repaid == tx.total_due:
        move(db, tx, TxState.COMPLETED, actor_pid, "fully repaid")
        add_event(db, pr["RECIPIENT"], 20, "TXN_COMPLETED", "transaction", tx.id)
        add_event(db, pr["FUNDER"], 5, "TXN_COMPLETED", "transaction", tx.id)
    else:
        move(db, tx, TxState.PARTIALLY_REPAID, actor_pid, "partial repayment recorded")
    return tx


def open_dispute(db: Session, tx_id: str, actor_pid: str, reason: str) -> Dispute:
    tx, _ = _tx_for(db, tx_id, actor_pid)
    d = Dispute(transaction_id=tx.id, opened_by=actor_pid, reason=reason)
    db.add(d)
    move(db, tx, TxState.DISPUTED, actor_pid, f"dispute opened: {reason[:200]}")
    return d


def mark_default(db: Session, tx_id: str, admin_id: str, reason: str) -> Transaction:
    tx = db.get(Transaction, tx_id)
    if tx is None:
        raise LookupError("transaction not found")
    pr = parties(db, tx_id)
    move(db, tx, TxState.DEFAULTED, admin_id, reason)
    add_event(db, pr["RECIPIENT"], -100, "TXN_DEFAULTED", "transaction", tx.id)
    return tx
