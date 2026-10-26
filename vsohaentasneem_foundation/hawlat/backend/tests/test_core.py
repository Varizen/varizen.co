import pytest

from hawlat.gates.registry import Gate, GateBlocked, GateRegistry, GateStatus
from hawlat.shared.money import Money
from hawlat.transactions.state_machine import ALLOWED, InvalidTransition, TxState, transition


def test_money_rejects_float():
    with pytest.raises(TypeError):
        Money(0.1, "BDT")


def test_money_split_sums_exactly():
    parts = Money.of("100.00").split(3)
    assert sum((p.amount for p in parts), start=Money.of(0).amount) == Money.of("100.00").amount
    assert [str(p.amount) for p in parts] == ["33.33", "33.33", "33.34"]


def test_money_currency_mismatch():
    with pytest.raises(ValueError):
        Money.of(1, "BDT") + Money.of(1, "USD")


def test_valid_transition_records_audit_fields():
    t = transition(TxState.DRAFT, TxState.PUBLISHED, actor="p1", reason="user published")
    assert (t.previous_state, t.new_state, t.actor, t.event_id) == (TxState.DRAFT, TxState.PUBLISHED, "p1", t.event_id)


@pytest.mark.parametrize("cur,new", [(TxState.DRAFT, TxState.ACTIVE), (TxState.COMPLETED, TxState.ACTIVE)])
def test_invalid_transition(cur, new):
    with pytest.raises(InvalidTransition):
        transition(cur, new, actor="a", reason="x")


def test_reason_required():
    with pytest.raises(InvalidTransition):
        transition(TxState.DRAFT, TxState.PUBLISHED, actor="a", reason=" ")


def test_terminal_states_have_no_exits():
    for s in (TxState.COMPLETED, TxState.CANCELLED, TxState.EXPIRED, TxState.DEFAULTED):
        assert not ALLOWED[s]


def test_gate_blocks_by_default_and_enables_with_two_approvers():
    reg = GateRegistry()
    reg.register(Gate("PAYMENT_SETTLEMENT", frozenset({"AUTHORIZED_PAYMENT_PARTNER"})))
    with pytest.raises(GateBlocked):
        reg.require("PAYMENT_SETTLEMENT")
    with pytest.raises(GateBlocked):
        reg.require("UNKNOWN")
    for s in (GateStatus.LEGAL_REVIEW, GateStatus.PARTNER_REQUIRED, GateStatus.PARTNER_CONNECTED, GateStatus.COMPLIANCE_APPROVED):
        reg.advance("PAYMENT_SETTLEMENT", s, {"admin"})
    with pytest.raises(ValueError):
        reg.advance("PAYMENT_SETTLEMENT", GateStatus.ENABLED, {"admin"})
    reg._gates["PAYMENT_SETTLEMENT"].satisfied.add("AUTHORIZED_PAYMENT_PARTNER")
    reg.advance("PAYMENT_SETTLEMENT", GateStatus.ENABLED, {"admin", "compliance"})
    reg.require("PAYMENT_SETTLEMENT")
    reg.advance("PAYMENT_SETTLEMENT", GateStatus.SUSPENDED, set())
    with pytest.raises(GateBlocked):
        reg.require("PAYMENT_SETTLEMENT")
