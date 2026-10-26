# ADR-0002: Modular monolith with outbox events

**Status:** Accepted
**Decision:** Single deployable, domain packages with facade-only cross-imports, transactional outbox for internal events. Python/FastAPI/SQLAlchemy/PostgreSQL; Next.js frontend.
**Consequences:** Simple operations and atomic consistency now; domains extractable later. Import boundaries enforced by tests/linters.
