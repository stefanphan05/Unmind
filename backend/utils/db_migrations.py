from sqlalchemy import inspect, text

from config.extensions import db


def ensure_therapy_session_summary_column() -> None:
    inspector = inspect(db.engine)
    if "therapy_session" not in inspector.get_table_names():
        return

    columns = {col["name"] for col in inspector.get_columns("therapy_session")}
    if "summary" in columns:
        return

    dialect = db.engine.dialect.name
    if dialect == "sqlite":
        ddl = "ALTER TABLE therapy_session ADD COLUMN summary TEXT NOT NULL DEFAULT ''"
    else:
        ddl = "ALTER TABLE therapy_session ADD COLUMN summary TEXT NOT NULL DEFAULT ''"

    with db.engine.begin() as conn:
        conn.execute(text(ddl))


def ensure_therapy_session_tone_column() -> None:
    inspector = inspect(db.engine)
    if "therapy_session" not in inspector.get_table_names():
        return

    columns = {col["name"] for col in inspector.get_columns("therapy_session")}
    if "tone" in columns:
        return

    dialect = db.engine.dialect.name
    if dialect == "sqlite":
        ddl = (
            "ALTER TABLE therapy_session ADD COLUMN tone VARCHAR(32) "
            "NOT NULL DEFAULT 'compassionate'"
        )
    else:
        ddl = (
            "ALTER TABLE therapy_session ADD COLUMN tone VARCHAR(32) "
            "NOT NULL DEFAULT 'compassionate'"
        )

    with db.engine.begin() as conn:
        conn.execute(text(ddl))
