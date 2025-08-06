import { TherapySession } from "@/types/therapySession";
import { User } from "lucide-react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { BsDashCircle } from "react-icons/bs";

interface ResultSelectorProps {
  value: TherapySession["result"];
  onChange: (val: TherapySession["result"]) => void;
}

const getResultColor = (result: TherapySession["result"]) => {
  switch (result) {
    case "positive":
      return "bg-green-50 text-green-700 border-green-200";
    case "neutral":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "negative":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getResultIcon = (result: TherapySession["result"]) => {
  switch (result) {
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

export default function ResultSelector({
  value,
  onChange,
}: ResultSelectorProps) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-2">Result</label>
      <div className="grid grid-cols-3 gap-2">
        {(["negative", "neutral", "positive"] as const).map((result) => (
          <button
            key={result}
            onClick={() => onChange(result)}
            className={`px-6 py-4 rounded-2xl text-sm font-medium text-gray-500 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              value === result ? getResultColor(result) : "input-field"
            }`}
          >
            {getResultIcon(result)}
            <span className="capitalize">{result}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
