from __future__ import annotations

import os
from collections.abc import Iterator
from decimal import Decimal

from sqlalchemy import Numeric, String, create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool
from sqlalchemy.types import TypeDecorator


class Settings:
    def __init__(self) -> None:
        self.env = os.environ.get("HAWLAT_ENV", "development")
        self.database_url = os.environ.get("HAWLAT_DATABASE_URL", "sqlite:///./hawlat_dev.db")
        self.jwt_secret = os.environ.get("HAWLAT_JWT_SECRET", "")
        if self.env == "production" and len(self.jwt_secret) < 32:
            raise RuntimeError("HAWLAT_JWT_SECRET (>=32 chars) is required in production")
        if not self.jwt_secret:
            self.jwt_secret = os.urandom(32).hex()  # per-process dev secret, never persisted


class DecimalType(TypeDecorator):
    """NUMERIC(20,4) on PostgreSQL; exact string on SQLite (which has no decimal type)."""

    impl = Numeric(20, 4)
    cache_ok = True

    def load_dialect_impl(self, dialect):
        return dialect.type_descriptor(String(40) if dialect.name == "sqlite" else Numeric(20, 4))

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, float):
            raise TypeError("floats are forbidden for money")
        value = Decimal(value)
        return str(value) if dialect.name == "sqlite" else value

    def process_result_value(self, value, dialect):
        return None if value is None else Decimal(value)


def make_engine(url: str) -> Engine:
    if url.startswith("sqlite"):
        kwargs: dict = {"connect_args": {"check_same_thread": False}}
        if url in ("sqlite://", "sqlite:///:memory:"):
            kwargs["poolclass"] = StaticPool
        return create_engine(url, **kwargs)
    return create_engine(url, pool_pre_ping=True)


def make_session_factory(engine: Engine) -> sessionmaker[Session]:
    return sessionmaker(engine, expire_on_commit=False)


def session_scope(factory: sessionmaker[Session]) -> Iterator[Session]:
    db = factory()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
