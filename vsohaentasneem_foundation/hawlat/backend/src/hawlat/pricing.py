"""Deterministic Decimal pricing. [LEGAL_REVIEW_REQUIRED] for charge caps and fee characterisation."""
from __future__ import annotations

from decimal import Decimal

from .core import Config
from .shared.money import Money

PRICING_VERSION = 1


def price(principal: Decimal, currency: str, tenor_weeks: int, charge_bps_per_week: int, cfg: Config) -> dict:
    p = Money(principal, currency).quantize()
    charge = Money(p.amount * Decimal(charge_bps_per_week) / Decimal(10_000) * tenor_weeks, currency).quantize()
    fee = Money(p.amount * Decimal(cfg.int("PLATFORM_FEE_BPS")) / Decimal(10_000), currency).quantize()
    total_to_funder = p + charge
    instalments = total_to_funder.split(tenor_weeks)
    return {
        "principal": p.amount, "party_charge": charge.amount, "platform_fee": fee.amount,
        "total_due_to_funder": total_to_funder.amount,
        "schedule": [{"week": i + 1, "due": str(m.amount)} for i, m in enumerate(instalments)],
        "pricing_version": PRICING_VERSION,
    }
