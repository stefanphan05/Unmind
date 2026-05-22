import re
import threading
from typing import Optional

from flask import Flask

from models import Message, TherapySession
from services.ai.factory import llm_factory
from utils.find_session import find_session_by_id_for_user

_DEFAULT_SESSION_NAME = "New conversation"


class SessionSummaryService:
    def __init__(self, db_session) -> None:
        self.__db = db_session
        self.__llm = llm_factory()

    def on_exchange_complete(
        self,
        app: Flask,
        email: str,
        therapy_session_id: int,
        latest_user_input: str,
    ) -> None:
        """Update sidebar/history preview without blocking the chat response."""
        session = find_session_by_id_for_user(
            self.__db, str(therapy_session_id), email
        )
        if not session:
            return

        user_message_count = self.__count_user_messages(email, therapy_session_id)
        if user_message_count != 1:
            return

        self.__apply_preview(session, latest_user_input)
        self.__db.commit()

        thread = threading.Thread(
            target=self.__refresh_with_llm_in_background,
            args=(app, email, therapy_session_id),
            daemon=True,
        )
        thread.start()

    def refresh_for_session(self, email: str, therapy_session_id: int) -> Optional[TherapySession]:
        """Full LLM refresh (e.g. manual/history use). Prefer on_exchange_complete in chat."""
        return self.__refresh_with_llm(email, therapy_session_id)

    def __refresh_with_llm_in_background(
        self, app: Flask, email: str, therapy_session_id: int
    ) -> None:
        with app.app_context():
            try:
                self.__refresh_with_llm(email, therapy_session_id)
            except Exception:
                pass

    def __refresh_with_llm(
        self, email: str, therapy_session_id: int
    ) -> Optional[TherapySession]:
        session = find_session_by_id_for_user(
            self.__db, str(therapy_session_id), email
        )
        if not session:
            return None

        messages = (
            self.__db.query(Message)
            .filter(
                Message.email == email,
                Message.therapy_session_id == therapy_session_id,
            )
            .order_by(Message.timestamp.asc())
            .all()
        )

        user_messages = [m for m in messages if m.role == "user"]
        if not user_messages:
            return session

        prompt = self.__build_llm_prompt(messages)
        try:
            raw = self.__llm.generate_response(prompt).strip()
        except Exception:
            return session

        title, summary = self.__parse_summary_response(raw)
        if title:
            session.name = title[:100]
        if summary:
            session.summary = summary[:500]
        session.status = "ongoing"
        self.__db.commit()
        return session

    def __apply_preview(self, session: TherapySession, latest_user_input: str) -> None:
        text = (latest_user_input or "").strip()
        if not text:
            return

        if session.name == _DEFAULT_SESSION_NAME:
            session.name = self.__truncate(text, 50)

        session.summary = self.__truncate(text, 160)

    def __count_user_messages(self, email: str, therapy_session_id: int) -> int:
        return (
            self.__db.query(Message)
            .filter(
                Message.email == email,
                Message.therapy_session_id == therapy_session_id,
                Message.role == "user",
            )
            .count()
        )

    def __build_llm_prompt(self, messages: list) -> str:
        transcript_lines = []
        for msg in messages:
            speaker = "User" if msg.role == "user" else "Therapist"
            transcript_lines.append(f"{speaker}: {msg.content}")

        transcript = "\n".join(transcript_lines)

        return (
            "You are summarizing a therapy chat for a personal history list.\n"
            "Read the conversation and respond with exactly two lines:\n"
            "TITLE: a short title (max 50 characters, no quotes)\n"
            "SUMMARY: one calm sentence about what the conversation was about "
            "(max 160 characters, no quotes)\n\n"
            f"Conversation:\n{transcript}"
        )

    def __parse_summary_response(self, raw: str) -> tuple[str, str]:
        title = ""
        summary = ""

        for line in raw.splitlines():
            stripped = line.strip()
            if not stripped:
                continue
            title_match = re.match(r"^TITLE:\s*(.+)$", stripped, re.I)
            summary_match = re.match(r"^SUMMARY:\s*(.+)$", stripped, re.I)
            if title_match:
                title = title_match.group(1).strip()
            elif summary_match:
                summary = summary_match.group(1).strip()

        if not title and not summary and raw:
            parts = [p.strip() for p in raw.split("\n") if p.strip()]
            if parts:
                title = parts[0][:50]
            if len(parts) > 1:
                summary = parts[1][:160]

        return title, summary

    @staticmethod
    def __truncate(text: str, max_len: int) -> str:
        if len(text) <= max_len:
            return text
        return text[: max_len - 1].rstrip() + "…"
