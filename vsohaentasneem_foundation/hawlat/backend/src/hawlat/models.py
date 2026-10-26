from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal
from uuid import uuid4

from sqlalchemy import (JSON, CheckConstraint, DateTime, ForeignKey, Index, Integer, String,
                        Text, UniqueConstraint, event)
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column

from .db import DecimalType


def new_id() -> str:
    return uuid4().hex


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


def _pk() -> Mapped[str]:
    return mapped_column(String(32), primary_key=True, default=new_id)


def _ts() -> Mapped[datetime]:
    return mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)


class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = _pk()
    email: Mapped[str] = mapped_column(String(254), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="participant")
    created_at: Mapped[datetime] = _ts()
    __table_args__ = (CheckConstraint("role IN ('participant','admin','compliance')"),)


class Participant(Base):
    __tablename__ = "participants"
    id: Mapped[str] = _pk()
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), unique=True)
    display_name: Mapped[str] = mapped_column(String(120))
    verification_level: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(20), default="ACTIVE")
    created_at: Mapped[datetime] = _ts()
    __table_args__ = (CheckConstraint("status IN ('ACTIVE','SUSPENDED','DELETED')"),)


class ReputationEvent(Base):  # append-only
    __tablename__ = "reputation_events"
    id: Mapped[str] = _pk()
    participant_id: Mapped[str] = mapped_column(ForeignKey("participants.id"), index=True)
    delta: Mapped[int] = mapped_column(Integer)
    reason_code: Mapped[str] = mapped_column(String(60))
    source: Mapped[str] = mapped_column(String(60))
    ref_id: Mapped[str | None] = mapped_column(String(32))
    algorithm_version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = _ts()


class ReputationAppeal(Base):
    __tablename__ = "reputation_appeals"
    id: Mapped[str] = _pk()
    participant_id: Mapped[str] = mapped_column(ForeignKey("participants.id"))
    event_id: Mapped[str] = mapped_column(ForeignKey("reputation_events.id"))
    reason: Mapped[str] = mapped_column(Text)
    state: Mapped[str] = mapped_column(String(20), default="OPEN")
    decided_by: Mapped[str | None] = mapped_column(String(32))
    created_at: Mapped[datetime] = _ts()
    __table_args__ = (CheckConstraint("state IN ('OPEN','UPHELD','REJECTED')"),)


class FinancingRequest(Base):
    __tablename__ = "financing_requests"
    id: Mapped[str] = _pk()
    participant_id: Mapped[str] = mapped_column(ForeignKey("participants.id"), index=True)
    amount: Mapped[Decimal] = mapped_column(DecimalType)
    currency: Mapped[str] = mapped_column(String(3), default="BDT")
    tenor_weeks: Mapped[int] = mapped_column(Integer)
    purpose: Mapped[str] = mapped_column(String(200), default="")
    state: Mapped[str] = mapped_column(String(20), default="PUBLISHED")
    created_at: Mapped[datetime] = _ts()
    __table_args__ = (CheckConstraint("amount > 0"), CheckConstraint("tenor_weeks > 0"))


class FinancingOffer(Base):
    __tablename__ = "financing_offers"
    id: Mapped[str] = _pk()
    participant_id: Mapped[str] = mapped_column(ForeignKey("participants.id"), index=True)
    min_amount: Mapped[Decimal] = mapped_column(DecimalType)
    max_amount: Mapped[Decimal] = mapped_column(DecimalType)
    currency: Mapped[str] = mapped_column(String(3), default="BDT")
    max_tenor_weeks: Mapped[int] = mapped_column(Integer)
    charge_bps_per_week: Mapped[int] = mapped_column(Integer)
    state: Mapped[str] = mapped_column(String(20), default="PUBLISHED")
    created_at: Mapped[datetime] = _ts()
    __table_args__ = (CheckConstraint("min_amount > 0 AND max_amount >= min_amount"),
                      CheckConstraint("charge_bps_per_week >= 0"))


class Match(Base):
    __tablename__ = "matches"
    id: Mapped[str] = _pk()
    request_id: Mapped[str] = mapped_column(ForeignKey("financing_requests.id"))
    offer_id: Mapped[str] = mapped_column(ForeignKey("financing_offers.id"))
    created_at: Mapped[datetime] = _ts()
    __table_args__ = (UniqueConstraint("request_id", "offer_id"),)


