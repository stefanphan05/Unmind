import { TherapySession } from "@/types/therapySession";
import SessionListItem from "./SessionListItem";

interface SessionListProps {
  sessions: TherapySession[];
  isLoading?: boolean;
  onNavigate?: () => void;
}

export default function SessionList({
  sessions,
  isLoading = false,
  onNavigate,
}: SessionListProps) {
  return (
    <div className="history-list">
      {isLoading ? (
        <div className="chat-loading history-list__loading">
          <div className="chat-loading__spinner" aria-hidden="true" />
          <p>Loading your history...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="history-list__empty">
          <p className="history-list__empty-title font-display">No history yet</p>
          <p className="history-list__empty-text">
            Start a new conversation and it will show up here with a summary.
          </p>
        </div>
      ) : (
        sessions.map((s) => (
          <SessionListItem key={s.id} session={s} onNavigate={onNavigate} />
        ))
      )}
    </div>
  );
}
