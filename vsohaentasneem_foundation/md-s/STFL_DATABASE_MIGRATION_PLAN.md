# STFL AIO — Master Database Migration Plan (Parties, IAM & Core Schemas)

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-DB-MIG-V1`  
**Date:** 2026-10-15  
**Target Migration:** `0002_aio_parties_iam.sql`  
**Status:** MIGRATION SPECIFICATION — RATIFIED (PHASE 0)  
**Safety Protocol:** STRICTLY ADDITIVE / ZERO DATA LOSS / IDEMPOTENT

---

## 1. Migration Protocol & Verification Order

To ensure that the existing running system in [`apk/api`](file:///c:/Users/ShoebTahseen/Desktop/stfl/apk/api) and [`apk/docs/DATABASE.md`](file:///c:/Users/ShoebTahseen/Desktop/stfl/apk/docs/DATABASE.md) is never disrupted:

```mermaid
flowchart LR
    S1[1. Verify Baseline: 0001_init.sql] --> S2[2. Additive Parties & Relationship Tables]
    S2 --> S3[3. User-Party Bridge Column]
    S3 --> S4[4. Scopes & Approval Chain Tables]
    S4 --> S5[5. First-Class Lease & Occupancy Tables]
    S5 --> S6[6. Device, Print & Comms Gateway Tables]
    S6 --> S7[7. Verify Triggers & Invariants]