class Quote(Base):
    __tablename__ = "quotes"
    id: Mapped[str] = _pk()
    match_id: Mapped[str] = mapped_column(ForeignKey("matches.id"))
    principal: Mapped[Decimal] = mapped_column(DecimalType)
    currency: Mapped[str] = mapped_column(String(3))
    tenor_weeks: Mapped[int] = mapped_column(Integer)
    party_charge: Mapped[Decimal] = mapped_column(DecimalType)
    platform_fee: Mapped[Decimal] = mapped_column(DecimalType)
    total_due_to_funder: Mapped[Decimal] = mapped_column(DecimalType)
    schedule: Mapped[list] = mapped_column(JSON)
    config_version: Mapped[int] = mapped_column(Integer)
    pricing_version: Mapped[int] = mapped_column(Integer, default=1)
    terms_hash: Mapped[str] = mapped_column(String(64))
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    created_by: Mapped[str] = mapped_column(ForeignKey("participants.id"))
    created_at: Mapped[datetime] = _ts()


class Agreement(Base):
    __tablename__ = "agreements"
    id: Mapped[str] = _pk()
    quote_id: Mapped[str] = mapped_column(ForeignKey("quotes.id"), unique=True)
    terms_hash: Mapped[str] = mapped_column(String(64))
    funder_signed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    recipient_signed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = _ts()


class Transaction(Base):
    __tablename__ = "transactions"
    id: Mapped[str] = _pk()
    agreement_id: Mapped[str] = mapped_column(ForeignKey("agreements.id"), unique=True)
    state: Mapped[str] = mapped_column(String(30), index=True)
    principal: Mapped[Decimal] = mapped_column(DecimalType)
    currency: Mapped[str] = mapped_column(String(3))
    total_due: Mapped[Decimal] = mapped_column(DecimalType)
    platform_fee: Mapped[Decimal] = mapped_column(DecimalType)
    repaid: Mapped[Decimal] = mapped_column(DecimalType, default=Decimal("0"))
    version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = _ts()
    __table_args__ = (CheckConstraint("principal > 0"), CheckConstraint("repaid >= 0"))


class TransactionParty(Base):
    __tablename__ = "transaction_parties"
    id: Mapped[str] = _pk()
    transaction_id: Mapped[str] = mapped_column(ForeignKey("transactions.id"))
    participant_id: Mapped[str] = mapped_column(ForeignKey("participants.id"))
    role: Mapped[str] = mapped_column(String(10))
    __table_args__ = (UniqueConstraint("transaction_id", "role"),
                      UniqueConstraint("transaction_id", "participant_id"),
                      CheckConstraint("role IN ('FUNDER','RECIPIENT')"))  # the platform can never be a party


class TransactionTransition(Base):  # append-only
    __tablename__ = "transaction_transitions"
    id: Mapped[str] = _pk()
    transaction_id: Mapped[str] = mapped_column(ForeignKey("transactions.id"), index=True)
    previous_state: Mapped[str] = mapped_column(String(30))
    new_state: Mapped[str] = mapped_column(String(30))
    actor: Mapped[str] = mapped_column(String(64))
    reason: Mapped[str] = mapped_column(String(300))
    event_id: Mapped[str] = mapped_column(String(32), unique=True)
    occurred_at: Mapped[datetime] = _ts()


class RepaymentEvent(Base):
    __tablename__ = "repayment_events"
    id: Mapped[str] = _pk()
    transaction_id: Mapped[str] = mapped_column(ForeignKey("transactions.id"), index=True)
    amount: Mapped[Decimal] = mapped_column(DecimalType)
    recorded_by: Mapped[str] = mapped_column(ForeignKey("participants.id"))
    created_at: Mapped[datetime] = _ts()
    __table_args__ = (CheckConstraint("amount > 0"),)


class LedgerEntry(Base):  # append-only
    __tablename__ = "ledger_entries"
    id: Mapped[str] = _pk()
    journal_id: Mapped[str] = mapped_column(String(32), index=True)
    account: Mapped[str] = mapped_column(String(80), index=True)
    direction: Mapped[str] = mapped_column(String(6))
    amount: Mapped[Decimal] = mapped_column(DecimalType)
    currency: Mapped[str] = mapped_column(String(3))
    transaction_id: Mapped[str | None] = mapped_column(ForeignKey("transactions.id"))
    memo: Mapped[str] = mapped_column(String(120))
    created_at: Mapped[datetime] = _ts()
    __table_args__ = (CheckConstraint("amount > 0"), CheckConstraint("direction IN ('DEBIT','CREDIT')"))


