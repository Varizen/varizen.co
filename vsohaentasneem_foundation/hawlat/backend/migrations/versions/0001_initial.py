"""initial schema, append-only and ledger-balance enforcement

Revision ID: 0001
"""
from alembic import op

from hawlat.models import Base

revision = "0001"
down_revision = None

APPEND_ONLY_TABLES = ("ledger_entries", "reputation_events", "audit_logs", "transaction_transitions")

PG_FUNCTIONS = """
CREATE OR REPLACE FUNCTION hawlat_block_mutation() RETURNS trigger AS $$
BEGIN RAISE EXCEPTION '% is append-only', TG_TABLE_NAME; END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION hawlat_check_journal_balanced() RETURNS trigger AS $$
DECLARE d numeric; c numeric;
BEGIN
  SELECT COALESCE(SUM(amount) FILTER (WHERE direction = 'DEBIT'), 0),
         COALESCE(SUM(amount) FILTER (WHERE direction = 'CREDIT'), 0)
    INTO d, c FROM ledger_entries WHERE journal_id = NEW.journal_id;
  IF d <> c THEN RAISE EXCEPTION 'journal % is unbalanced (debit %, credit %)', NEW.journal_id, d, c; END IF;
  RETURN NULL;
END; $$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER ledger_journal_balanced AFTER INSERT ON ledger_entries
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION hawlat_check_journal_balanced();
"""


def upgrade() -> None:
    bind = op.get_bind()
    Base.metadata.create_all(bind)
    if bind.dialect.name == "postgresql":
        op.execute(PG_FUNCTIONS)
        for table in APPEND_ONLY_TABLES:
            op.execute(f"CREATE TRIGGER {table}_append_only BEFORE UPDATE OR DELETE ON {table} "
                       f"FOR EACH ROW EXECUTE FUNCTION hawlat_block_mutation()")


def downgrade() -> None:
    raise RuntimeError("Forward-only: financial records are never dropped by migration")
