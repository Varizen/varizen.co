from decimal import Decimal

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select

from hawlat import core, identity
from hawlat.api import create_app
from hawlat.db import Settings
from hawlat.models import ImmutableRecord, LedgerEntry, ReputationEvent

PW = "correct-horse-battery"


class Env:
    def __init__(self):
        self.app = create_app(Settings(), database_url="sqlite://")
        self.c = TestClient(self.app)
        self.factory = self.app.state.session_factory
        self.seq = 0

    def user(self, name, role="participant", verify=True):
        with self.factory() as db:
            part = identity.register(db, f"{name}@example.com", PW, name, role=role)
            pid = part.id
            if verify:
                part.verification_level = 1
            db.commit()
        tok = self.c.post("/api/v1/auth/login", json={"email": f"{name}@example.com", "password": PW}).json()["access_token"]
        return pid, {"Authorization": f"Bearer {tok}"}

    def post(self, path, h, json=None, key=True):
        self.seq += 1
        headers = dict(h)
        if key:
            headers["Idempotency-Key"] = f"k{self.seq}"
        return self.c.post(f"/api/v1{path}", json=json or {}, headers=headers)

    def enable(self, feature, requirement, a1, a2):
        self.c.post(f"/api/v1/admin/gates/{feature}/satisfy", json={"requirement": requirement}, headers=a1)
        for s in ("LEGAL_REVIEW", "PARTNER_REQUIRED", "PARTNER_CONNECTED", "COMPLIANCE_APPROVED"):
            assert self.c.post(f"/api/v1/admin/gates/{feature}/advance", json={"to": s}, headers=a1).status_code == 200
        r1 = self.c.post(f"/api/v1/admin/gates/{feature}/advance", json={"to": "ENABLED"}, headers=a1).json()
        assert r1["result"] == "PENDING_SECOND_APPROVER"
        assert self.c.post(f"/api/v1/admin/gates/{feature}/advance", json={"to": "ENABLED"}, headers=a2).json()["result"] == "ENABLED"


@pytest.fixture()
def env():
    return Env()


@pytest.fixture()
def world(env):
    _, a1 = env.user("admin1", "admin")
    _, a2 = env.user("admin2", "compliance")
    funder, hf = env.user("funder")
    recipient, hr = env.user("recipient")
    return env, a1, a2, funder, hf, recipient, hr


def setup_offer_request(env, hf, hr, amount="1000"):
    off = env.post("/offers", hf, {"min_amount": "100", "max_amount": "5000", "max_tenor_weeks": 20, "charge_bps_per_week": 50})
    req = env.post("/requests", hr, {"amount": amount, "tenor_weeks": 10, "purpose": "stock"})
    return off.json()["id"], req.json()["id"]


def test_auth_required_and_health(env):
    assert env.c.get("/healthz").status_code == 200
    assert env.c.get("/api/v1/participants/me").status_code == 401
    assert env.c.post("/api/v1/auth/login", json={"email": "no@x.com", "password": "whatever-long"}).status_code == 401