class OutboxEvent(Base):
    __tablename__ = "outbox_events"
    id: Mapped[str] = _pk()
    type: Mapped[str] = mapped_column(String(60))
    aggregate_id: Mapped[str] = mapped_column(String(32))
    payload: Mapped[dict] = mapped_column(JSON)
    attempts: Mapped[int] = mapped_column(Integer, default=0)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = _ts()


class IdempotencyKey(Base):
    __tablename__ = "idempotency_keys"
    id: Mapped[str] = _pk()
    actor: Mapped[str] = mapped_column(String(32))
    route: Mapped[str] = mapped_column(String(120))
    key: Mapped[str] = mapped_column(String(120))
    request_hash: Mapped[str] = mapped_column(String(64))
    response: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = _ts()
    __table_args__ = (UniqueConstraint("actor", "route", "key"),)


class AuditLog(Base):  # append-only, hash-chained
    __tablename__ = "audit_logs"
    id: Mapped[str] = _pk()
    seq: Mapped[int] = mapped_column(Integer, unique=True)
    actor: Mapped[str] = mapped_column(String(64))
    action: Mapped[str] = mapped_column(String(80))
    entity: Mapped[str] = mapped_column(String(40))
    entity_id: Mapped[str] = mapped_column(String(40))
    detail: Mapped[dict] = mapped_column(JSON)
    prev_hash: Mapped[str] = mapped_column(String(64))
    hash: Mapped[str] = mapped_column(String(64))
    created_at: Mapped[datetime] = _ts()


class ConfigurationVersion(Base):  # append-only by convention: new version per change
    __tablename__ = "configuration_versions"
    id: Mapped[str] = _pk()
    version: Mapped[int] = mapped_column(Integer, unique=True)
    values: Mapped[dict] = mapped_column(JSON)
    created_by: Mapped[str] = mapped_column(String(64))
    created_at: Mapped[datetime] = _ts()


class GateState(Base):
    __tablename__ = "gate_states"
    feature: Mapped[str] = mapped_column(String(60), primary_key=True)
    status: Mapped[str] = mapped_column(String(30), default="PLANNED")
    required: Mapped[list] = mapped_column(JSON)
    satisfied: Mapped[list] = mapped_column(JSON, default=list)
    approvals: Mapped[list] = mapped_column(JSON, default=list)
    version: Mapped[int] = mapped_column(Integer, default=1)


class RiskEvent(Base):
    __tablename__ = "risk_events"
    id: Mapped[str] = _pk()
    participant_id: Mapped[str] = mapped_column(ForeignKey("participants.id"))
    subject: Mapped[str] = mapped_column(String(40))
    outcome: Mapped[str] = mapped_column(String(10))
    reason_codes: Mapped[list] = mapped_column(JSON)
    config_version: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = _ts()


class Dispute(Base):
    __tablename__ = "disputes"
    id: Mapped[str] = _pk()
    transaction_id: Mapped[str] = mapped_column(ForeignKey("transactions.id"))
    opened_by: Mapped[str] = mapped_column(ForeignKey("participants.id"))
    reason: Mapped[str] = mapped_column(Text)
    state: Mapped[str] = mapped_column(String(20), default="OPEN")
    created_at: Mapped[datetime] = _ts()


class Notification(Base):
    __tablename__ = "notifications"
    id: Mapped[str] = _pk()
    participant_id: Mapped[str] = mapped_column(ForeignKey("participants.id"), index=True)
    kind: Mapped[str] = mapped_column(String(60))
    body: Mapped[str] = mapped_column(String(300))
    read: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = _ts()


Index("ix_tx_party_participant", TransactionParty.participant_id)

APPEND_ONLY = (LedgerEntry, ReputationEvent, AuditLog, TransactionTransition)


class ImmutableRecord(Exception):
    pass


@event.listens_for(Session, "before_flush")
def _block_mutation_of_append_only(session: Session, ctx, instances) -> None:
    for obj in session.deleted:
        if isinstance(obj, APPEND_ONLY):
            raise ImmutableRecord(f"{type(obj).__name__} is append-only")
    for obj in session.dirty:
        if isinstance(obj, APPEND_ONLY) and session.is_modified(obj):
            raise ImmutableRecord(f"{type(obj).__name__} is append-only")
