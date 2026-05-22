import { TherapySession } from "@/types/therapySession";
import SessionListItem from "./SessionListItem";

interface SessionListProps {
  sessions: TherapySession[];
  onMenuClick: (s: TherapySession) => void;
  onNavigate?: () => void;
}

export default function SessionList({
  sessions,
  onMenuClick,
  onNavigate,
}: SessionListProps) {
  return (
    <div className="session-list">
      {sessions.length === 0 ? (
        <div className="session-list__empty">
          <p className="session-list__empty-title font-display">
            No sessions yet
          </p>
          <p className="session-list__empty-text">
            Start a new one to begin your conversation.
          </p>
        </div>
      ) : (
        sessions.map((s) => (
          <SessionListItem
            key={s.id}
            session={s}
            onMenuClick={() => onMenuClick(s)}
            onNavigate={onNavigate}
          />
        ))
      )}
    </div>
  );
}
