from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from sqlalchemy import select
from sqlalchemy.orm import Session

from .core import audit
from .models import Participant, User

_ph = PasswordHasher()
_DUMMY = _ph.hash("not-a-real-password")
TOKEN_TTL = timedelta(minutes=15)


class AuthError(Exception):
    pass


def register(db: Session, email: str, password: str, display_name: str, role: str = "participant") -> Participant:
    email = email.strip().lower()
    if len(password) < 10:
        raise ValueError("password must be at least 10 characters")
    if "@" not in email or not display_name.strip():
        raise ValueError("valid email and display name required")
    if db.scalar(select(User).where(User.email == email)):
        raise ValueError("email already registered")
    user = User(email=email, password_hash=_ph.hash(password), role=role)
    db.add(user)
    db.flush()
    participant = Participant(user_id=user.id, display_name=display_name.strip())
    db.add(participant)
    db.flush()
    audit(db, user.id, "identity.registered", "participant", participant.id, {"role": role})
    return participant


def login(db: Session, email: str, password: str, secret: str) -> str:
    user = db.scalar(select(User).where(User.email == email.strip().lower()))
    try:
        _ph.verify(user.password_hash if user else _DUMMY, password)
    except VerifyMismatchError:
        user = None
    if user is None:
        raise AuthError("invalid credentials")
    participant = db.scalar(select(Participant).where(Participant.user_id == user.id))
    now = datetime.now(timezone.utc)
    return jwt.encode({"sub": user.id, "role": user.role, "pid": participant.id, "iat": now, "exp": now + TOKEN_TTL},
                      secret, algorithm="HS256")


def decode(token: str, secret: str) -> dict:
    try:
        return jwt.decode(token, secret, algorithms=["HS256"], options={"require": ["exp", "sub"]})
    except jwt.PyJWTError as exc:
        raise AuthError("invalid token") from exc


def verify_password(user: User, password: str) -> None:
    try:
        _ph.verify(user.password_hash, password)
    except VerifyMismatchError as exc:
        raise AuthError("invalid credentials") from exc


def anonymise(db: Session, user: User, participant: Participant) -> None:
    """Erase personal data. Ledger/audit/transition rows keep only the opaque participant id."""
    user.email = f"deleted-{user.id}@deleted.invalid"
    user.password_hash = _ph.hash(os.urandom(32).hex())
    participant.display_name = "Deleted participant"
    participant.status = "DELETED"
    db.flush()