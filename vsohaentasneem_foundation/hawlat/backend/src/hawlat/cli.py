"""Operator CLI. Usage: python -m hawlat.cli create-admin EMAIL NAME [admin|compliance] (password via HAWLAT_ADMIN_PASSWORD)."""
from __future__ import annotations

import os
import sys

from . import core, identity
from .db import Settings, make_engine, make_session_factory


def main(argv: list[str]) -> int:
    if len(argv) < 4 or argv[1] != "create-admin":
        print(__doc__)
        return 2
    password = os.environ.get("HAWLAT_ADMIN_PASSWORD", "")
    role = argv[4] if len(argv) > 4 else "admin"
    factory = make_session_factory(make_engine(Settings().database_url))
    with factory() as db:
        core.bootstrap(db)
        part = identity.register(db, argv[2], password, argv[3], role=role)
        part.verification_level = 1
        db.commit()
    print(f"created {role} participant {part.id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
