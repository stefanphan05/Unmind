import { TherapySession } from "@/types/therapySession";
import SessionListItem from "./SessionListItem";

interface SessionListProps {
  sessions: TherapySession[];
  onSelect: (s: TherapySession) => void;
}

export default function SessionList({ sessions, onSelect }: SessionListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {sessions.map((s, idx) => (
        <SessionListItem key={s.id} session={s} onClick={() => onSelect(s)} />
      ))}
    </div>
  );
}
