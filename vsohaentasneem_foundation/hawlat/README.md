# HAWLAT

Neutral, reputation-driven marketplace that helps independent parties discover, agree and record direct short-term financing. HAWLAT/STFL is never the lender, borrower or custodian. Docs: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Run locally
```
cd backend
pip install -e ".[dev]"
pytest -q
$env:HAWLAT_DATABASE_URL="sqlite:///./dev.db"; $env:PYTHONPATH="src"; alembic upgrade head
$env:HAWLAT_ADMIN_PASSWORD="<min 10 chars>"; python -m hawlat.cli create-admin you@example.com "Your Name"
uvicorn --factory hawlat.api:create_app --reload
```
Staging stack: `docker compose up --build` (needs `HAWLAT_DB_PASSWORD`, `HAWLAT_JWT_SECRET`).

## Status
See [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md). Real-money movement is disabled and cannot be enabled without legal/partner approval.

## Frontend
```n cd frontend; npm install; npm run dev   # proxies /api/v1 to HAWLAT_API_URL (default http://127.0.0.1:8000)
```

## Mobile (Google Play / App Store)
See [docs/STORE_SUBMISSION.md](docs/STORE_SUBMISSION.md). Build: `npm run build:mobile` in `frontend` then `npx cap open android|ios`.
