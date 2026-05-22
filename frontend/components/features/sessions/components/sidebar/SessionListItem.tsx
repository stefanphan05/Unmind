import { TherapySession } from "@/types/therapySession";
import { formatSessionDate } from "@/lib/utils/formatSessionDate";
import { useParams, useRouter } from "next/navigation";

interface SessionListItemProps {
  session: TherapySession;
  onNavigate?: () => void;
}

export default function SessionListItem({
  session,
  onNavigate,
}: SessionListItemProps) {
  const router = useRouter();
  const params = useParams();
  const activeId = Number(params?.therapySessionId);
  const isActive = activeId === Number(session.id);

  const title = session.name?.trim() || "New conversation";
  const preview =
    session.summary?.trim() ||
    "Start chatting and a short summary will appear here.";

  const handleSessionClick = () => {
    router.push(`/chat/${session.id}`);
    onNavigate?.();
  };

  return (
    <button
      type="button"
      onClick={handleSessionClick}
      className={`history-item ${isActive ? "history-item--active" : ""}`}
    >
      <div className="history-item__row">
        <span className="history-item__title">{title}</span>
        <time className="history-item__date" dateTime={session.date}>
          {formatSessionDate(session.date)}
        </time>
      </div>
      <p className="history-item__summary">{preview}</p>
    </button>
  );
}
