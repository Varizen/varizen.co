# HAWLAT — Ledger Architecture

## Purpose
An immutable, double-entry **record** of obligations and events between the two parties (and platform fee receivables). It is a bookkeeping record, **not** custody: HAWLAT holds no customer money. "Financial Passport" is a statement view of this ledger, not a wallet.

## Design
- `ledger_accounts` (owner participant or platform fee account, currency, type).
- `ledger_entries`: `id, journal_id, account_id, direction(DEBIT/CREDIT), amount NUMERIC(20,4), currency, transaction_id, cause_event_id, posted_at, idempotency_key`.
- Per `journal_id`: debits = credits (deferred constraint trigger).
- UPDATE/DELETE blocked; corrections via reversing journals referencing the original.
- Postings only via `LedgerService.post(journal)` inside the same DB transaction as the state change and outbox event.
- Idempotent by `(journal_id | idempotency_key)`.
- Balances are derived (materialised views) and reconciled daily against mock/partner settlement files.
- Money type: `Money(amount: Decimal, currency)`; floats rejected.
