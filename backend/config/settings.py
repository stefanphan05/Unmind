import os
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from dotenv import load_dotenv

_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(_ENV_PATH)


def _build_database_uri() -> str | None:
    raw_url = (os.getenv("DATABASE_URL") or "").strip().strip("\"'")
    if not raw_url:
        return None

    # SQLAlchemy expects "postgresql://", while some providers give "postgres://".
    if raw_url.startswith("postgres://"):
        raw_url = raw_url.replace("postgres://", "postgresql://", 1)

    parsed = urlparse(raw_url)
    if parsed.hostname and parsed.hostname.endswith(".supabase.co"):
        # Supabase requires SSL; ensure the query string includes it.
        query = dict(parse_qsl(parsed.query, keep_blank_values=True))
        query.setdefault("sslmode", "require")
        raw_url = urlunparse(parsed._replace(query=urlencode(query)))

    return raw_url


class Config:
    SQLALCHEMY_DATABASE_URI = _build_database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY")
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = int(os.getenv("MAIL_PORT"))
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