def test_gate_blocks_by_default_and_money_flow(world):
    env, a1, a2, funder, hf, recipient, hr = world
    off_id, req_id = setup_offer_request(env, hf, hr)

    blocked = env.c.get(f"/api/v1/requests/{req_id}/matches", headers=hr)
    assert blocked.status_code == 403 and blocked.json()["code"] == "GATE_BLOCKED"

    env.enable("MARKETPLACE_MATCHING", "LEGAL_OPINION", a1, a2)
    env.enable("PAYMENT_SETTLEMENT", "AUTHORIZED_PAYMENT_PARTNER", a1, a2)

    match_id = env.c.get(f"/api/v1/requests/{req_id}/matches", headers=hr).json()[0]["match_id"]
    q = env.post(f"/matches/{match_id}/quotes", hr).json()
    assert Decimal(q["party_charge"]) == Decimal("50.00") and Decimal(q["platform_fee"]) == Decimal("10.00")
    assert Decimal(q["total_due_to_funder"]) == Decimal("1050.00") and len(q["schedule"]) == 10

    first = env.post(f"/quotes/{q['id']}/accept", hr).json()
    assert first["state"] == "AWAITING_COUNTERPARTY_SIGNATURE"
    done = env.post(f"/quotes/{q['id']}/accept", hf).json()
    assert done["state"] == "AGREED"
    tx_id = done["transaction_id"]

    assert env.post(f"/transactions/{tx_id}/settle", hr).status_code == 403  # only the funder may settle
    assert env.post(f"/transactions/{tx_id}/settle", hf).json()["state"] == "ACTIVE"

    assert env.post(f"/transactions/{tx_id}/repayments", hf, {"amount": "500"}).json()["state"] == "PARTIALLY_REPAID"
    assert env.post(f"/transactions/{tx_id}/repayments", hf, {"amount": "600"}).status_code == 422  # exceeds outstanding
    assert env.post(f"/transactions/{tx_id}/repayments", hf, {"amount": "550"}).json()["state"] == "COMPLETED"

    states = [t["new_state"] for t in env.c.get(f"/api/v1/transactions/{tx_id}/timeline", headers=hf).json()]
    assert states == ["AGREED", "PENDING_SETTLEMENT", "ACTIVE", "PARTIALLY_REPAID", "COMPLETED"]
    assert env.c.get(f"/api/v1/transactions/{tx_id}/timeline", headers=hf).json()[0]["actor"]

    rep = env.c.get("/api/v1/reputation/me", headers=hr).json()
    assert rep["completed_count"] == 1 and rep["score"] == 520

    passport = env.c.get("/api/v1/passport/me", headers=hr).json()
    assert Decimal(passport["net_obligation_balance"]) == Decimal("10") and  "not a wallet" in passport["statement_type"]

    assert env.c.post("/api/v1/admin/outbox/dispatch", headers=a1).json()["dispatched"] > 0
    assert env.c.get("/api/v1/notifications", headers=hf).json()
    assert env.c.get("/api/v1/admin/audit/verify", headers=a1).json()["chain_valid"] is True

    with env.factory() as db:  # DB-level ledger is balanced per journal and immutable
        entries = db.scalars(select(LedgerEntry)).all()
        for j in {e.journal_id for e in entries}:
            d = sum(e.amount for e in entries if e.journal_id == j and e.direction == "DEBIT")
            c = sum(e.amount for e in entries if e.journal_id == j and e.direction == "CREDIT")
            assert d == c
        entries[0].amount = Decimal("1")
        with pytest.raises(ImmutableRecord):
            db.flush()


def test_ownership_and_non_party_access(world):
    env, a1, a2, funder, hf, recipient, hr = world
    _, hx = env.user("stranger")
    off_id, req_id = setup_offer_request(env, hf, hr)
    env.enable("MARKETPLACE_MATCHING", "LEGAL_OPINION", a1, a2)
    assert env.c.get(f"/api/v1/requests/{req_id}/matches", headers=hx).status_code == 403


def test_idempotency(world):
    env, hr = world[0], world[-1]
    headers = dict(hr, **{"Idempotency-Key": "same"})
    body = {"amount": "1000", "tenor_weeks": 10}
    r1 = env.c.post("/api/v1/requests", json=body, headers=headers)
    r2 = env.c.post("/api/v1/requests", json=body, headers=headers)
    assert r1.json() == r2.json()
    assert env.c.post("/api/v1/requests", json={"amount": "999", "tenor_weeks": 10}, headers=headers).status_code == 422
    assert env.c.post("/api/v1/requests", json=body, headers=hr).status_code == 400


def test_risk_denials(world):
    env, a1, a2, funder, hf, recipient, hr = world
    env.enable("MARKETPLACE_MATCHING", "LEGAL_OPINION", a1, a2)
    off_id, req_id = setup_offer_request(env, hf, hr, amount="4900")
    m = env.c.get(f"/api/v1/requests/{req_id}/matches", headers=hr).json()[0]["match_id"]
    ok = env.post(f"/matches/{m}/quotes", hr)
    assert ok.status_code == 201

    big = env.post("/requests", hr, {"amount": "5000", "tenor_weeks": 10}).json()["id"]
    m2 = env.c.get(f"/api/v1/requests/{big}/matches", headers=hr).json()[0]["match_id"]
    ok2 = env.post(f"/matches/{m2}/quotes", hr)
    assert ok2.status_code == 201  # exactly at newcomer cap boundary is allowed (cap 5000)

    over = env.post("/requests", hr, {"amount": "6000", "tenor_weeks": 10}).json()["id"]
    assert env.c.get(f"/api/v1/requests/{over}/matches", headers=hr).json() == []  # outside offer range -> no match

    _, hu = env.user("unverified", verify=False)
    ur = env.post("/requests", hu, {"amount": "1000", "tenor_weeks": 10}).json()["id"]
    um = env.c.get(f"/api/v1/requests/{ur}/matches", headers=hu).json()[0]["match_id"]
    denied = env.post(f"/matches/{um}/quotes", hu)
    assert denied.status_code == 422 and "RECIPIENT_NOT_VERIFIED" in denied.json()["reasons"]


