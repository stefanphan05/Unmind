import { TherapySession } from "@/types/therapySession";

interface StatusSelectorProps {
  value: TherapySession["status"];
  onChange: (val: TherapySession["status"]) => void;
}

const getStatusColor = (status: TherapySession["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-700 border-green-200";
    case "upcoming":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "ongoing":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    default:
      return "";
  }
};

export default function StatusSelector({
  value,
  onChange,
}: StatusSelectorProps) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-2">Status</label>
      <div className="grid grid-cols-3 gap-2">
        {(["upcoming", "ongoing", "completed"] as const).map((status) => (
          <button
            key={status}
            onClick={() => onChange(status)}
            className={`px-6 py-4 rounded-2xl text-sm text-gray-500 font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              value === status ? getStatusColor(status) : "input-field"
            }`}
          >
            <span className="capitalize">{status}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
