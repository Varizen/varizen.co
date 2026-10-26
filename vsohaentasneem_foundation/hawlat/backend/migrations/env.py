import os

from alembic import context

from hawlat.db import make_engine
from hawlat.models import Base

url = os.environ.get("HAWLAT_DATABASE_URL")
if not url:
    raise RuntimeError("HAWLAT_DATABASE_URL must be set to run migrations")

engine = make_engine(url)
with engine.connect() as connection:
    context.configure(connection=connection, target_metadata=Base.metadata)
    with context.begin_transaction():
        context.run_migrations()
