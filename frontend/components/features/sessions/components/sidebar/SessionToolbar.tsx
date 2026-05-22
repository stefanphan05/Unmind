import { Plus, Search } from "lucide-react";

interface SessionToolbarProps {
  onAdd: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function SessionToolbar({
  onAdd,
  searchQuery,
  onSearchChange,
}: SessionToolbarProps) {
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
          placeholder="Search history..."
          className="session-toolbar__search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="session-toolbar__add"
        aria-label="New conversation"
      >
        <Plus strokeWidth={2} className="h-5 w-5" />
      </button>
    </div>
  );
}
