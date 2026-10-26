from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum


class GateStatus(str, Enum):
    PLANNED = "PLANNED"
    LEGAL_REVIEW = "LEGAL_REVIEW"
    PARTNER_REQUIRED = "PARTNER_REQUIRED"
    PARTNER_CONNECTED = "PARTNER_CONNECTED"
    COMPLIANCE_APPROVED = "COMPLIANCE_APPROVED"
    ENABLED = "ENABLED"
    SUSPENDED = "SUSPENDED"


_ORDER = [
    GateStatus.PLANNED,
    GateStatus.LEGAL_REVIEW,
    GateStatus.PARTNER_REQUIRED,
    GateStatus.PARTNER_CONNECTED,
    GateStatus.COMPLIANCE_APPROVED,
    GateStatus.ENABLED,
]


class GateBlocked(Exception):
    def __init__(self, feature: str, status: GateStatus, missing: frozenset[str]):
        super().__init__(f"{feature} blocked: status={status.value}, missing={sorted(missing)}")
        self.feature, self.status, self.missing = feature, status, missing


@dataclass
class Gate:
    feature: str
    required: frozenset[str]
    status: GateStatus = GateStatus.PLANNED
    satisfied: set[str] = field(default_factory=set)

    def missing(self) -> frozenset[str]:
        return self.required - self.satisfied


class GateRegistry:
    """Default-deny registry. Enabling needs two distinct approvers and all requirements satisfied."""

    def __init__(self) -> None:
        self._gates: dict[str, Gate] = {}

    def register(self, gate: Gate) -> None:
        self._gates[gate.feature] = gate

    def require(self, feature: str) -> None:
        gate = self._gates.get(feature)
        if gate is None:
            raise GateBlocked(feature, GateStatus.PLANNED, frozenset({"UNREGISTERED_FEATURE"}))
        if gate.status is not GateStatus.ENABLED or gate.missing():
            raise GateBlocked(feature, gate.status, gate.missing())

    def advance(self, feature: str, to: GateStatus, approvers: set[str]) -> None:
        gate = self._gates[feature]
        if to is GateStatus.SUSPENDED:
            gate.status = to
            return
        if gate.status is GateStatus.SUSPENDED:
            raise ValueError("suspended gates must be re-reviewed from LEGAL_REVIEW")
        if _ORDER.index(to) != _ORDER.index(gate.status) + 1:
            raise ValueError("gate states must advance one step at a time")
        if to is GateStatus.ENABLED:
            if len(approvers) < 2:
                raise ValueError("two distinct approvers required to enable")
            if gate.missing():
                raise ValueError(f"requirements unsatisfied: {sorted(gate.missing())}")
        gate.status = to
