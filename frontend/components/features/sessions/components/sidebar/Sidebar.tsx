"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";

import SessionList from "./SessionList";
import SessionToolbar from "./SessionToolbar";

import useTherapySessions from "@/lib/hooks/useTherapySessions";
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  useAuthRedirect();
  const router = useRouter();
  const { handleError } = useErrorHandler();

  const { sessions, isLoading, startNewConversation, fetchSessions } =
    useTherapySessions(handleError, { fetchOnMount: false });
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) fetchSessions();
  }, [isOpen, fetchSessions]);

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
        onClose();
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div
        className={`session-drawer-backdrop ${
          isOpen ? "session-drawer-backdrop--visible" : ""
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`session-drawer ${isOpen ? "session-drawer--open" : ""}`}
        aria-hidden={!isOpen}
      >
        <div className="session-drawer__header">
          <div>
            <p className="session-drawer__eyebrow">Unmind</p>
            <h2 className="session-drawer__title font-display">History</h2>
          </div>
          <button
            type="button"
            className="session-drawer__close"
            onClick={onClose}
            aria-label="Close history"
          >
            <X strokeWidth={1.75} className="h-5 w-5" />
          </button>
        </div>

        <SessionToolbar
          onAdd={handleNewConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <SessionList
          sessions={filteredSessions}
          isLoading={isLoading}
          onNavigate={onClose}
        />

        <div className="session-drawer__footer">
          <Link
            href="/history"
            className="session-drawer__full-history"
            onClick={onClose}
          >
            View full history
            <ArrowUpRight
              className="session-drawer__full-history-icon"
              strokeWidth={1.75}
            />
          </Link>
        </div>
      </aside>
    </>
  );
}
