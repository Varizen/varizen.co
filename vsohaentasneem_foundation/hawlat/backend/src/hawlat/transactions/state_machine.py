from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
from uuid import uuid4


class TxState(str, Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    MATCHED = "MATCHED"
    OFFERED = "OFFERED"
    ACCEPTED = "ACCEPTED"
    AGREED = "AGREED"
    PENDING_SETTLEMENT = "PENDING_SETTLEMENT"
    ACTIVE = "ACTIVE"
    PARTIALLY_REPAID = "PARTIALLY_REPAID"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    EXPIRED = "EXPIRED"
    DISPUTED = "DISPUTED"
    DEFAULTED = "DEFAULTED"
    SUSPENDED = "SUSPENDED"


S = TxState
ALLOWED: dict[TxState, frozenset[TxState]] = {
    S.DRAFT: frozenset({S.PUBLISHED, S.CANCELLED}),
    S.PUBLISHED: frozenset({S.MATCHED, S.CANCELLED, S.EXPIRED, S.SUSPENDED}),
    S.MATCHED: frozenset({S.OFFERED, S.PUBLISHED, S.CANCELLED, S.EXPIRED, S.SUSPENDED}),
    S.OFFERED: frozenset({S.ACCEPTED, S.MATCHED, S.CANCELLED, S.EXPIRED, S.SUSPENDED}),
    S.ACCEPTED: frozenset({S.AGREED, S.CANCELLED, S.EXPIRED, S.SUSPENDED}),
    S.AGREED: frozenset({S.PENDING_SETTLEMENT, S.CANCELLED, S.DISPUTED, S.SUSPENDED}),
    S.PENDING_SETTLEMENT: frozenset({S.ACTIVE, S.CANCELLED, S.DISPUTED, S.SUSPENDED}),
    S.ACTIVE: frozenset({S.PARTIALLY_REPAID, S.COMPLETED, S.DISPUTED, S.DEFAULTED, S.SUSPENDED}),
    S.PARTIALLY_REPAID: frozenset({S.PARTIALLY_REPAID, S.COMPLETED, S.DISPUTED, S.DEFAULTED, S.SUSPENDED}),
    S.DISPUTED: frozenset({S.ACTIVE, S.PARTIALLY_REPAID, S.COMPLETED, S.DEFAULTED, S.CANCELLED}),
    S.SUSPENDED: frozenset({S.ACTIVE, S.PUBLISHED, S.CANCELLED}),
    S.DEFAULTED: frozenset(),
    S.COMPLETED: frozenset(),
    S.CANCELLED: frozenset(),
    S.EXPIRED: frozenset(),
}


class InvalidTransition(Exception):
    pass


@dataclass(frozen=True, slots=True)
class Transition:
    previous_state: TxState
    new_state: TxState
    actor: str
    reason: str
    timestamp: datetime
    event_id: str


def transition(current: TxState, new: TxState, *, actor: str, reason: str) -> Transition:
    if not actor or not reason.strip():
        raise InvalidTransition("actor and reason are required for every state change")
    if new not in ALLOWED[current]:
        raise InvalidTransition(f"{current.value} -> {new.value} is not allowed")
    return Transition(current, new, actor, reason, datetime.now(timezone.utc), uuid4().hex)
