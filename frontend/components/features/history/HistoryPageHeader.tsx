"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";

interface HistoryPageHeaderProps {
  onNewConversation: () => void;
  isCreating?: boolean;
}

export default function HistoryPageHeader({
  onNewConversation,
  isCreating = false,
}: HistoryPageHeaderProps) {
  const router = useRouter();

  return (
    <header className="history-page__header chat-top-bar">
      <div className="chat-top-bar__inner">
        <div className="chat-top-bar__start">
          <button
            type="button"
            className="chat-sessions-btn"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="chat-sessions-btn__icon" strokeWidth={1.75} />
            <span className="chat-sessions-btn__label">Back</span>
          </button>
          <button
            type="button"
            className="chat-top-bar__wordmark font-display"
            onClick={() => router.back()}
          >
            Unmind
          </button>
        </div>

        <div className="chat-top-bar__end">
          <button
            type="button"
            className="session-toolbar__add"
            onClick={onNewConversation}
            disabled={isCreating}
            aria-label="New conversation"
          >
            <Plus strokeWidth={2} className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
