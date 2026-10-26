FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY pyproject.toml ./
COPY src ./src
COPY migrations ./migrations
COPY alembic.ini ./
RUN pip install --no-cache-dir . && useradd -r -u 10001 hawlat
USER hawlat
ENV PYTHONPATH=/app/src
EXPOSE 8000
CMD ["uvicorn", "--factory", "hawlat.api:create_app", "--host", "0.0.0.0", "--port", "8000"]
