import Link from "next/link";
import { TherapySession } from "@/types/therapySession";
import { formatSessionDate } from "@/lib/utils/formatSessionDate";
import { ChevronRight } from "lucide-react";

interface HistoryCardProps {
  session: TherapySession;
}

export default function HistoryCard({ session }: HistoryCardProps) {
  const title = session.name?.trim() || "New conversation";
  const summary =
    session.summary?.trim() ||
    "Start chatting and a short summary will appear here.";

  if (!session.id) return null;

  return (
    <Link href={`/chat/${session.id}`} className="history-card">
      <div className="history-card__header">
        <h2 className="history-card__title font-display">{title}</h2>
        <time className="history-card__date" dateTime={session.date}>
          {formatSessionDate(session.date)}
        </time>
      </div>
      <p className="history-card__summary">{summary}</p>
      <span className="history-card__action">
        Open conversation
        <ChevronRight strokeWidth={1.75} className="history-card__action-icon" />
      </span>
    </Link>
  );
}
