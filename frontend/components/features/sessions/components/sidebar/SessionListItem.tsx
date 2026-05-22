import { TherapySession } from "@/types/therapySession";
import { useParams, useRouter } from "next/navigation";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { BsDashCircle, BsThreeDots } from "react-icons/bs";

interface SessionListItemProps {
  session: TherapySession;
  onMenuClick: () => void;
  onNavigate?: () => void;
}

const statusLabels: Record<string, string> = {
  completed: "Completed",
  upcoming: "Upcoming",
  ongoing: "In progress",
};

const resultIcon = (r: TherapySession["result"]) => {
  switch (r) {
    case "positive":
      return <AiOutlineLike className="session-card__result-icon" />;
    case "neutral":
      return <BsDashCircle className="session-card__result-icon" />;
    case "negative":
      return <AiOutlineDislike className="session-card__result-icon" />;
    default:
      return null;
  }
};

export default function SessionListItem({
  session,
  onMenuClick,
  onNavigate,
}: SessionListItemProps) {
  const router = useRouter();
  const params = useParams();
  const activeId = Number(params?.therapySessionId);
  const isActive = activeId === Number(session.id);

  const handleSessionClick = () => {
    router.push(`/chat/${session.id}`);
    onNavigate?.();
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMenuClick();
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleSessionClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSessionClick();
        }
      }}
      className={`session-card ${isActive ? "session-card--active" : ""}`}
    >
      <div className="session-card__top">
        <h3 className="session-card__name">{session.name}</h3>
        <button
          type="button"
          className="session-card__menu-btn"
          onClick={handleMenuClick}
          aria-label="Session options"
        >
          <BsThreeDots />
        </button>
      </div>
      <div className="session-card__meta">
        <span
          className={`session-card__status session-card__status--${session.status}`}
        >
          {statusLabels[session.status] ?? session.status}
        </span>
        {session.result && (
          <span className="session-card__result">
            {resultIcon(session.result)}
            <span className="capitalize">{session.result}</span>
          </span>
        )}
      </div>
    </article>
  );
}
