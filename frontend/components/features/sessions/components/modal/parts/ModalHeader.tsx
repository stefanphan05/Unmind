import { Calendar, Plus, X } from "lucide-react";

interface ModalHeaderProps {
  mode: "edit" | "create";
  onClose: () => void;
}

export default function ModalHeader({ mode, onClose }: ModalHeaderProps) {
  return (
    <div className="px-6 py-5 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              mode === "create" ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            {mode === "create" ? (
              <Plus className="w-5 h-5 text-blue-600" />
            ) : (
              <Calendar className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {mode === "create" ? "New Session" : "Edit Session"}
            </h2>
            <p className="text-sm text-gray-500">
              {mode === "create"
                ? "Create a new therapy session"
                : "Update session details"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
