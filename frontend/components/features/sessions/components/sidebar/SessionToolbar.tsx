import { Plus, Search } from "lucide-react";

export default function SessionToolbar({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Therapy Sessions
        </h2>
        <button
          onClick={onAdd}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search sessions..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