def test_limits_are_config_not_constants(world):
    env, a1, a2, funder, hf, recipient, hr = world
    r = env.post("/requests", hr, {"amount": "10", "tenor_weeks": 10})
    assert r.status_code == 422  # below MIN_TRANSACTION_AMOUNT (50)
    assert env.c.post("/api/v1/admin/config", json={"values": {"MIN_TRANSACTION_AMOUNT": "5"}}, headers=a1).json()["version"] == 2
    assert env.post("/requests", hr, {"amount": "10", "tenor_weeks": 10}).status_code == 201
    assert env.c.post("/api/v1/admin/config", json={"values": {"NOPE": 1}}, headers=a1).status_code == 422


def test_kill_switch_and_non_admin_forbidden(world):
    env, a1, a2, funder, hf, recipient, hr = world
    assert env.c.get("/api/v1/admin/gates", headers=hr).status_code == 403
    env.enable("MARKETPLACE_MATCHING", "LEGAL_OPINION", a1, a2)
    _, req_id = setup_offer_request(env, hf, hr)
    assert env.c.get(f"/api/v1/requests/{req_id}/matches", headers=hr).status_code == 200
    env.c.post("/api/v1/admin/kill-switches/MARKETPLACE_MATCHING", headers=a1)
    assert env.c.get(f"/api/v1/requests/{req_id}/matches", headers=hr).status_code == 403


def test_reputation_appeal_is_compensating_not_destructive(world):
    env, a1, a2, funder, hf, recipient, hr = world
    from hawlat.trust import add_event
    with env.factory() as db:
        add_event(db, recipient, -50, "TEST_PENALTY", "test")
        ev = db.scalars(select(ReputationEvent)).first()
        ev_id = ev.id
        db.commit()
    appeal = env.post("/reputation/appeals", hr, {"event_id": ev_id, "reason": "mistaken penalty"}).json()["appeal_id"]
    assert env.c.get("/api/v1/reputation/me", headers=hr).json()["score"] == 450
    env.c.post(f"/api/v1/admin/reputation/appeals/{appeal}/decide", json={"uphold": True}, headers=a1)
    assert env.c.get("/api/v1/reputation/me", headers=hr).json()["score"] == 500


def test_production_refuses_mock_and_weak_secret(monkeypatch):
    monkeypatch.setenv("HAWLAT_ENV", "production")
    with pytest.raises(RuntimeError):
        Settings()
    monkeypatch.setenv("HAWLAT_JWT_SECRET", "x" * 40)
    with pytest.raises(RuntimeError):
        create_app(Settings(), database_url="sqlite://")

def test_listing_and_enriched_matches(world):
    env, a1, a2, funder, hf, recipient, hr = world
    off_id, req_id = setup_offer_request(env, hf, hr)
    env.enable("MARKETPLACE_MATCHING", "LEGAL_OPINION", a1, a2)
    assert [r["id"] for r in env.c.get("/api/v1/requests", headers=hr).json()] == [req_id]
    assert [o["id"] for o in env.c.get("/api/v1/offers", headers=hf).json()] == [off_id]
    m = env.c.get(f"/api/v1/requests/{req_id}/matches", headers=hr).json()[0]
    assert m["counterparty"]["display_name"] == "funder" and m["counterparty"]["verified"] is True
    assert env.c.get(f"/api/v1/offers/{off_id}/matches", headers=hf).json()[0]["amount"] in ("1000", "1000.0000")
    assert env.c.get("/api/v1/transactions", headers=hr).json() == []


def test_admin_console_endpoints(world):
    env, a1, a2, funder, hf, recipient, hr = world
    _, hu = env.user("pending", verify=False)
    assert env.c.get("/api/v1/participants/me", headers=a1).json()["role"] == "admin"
    assert any(p["display_name"] == "pending" for p in env.c.get("/api/v1/admin/participants/unverified", headers=a1).json())
    assert env.c.get("/api/v1/admin/config", headers=a1).json()["version"] == 1
    assert env.c.get("/api/v1/admin/reputation/appeals", headers=a1).json() == []
    for path in ("participants/unverified", "config", "reputation/appeals"):
        assert env.c.get(f"/api/v1/admin/{path}", headers=hu).status_code == 403


def test_account_deletion(world):
    env, a1, a2, funder, hf, recipient, hr = world
    _, hd = env.user("leaver")
    assert env.c.request("DELETE", "/api/v1/participants/me", json={"password": "wrong-password-x"}, headers=hd).status_code == 403
    env.post("/requests", hd, {"amount": "1000", "tenor_weeks": 10})
    assert env.c.request("DELETE", "/api/v1/participants/me", json={"password": PW}, headers=hd).json() == {"deleted": True}
    assert env.c.get("/api/v1/participants/me", headers=hd).status_code == 401  # token dies immediately
    assert env.c.post("/api/v1/auth/login", json={"email": "leaver@example.com", "password": PW}).status_code == 401
    with env.factory() as db:
        from hawlat.models import User
        assert db.scalars(select(User).where(User.email.like("deleted-%"))).first() is not None
