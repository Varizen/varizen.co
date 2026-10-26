from __future__ import annotations

from dataclasses import dataclass
from decimal import ROUND_HALF_EVEN, Decimal

_SCALES = {"BDT": 2}
_DEFAULT_SCALE = 2


@dataclass(frozen=True, slots=True)
class Money:
    amount: Decimal
    currency: str

    def __post_init__(self) -> None:
        if isinstance(self.amount, (float, bool)) or not isinstance(self.amount, (Decimal, int, str)):
            raise TypeError("Money amount must be Decimal, int or str; floats are forbidden")
        if len(self.currency) != 3 or not self.currency.isupper():
            raise ValueError("currency must be an ISO 4217 code")
        object.__setattr__(self, "amount", Decimal(self.amount))

    @classmethod
    def of(cls, amount: str | int | Decimal, currency: str = "BDT") -> Money:
        return cls(Decimal(amount), currency)

    def _check(self, other: Money) -> None:
        if self.currency != other.currency:
            raise ValueError("currency mismatch")

    def __add__(self, other: Money) -> Money:
        self._check(other)
        return Money(self.amount + other.amount, self.currency)

    def __sub__(self, other: Money) -> Money:
        self._check(other)
        return Money(self.amount - other.amount, self.currency)

    def quantize(self) -> Money:
        scale = _SCALES.get(self.currency, _DEFAULT_SCALE)
        return Money(self.amount.quantize(Decimal(1).scaleb(-scale), rounding=ROUND_HALF_EVEN), self.currency)

    def split(self, parts: int) -> list[Money]:
        """Split into equal quantized parts; any rounding residue goes to the last part."""
        if parts < 1:
            raise ValueError("parts must be >= 1")
        total = self.quantize()
        base = Money(total.amount / parts, self.currency).quantize()
        result = [base] * (parts - 1)
        result.append(total - Money(base.amount * (parts - 1), self.currency))
        return result
