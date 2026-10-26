from __future__ import annotations

from decimal import Decimal
from typing import Protocol

from .db import Settings
from .models import new_id


class PaymentPort(Protocol):
    name: str

    def disburse(self, transaction_id: str, amount: Decimal, currency: str) -> str: ...


class MockPaymentAdapter:
    """Simulation only. No money moves. Refused in production."""

    name = "MOCK"

    def disburse(self, transaction_id: str, amount: Decimal, currency: str) -> str:
        return f"MOCK-{new_id()}"


def get_payment_adapter(settings: Settings) -> PaymentPort:
    if settings.env == "production":
        raise RuntimeError("No approved payment partner adapter configured; mock adapter is forbidden in production")
    return MockPaymentAdapter()
