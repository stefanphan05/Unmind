import { Plus, Search } from "lucide-react";

export default function SessionToolbar({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="session-toolbar">
      <div className="session-toolbar__search-wrap">
        <Search
          className="session-toolbar__search-icon"
          strokeWidth={1.75}
          aria-hidden
        />
        <input
          type="text"
          placeholder="Search sessions..."
          className="session-toolbar__search"
        />
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="session-toolbar__add"
        aria-label="New session"
      >
        <Plus strokeWidth={2} className="h-5 w-5" />
      </button>
    </div>
  );
}
