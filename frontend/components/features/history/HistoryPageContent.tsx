"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import HistoryCard from "./HistoryCard";
import HistoryPageHeader from "./HistoryPageHeader";
import SessionToolbar from "@/components/features/sessions/components/sidebar/SessionToolbar";
import ErrorModal from "@/components/features/modals/ErrorModal";

import useTherapySessions from "@/lib/hooks/useTherapySessions";
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";

export default function HistoryPageContent() {
  useAuthRedirect();
  const router = useRouter();
  const { error, handleError, closeErrorModal } = useErrorHandler();

  const { sessions, isLoading, startNewConversation } =
    useTherapySessions(handleError);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const filteredSessions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sessions;

    return sessions.filter((session) => {
      const title = (session.name ?? "").toLowerCase();
      const summary = (session.summary ?? "").toLowerCase();
      return title.includes(q) || summary.includes(q);
    });
  }, [sessions, searchQuery]);

  const handleNewConversation = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const draft = await startNewConversation(true);
      if (draft?.id) {
        router.push(`/chat/${draft.id}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <HistoryPageHeader
        onNewConversation={handleNewConversation}
        isCreating={isCreating}
      />

      <div className="history-page__intro">
        <p className="history-page__eyebrow">Your conversations</p>
        <h1 className="history-page__title font-display">History</h1>
        <p className="history-page__subtitle">
          Browse past sessions with full titles and summaries.
        </p>
      </div>

      <SessionToolbar
        onAdd={handleNewConversation}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="history-page__list">
        {isLoading ? (
          <div className="chat-loading history-page__loading">
            <div className="chat-loading__spinner" aria-hidden="true" />
            <p>Loading your history...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="history-page__empty">
            <p className="history-page__empty-title font-display">
              {searchQuery.trim() ? "No matches" : "No history yet"}
            </p>
            <p className="history-page__empty-text">
              {searchQuery.trim()
                ? "Try a different search term or start a new conversation."
                : "Start a new conversation and it will show up here with a summary."}
            </p>
            {!searchQuery.trim() && (
              <button
                type="button"
                className="history-page__empty-cta"
                onClick={handleNewConversation}
                disabled={isCreating}
              >
                Start a conversation
              </button>
            )}
          </div>
        ) : (
          <div className="history-page__grid">
            {filteredSessions.map((session) => (
              <HistoryCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>

      <ErrorModal error={error} onClose={closeErrorModal} />
    </>
  );
}
