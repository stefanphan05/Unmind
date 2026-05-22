"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";

import { TherapySession } from "@/types/therapySession";

import TherapySessionModal from "../modal/TherapySessionModal";
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
  const { handleError } = useErrorHandler();

  const { sessions, create, update, remove } = useTherapySessions(handleError);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"edit" | "create">("create");
  const [selectedSession, setSelectedSession] = useState<TherapySession | null>(
    null
  );

  const openCreateModal = () => {
    setMode("create");
    setSelectedSession(null);
    setIsModalOpen(true);
  };

  const openEditModal = (session: TherapySession) => {
    setMode("edit");
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCreate = async (payload: TherapySession) => {
    await create(payload);
    setIsModalOpen(false);
  };

  const handleUpdate = async (payload: TherapySession) => {
    await update(payload);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    setIsModalOpen(false);
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
            <p className="session-drawer__eyebrow">Journal</p>
            <h2 className="session-drawer__title font-display">Your sessions</h2>
          </div>
          <button
            type="button"
            className="session-drawer__close"
            onClick={onClose}
            aria-label="Close sessions"
          >
            <X strokeWidth={1.75} className="h-5 w-5" />
          </button>
        </div>

        <SessionToolbar onAdd={openCreateModal} />
        <SessionList
          sessions={sessions}
          onMenuClick={openEditModal}
          onNavigate={onClose}
        />
      </aside>

      <TherapySessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        session={selectedSession}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        mode={mode}
      />
    </>
  );
}