```

### Absolute Constraints:
1. **Never Drop**: Zero `DROP TABLE` or `DROP COLUMN` commands.
2. **Numeric Arithmetic**: All currency fields (`rent_amount`, `loan_amount`, `stipend`, etc.) use `NUMERIC(18, 2)`.
3. **Transaction Wrapping**: All DDL commands run inside `BEGIN ... COMMIT`.
4. **Idempotency**: All tables use `IF NOT EXISTS` and all constraints use safe existence checks.

---

## 2. The User-to-Party Bridge Strategy

The baseline `users` table created in `0001_init.sql` represents authentication credentials (email, password hash, failed logins). 

To bridge existing users into the new **Party & Relationship Engine** without breaking backward compatibility:
```sql
-- Additive foreign key column pointing to parties
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS party_id UUID REFERENCES parties(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_users_party_id ON users (party_id);
```

For every existing user in the database, a deterministic migration script generates an initial `PERSON` Party record and links `users.party_id = parties.id`, leaving existing authentication routes (`/auth/login`, `/auth/refresh`) completely functional and untouched.

---

## 3. Complete DDL for `0002_aio_parties_iam.sql`

```sql
-- =============================================================================
-- STFL Platform — Migration 0002: Party, Relationship & IAM Architecture
--
-- Strictly additive. Preserves all tables from 0001_init.sql.
-- =============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. Generic Party Abstraction
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS parties (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    party_id             TEXT NOT NULL UNIQUE,          -- STFL-PER-000021
    party_type           TEXT NOT NULL CHECK (party_type IN (
                           'PERSON', 'ORGANIZATION', 'COMPANY', 
                           'GOVERNMENT_ENTITY', 'NGO', 'FOUNDATION', 
                           'TRUST', 'HOUSEHOLD', 'OTHER_LEGAL_ENTITY'
                         )),
    legal_name_bn        TEXT NOT NULL,
    legal_name_en        TEXT NOT NULL,
    trade_name           TEXT,
    national_id_hash     TEXT,
    tax_identifier_hash  TEXT,
    primary_contact_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    address_json         JSONB NOT NULL DEFAULT '{}'::jsonb,
    status               TEXT NOT NULL DEFAULT 'ACTIVE'
                         CHECK (status IN ('ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED', 'MERGED', 'DECEASED', 'DISSOLVED')),
    metadata             JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_parties_type ON parties (party_type);
CREATE INDEX IF NOT EXISTS idx_parties_status ON parties (status);
CREATE INDEX IF NOT EXISTS idx_parties_nid_hash ON parties (national_id_hash) WHERE national_id_hash IS NOT NULL;

-- Bridge users to parties
ALTER TABLE users ADD COLUMN IF NOT EXISTS party_id UUID REFERENCES parties(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_users_party_id ON users (party_id);

-- ---------------------------------------------------------------------------
-- 2. Universal Party Relationship Engine
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS party_relationships (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relationship_id      TEXT NOT NULL UNIQUE,          -- STFL-REL-2026-000492
    party_a_id           UUID NOT NULL REFERENCES parties(id) ON DELETE RESTRICT,
    party_b_id           UUID REFERENCES parties(id) ON DELETE RESTRICT,
    relationship_type    TEXT NOT NULL,
    resource_type        TEXT,
    resource_id          TEXT,
    contract_id          UUID,
    organization_id      UUID REFERENCES parties(id) ON DELETE RESTRICT,
    scope_id             TEXT,
    start_at             TIMESTAMPTZ NOT NULL,
    end_at               TIMESTAMPTZ,
    status               TEXT NOT NULL DEFAULT 'ACTIVE'
                         CHECK (status IN (
                           'PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 
                           'TERMINATED', 'REVOKED', 'DISPUTED', 'CANCELLED'
                         )),
    source_document_id   TEXT,
    metadata             JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT rel_parties_distinct CHECK (party_b_id IS NULL OR party_a_id <> party_b_id)
);

CREATE INDEX IF NOT EXISTS idx_party_rel_a ON party_relationships (party_a_id, relationship_type, status);
CREATE INDEX IF NOT EXISTS idx_party_rel_b ON party_relationships (party_b_id, relationship_type, status);
CREATE INDEX IF NOT EXISTS idx_party_rel_resource ON party_relationships (resource_type, resource_id);

-- ---------------------------------------------------------------------------
-- 3. First-Class Scopes & Console Access Policies
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS iam_scopes (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scope_code           TEXT NOT NULL UNIQUE,          -- SCP-REG-DHK-01
    scope_type           TEXT NOT NULL CHECK (scope_type IN (
                           'GLOBAL', 'ORGANIZATION', 'UNIT', 'REGION', 
                           'PROJECT', 'PROPERTY', 'PORTFOLIO', 'ASSIGNED_RECORD'
                         )),
    name_bn              TEXT NOT NULL,
    name_en              TEXT NOT NULL,
    target_entity_type   TEXT,
    target_entity_id     TEXT,
    parent_scope_id      UUID REFERENCES iam_scopes(id) ON DELETE SET NULL,
    metadata             JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_scopes (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scope_id             UUID NOT NULL REFERENCES iam_scopes(id) ON DELETE CASCADE,
    role_id              INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    valid_from           TIMESTAMPTZ NOT NULL DEFAULT now(),
    valid_until          TIMESTAMPTZ,
    granted_by           UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT user_scope_unique UNIQUE (user_id, scope_id, role_id)
);

CREATE TABLE IF NOT EXISTS iam_console_policies (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    console_code         TEXT NOT NULL,
    user_class           TEXT NOT NULL,
    access_level         TEXT NOT NULL CHECK (access_level IN (
                           'FULL', 'MANAGE', 'OVERSIGHT', 'OPERATIONAL', 
                           'FIELD', 'LIMITED', 'ISSUE_GATED', 'OWN_EVENTS', 'DENIED'
                         )),
    conditions_json      JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT console_policy_unique UNIQUE (console_code, user_class)
);

-- ---------------------------------------------------------------------------
-- 4. Property Portfolio, Units, First-Class Leases & Occupancies
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS properties_v2 (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_code        TEXT NOT NULL UNIQUE,          -- STFL-PRP-DHK-0001
    title_bn             TEXT NOT NULL,
    title_en             TEXT NOT NULL,
    property_class       TEXT NOT NULL CHECK (property_class IN (
                           'RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'AGRICULTURAL', 
                           'OFFICE', 'RETAIL', 'WAREHOUSE', 'MIXED_USE', 
                           'INSTITUTIONAL', 'RELIGIOUS', 'CHARITABLE', 'COMMUNITY', 
                           'VACANT', 'OTHER'
                         )),
    is_waqf              BOOLEAN NOT NULL DEFAULT FALSE,
    waqf_estate_name     TEXT,
    address_text         TEXT NOT NULL,
    division             TEXT NOT NULL,
    district             TEXT NOT NULL,
    upazila_thana        TEXT NOT NULL,
    geo_point            JSONB,
    deed_reference       TEXT,
    mutation_number      TEXT,
    status               TEXT NOT NULL DEFAULT 'ACTIVE'
                         CHECK (status IN ('ACTIVE', 'DISPUTED', 'UNDER_CONSTRUCTION', 'DISPOSED')),
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS property_units (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_code            TEXT NOT NULL UNIQUE,          -- STFL-PRP-DHK-0001-U01
    property_id          UUID NOT NULL REFERENCES properties_v2(id) ON DELETE RESTRICT,
    floor_level          TEXT NOT NULL,
    unit_label           TEXT NOT NULL,
    area_sqft            NUMERIC(10, 2) NOT NULL,
    default_use          TEXT NOT NULL,
    meter_identifiers    JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_occupied          BOOLEAN NOT NULL DEFAULT FALSE,
    status               TEXT NOT NULL DEFAULT 'VACANT'
                         CHECK (status IN ('VACANT', 'LEASED', 'UNDER_MAINTENANCE', 'RESERVED')),
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leases (
    id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lease_code                TEXT NOT NULL UNIQUE,          -- STFL-LSE-2026-000001-X8P4
    unit_id                   UUID NOT NULL REFERENCES property_units(id) ON DELETE RESTRICT,
    lessor_party_id           UUID NOT NULL REFERENCES parties(id) ON DELETE RESTRICT,
    lessee_party_id           UUID NOT NULL REFERENCES parties(id) ON DELETE RESTRICT,
    tenancy_class             TEXT NOT NULL CHECK (tenancy_class IN (
                                'COMMERCIAL', 'NON_COMMERCIAL', 'RESIDENTIAL', 'ORGANIZATIONAL', 'OTHER'
                              )),
    occupancy_type            TEXT NOT NULL CHECK (occupancy_type IN ('SOLE', 'JOINT', 'CORPORATE', 'INSTITUTIONAL')),
    property_use_clause       TEXT NOT NULL,
    start_date                DATE NOT NULL,
    end_date                  DATE NOT NULL,
    rent_amount               NUMERIC(18, 2) NOT NULL,
    currency                  CHAR(3) NOT NULL DEFAULT 'BDT',
    security_deposit          NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    payment_cycle             TEXT NOT NULL CHECK (payment_cycle IN ('MONTHLY', 'QUARTERLY', 'BI_ANNUAL', 'ANNUAL')),
    due_day_of_month          SMALLINT NOT NULL DEFAULT 5 CHECK (due_day_of_month BETWEEN 1 AND 31),
    escalation_clause_json    JSONB NOT NULL DEFAULT '{}'::jsonb,
    utility_responsibility    JSONB NOT NULL DEFAULT '{}'::jsonb,
    maintenance_responsibility JSONB NOT NULL DEFAULT '{}'::jsonb,
    notice_period_days        INTEGER NOT NULL DEFAULT 60,
    renewal_terms             TEXT,
    source_document_id        TEXT,
    status                    TEXT NOT NULL DEFAULT 'PENDING'
                              CHECK (status IN (
                                'DRAFT', 'PENDING', 'ACTIVE', 'EXPIRING', 
                                'EXPIRED', 'RENEWAL_PENDING', 'RENEWED', 
                                'TERMINATED', 'CANCELLED', 'DISPUTED'
                              )),
    approved_by               UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT lease_dates_valid CHECK (end_date > start_date)
);

CREATE TABLE IF NOT EXISTS unit_occupancies (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id              UUID NOT NULL REFERENCES property_units(id) ON DELETE RESTRICT,
    lease_id             UUID REFERENCES leases(id) ON DELETE CASCADE,
    occupant_party_id    UUID NOT NULL REFERENCES parties(id) ON DELETE RESTRICT,
    occupancy_role       TEXT NOT NULL CHECK (occupancy_role IN (
                           'PRIMARY_TENANT', 'CO_TENANT', 'AUTHORIZED_OCCUPANT', 
                           'DEPENDENT', 'EMPLOYEE_OCCUPANT', 'GUEST', 
                           'CARETAKER', 'UNAUTHORIZED_OCCUPANT'
                         )),
    start_date           DATE NOT NULL,
    end_date             DATE,
    emergency_contact    JSONB,
    police_verification_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (police_verification_status IN ('PENDING', 'SUBMITTED', 'VERIFIED', 'EXEMPT')),
    status               TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'VACATED', 'EVICTED')),
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 5. Policy Approval Engine & Separation of Duties
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS approval_policies (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_code          TEXT NOT NULL UNIQUE,
    title                TEXT NOT NULL,
    action_type          TEXT NOT NULL,
    unit_code            TEXT NOT NULL,
    workflow_type        TEXT NOT NULL CHECK (workflow_type IN ('SINGLE', 'SEQUENTIAL', 'PARALLEL_THRESHOLD', 'DUAL_CONTROL')),
    min_approvals_needed SMALLINT NOT NULL DEFAULT 1,
    threshold_amount     NUMERIC(18, 2),
    steps_json           JSONB NOT NULL DEFAULT '[]'::jsonb,
    expires_after_hours  INTEGER NOT NULL DEFAULT 48,
    is_active            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS approval_tickets (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id            TEXT NOT NULL UNIQUE,
    policy_id            UUID NOT NULL REFERENCES approval_policies(id),
    initiator_id         UUID NOT NULL REFERENCES users(id),
    initiator_device_id  TEXT NOT NULL,
    target_resource_type TEXT NOT NULL,
    target_resource_id   TEXT NOT NULL,
    staged_payload_json  JSONB NOT NULL,
    current_step         SMALLINT NOT NULL DEFAULT 1,
    status               TEXT NOT NULL DEFAULT 'PENDING'
                         CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'CANCELLED')),
    expires_at           TIMESTAMPTZ NOT NULL,
    finalized_at         TIMESTAMPTZ,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS approval_decisions (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id            UUID NOT NULL REFERENCES approval_tickets(id) ON DELETE CASCADE,
    approver_id          UUID NOT NULL REFERENCES users(id),
    step_number          SMALLINT NOT NULL,
    decision             TEXT NOT NULL CHECK (decision IN ('APPROVE', 'REJECT', 'ESCALATE', 'REQUEST_INFO')),
    comments             TEXT,
    device_id            TEXT NOT NULL,
    ip_hash              TEXT,
    decided_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 6. Digital Documents, Controlled Print & Governed Communications
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS digital_documents (
    document_uuid        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id          TEXT NOT NULL UNIQUE,
    document_type        TEXT NOT NULL,
    document_category    TEXT NOT NULL,
    title                TEXT NOT NULL,
    issuer               TEXT NOT NULL DEFAULT 'SohaelTasneem Foundation',
    issuer_user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_entity_type    TEXT,
    owner_entity_id      TEXT,
    serial_year          SMALLINT NOT NULL,
    serial_number        INTEGER NOT NULL,
    verification_code    TEXT NOT NULL UNIQUE,
    version              INTEGER NOT NULL DEFAULT 1,
    status               TEXT NOT NULL DEFAULT 'DRAFT'
                         CHECK (status IN ('DRAFT', 'REVIEW', 'APPROVED', 'ISSUED', 'ACTIVE', 'SUSPENDED', 'SUPERSEDED', 'REVOKED', 'EXPIRED', 'VOID')),
    issued_at            TIMESTAMPTZ,
    effective_at         TIMESTAMPTZ,
    expires_at           TIMESTAMPTZ,
    storage_object_key   TEXT NOT NULL,
    mime_type            TEXT NOT NULL DEFAULT 'application/pdf',
    file_size            BIGINT NOT NULL,
    sha256               TEXT NOT NULL,
    parent_document_uuid UUID REFERENCES digital_documents(document_uuid) ON DELETE SET NULL,
    supersedes_uuid      UUID REFERENCES digital_documents(document_uuid) ON DELETE SET NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT doc_serial_unique UNIQUE (document_type, serial_year, serial_number, version)
);

CREATE TABLE IF NOT EXISTS print_grants (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grant_token_hash     TEXT NOT NULL UNIQUE,
    document_uuid        UUID NOT NULL REFERENCES digital_documents(document_uuid) ON DELETE CASCADE,
    actor_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id            TEXT NOT NULL,
    purpose              TEXT NOT NULL,
    copy_sequence        INTEGER NOT NULL,
    expires_at           TIMESTAMPTZ NOT NULL,
    consumed_at          TIMESTAMPTZ,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS print_logs (
    id                   BIGSERIAL PRIMARY KEY,
    document_uuid        UUID NOT NULL REFERENCES digital_documents(document_uuid) ON DELETE CASCADE,
    copy_id              TEXT NOT NULL,
    actor_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id            TEXT NOT NULL,
    grant_id             UUID REFERENCES print_grants(id) ON DELETE SET NULL,
    ip_hash              TEXT,
    document_hash        TEXT NOT NULL,
    watermark_profile    TEXT NOT NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comms_templates (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code                 TEXT NOT NULL UNIQUE,
    channel              TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email', 'sms', 'in_app')),
    title                TEXT NOT NULL,
    template_bn          TEXT NOT NULL,
    template_en          TEXT NOT NULL,
    variables            JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comms_messages (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id           TEXT NOT NULL UNIQUE,
    template_code        TEXT NOT NULL REFERENCES comms_templates(code),
    channel              TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email', 'sms', 'in_app')),
    recipient_identifier TEXT NOT NULL,
    entity_type          TEXT,
    entity_id            TEXT,
    rendered_body        TEXT NOT NULL,
    verification_code    TEXT NOT NULL UNIQUE,
    dispatched_by_agent  TEXT,
    status               TEXT NOT NULL DEFAULT 'QUEUED'
                         CHECK (status IN ('QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'REVOKED')),
    delivery_metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 7. Device Identity, Autonomous Agents & Field Proofs
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS device_identities (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id            TEXT NOT NULL UNIQUE,
    user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_installation_id TEXT NOT NULL,
    keystore_public_key  TEXT NOT NULL,
    hardware_backed      BOOLEAN NOT NULL DEFAULT FALSE,
    platform             TEXT NOT NULL DEFAULT 'android',
    os_version           INTEGER NOT NULL,
    device_model         TEXT NOT NULL,
    status               TEXT NOT NULL DEFAULT 'PENDING'
                         CHECK (status IN ('PENDING', 'APPROVED', 'ACTIVE', 'SUSPENDED', 'REVOKED')),
    risk_score           SMALLINT NOT NULL DEFAULT 0,
    last_seen_at         TIMESTAMPTZ,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_registry (
    agent_id             TEXT PRIMARY KEY,
    agent_type           TEXT NOT NULL,
    version              TEXT NOT NULL,
    status               TEXT NOT NULL DEFAULT 'ENABLED'
                         CHECK (status IN ('REGISTERED', 'ENABLED', 'RUNNING', 'PAUSED', 'DISABLED', 'RETIRED')),
    capabilities         JSONB NOT NULL DEFAULT '[]'::jsonb,
    max_risk_level       SMALLINT NOT NULL DEFAULT 3,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_tasks (
    task_uuid            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id              TEXT NOT NULL UNIQUE,
    agent_id             TEXT NOT NULL REFERENCES agent_registry(agent_id),
    trigger_type         TEXT NOT NULL,
    authority_level      SMALLINT NOT NULL CHECK (authority_level BETWEEN 0 AND 5),
    input_payload        JSONB NOT NULL,
    plan_summary         TEXT,
    tool_invocations     JSONB NOT NULL DEFAULT '[]'::jsonb,
    risk_score           SMALLINT NOT NULL DEFAULT 1,
    approval_state       TEXT NOT NULL DEFAULT 'AUTOMATIC_POLICY'
                         CHECK (approval_state IN ('AUTOMATIC_POLICY', 'PENDING_HUMAN', 'APPROVED', 'REJECTED')),
    approved_by          UUID REFERENCES users(id) ON DELETE SET NULL,
    status               TEXT NOT NULL DEFAULT 'PENDING'
                         CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'ESCALATED')),
    error_message        TEXT,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at         TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS field_proofs (
    proof_uuid           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proof_id             TEXT NOT NULL UNIQUE,
    task_uuid            UUID REFERENCES agent_tasks(task_uuid) ON DELETE SET NULL,
    actor_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id            TEXT NOT NULL,
    proof_type           TEXT NOT NULL CHECK (proof_type IN ('PHOTO', 'SIGNATURE', 'CASH_RECEIPT', 'METER_READING')),
    r2_storage_key       TEXT NOT NULL,
    sha256               TEXT NOT NULL,
    metadata             JSONB NOT NULL DEFAULT '{}'::jsonb,
    geo_point            JSONB,
    verification_state   TEXT NOT NULL DEFAULT 'VERIFIED'
                         CHECK (verification_state IN ('VERIFIED', 'FLAGGED', 'REJECTED')),
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMIT;
```

---

## 4. Rollback Plan (`0002_aio_parties_iam.down.sql`)
In the event that migration `0002_aio_parties_iam.sql` must be rolled back:
```sql
BEGIN;

DROP TABLE IF EXISTS field_proofs CASCADE;
DROP TABLE IF EXISTS agent_tasks CASCADE;
DROP TABLE IF EXISTS agent_registry CASCADE;
DROP TABLE IF EXISTS device_identities CASCADE;
DROP TABLE IF EXISTS comms_messages CASCADE;
DROP TABLE IF EXISTS comms_templates CASCADE;
DROP TABLE IF EXISTS print_logs CASCADE;
DROP TABLE IF EXISTS print_grants CASCADE;
DROP TABLE IF EXISTS digital_documents CASCADE;
DROP TABLE IF EXISTS approval_decisions CASCADE;
DROP TABLE IF EXISTS approval_tickets CASCADE;
DROP TABLE IF EXISTS approval_policies CASCADE;
DROP TABLE IF EXISTS unit_occupancies CASCADE;
DROP TABLE IF EXISTS leases CASCADE;
DROP TABLE IF EXISTS property_units CASCADE;
DROP TABLE IF EXISTS properties_v2 CASCADE;
DROP TABLE IF EXISTS iam_console_policies CASCADE;
DROP TABLE IF EXISTS user_scopes CASCADE;
DROP TABLE IF EXISTS iam_scopes CASCADE;
DROP TABLE IF EXISTS party_relationships CASCADE;

ALTER TABLE users DROP COLUMN IF EXISTS party_id;
DROP TABLE IF EXISTS parties CASCADE;

COMMIT;
```
All baseline tables from `0001_init.sql` (`users`, `roles`, `properties`, `programs`, `ledger_entries`) remain completely intact.
