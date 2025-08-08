import { TherapySession } from "@/types/therapySession";
import { User } from "lucide-react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { BsDashCircle, BsThreeDots } from "react-icons/bs";

interface SessionListItemProps {
  session: TherapySession;
  onClick: () => void;
}

const statusClasses = {
  completed: "text-green-600 bg-green-50",
  upcoming: "text-blue-600 bg-blue-50",
  ongoing: "text-yellow-600 bg-yellow-50",
  default: "text-gray-600 bg-gray-50",
};

const resultIcon = (r: TherapySession["result"]) => {
  switch (r) {
    case "positive":
      return <AiOutlineLike className="w-4 h-4" />;
    case "neutral":
      return <BsDashCircle className="w-4 h-4" />;
    case "negative":
      return <AiOutlineDislike className="w-4 h-4" />;
    default:
      return <User className="w-4 h-4" />;
  }
};

export default function SessionListItem({
  session,
  onClick,
}: SessionListItemProps) {
  const badge = statusClasses[session.status] ?? statusClasses.default;
  return (
    <div
      onClick={onClick}
      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-sm hover:border-gray-300 transform"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
          {session.name}
        </h3>
        <BsThreeDots />
      </div>
      <div className="flex gap-4 text-xs text-gray-500 justify-between">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge}`}>
          {session.status}
        </span>
        <div className="flex items-center gap-1">
          {resultIcon(session.result)}
          <span className="capitalize">{session.result}</span>
        </div>
      </div>
    </div>
  );
}
