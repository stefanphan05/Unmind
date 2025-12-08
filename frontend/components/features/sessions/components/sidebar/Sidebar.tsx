"use client";

import { useState } from "react";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";

import { TherapySession } from "@/types/therapySession";

import TherapySessionModal from "../modal/TherapySessionModal";
import SessionList from "./SessionList";
import SessionToolbar from "./SessionToolbar";

import useTherapySessions from "@/lib/hooks/useTherapySessions";
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  useAuthRedirect();
  const { handleError } = useErrorHandler();
  const { sessions, create, update } = useTherapySessions(handleError);

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

  return (
    <>
      <div
        className={`
          bg-white border-r border-gray-200 flex flex-col h-screen 
          transition-all duration-300 ease-in-out z-40  // <-- Added transition for smooth open/close
          ${
            isOpen
              ? "w-80 translate-x-0"
              : "w-0 -translate-x-full overflow-hidden"
          }
        `}
      >
        {isOpen && (
          <>
            <SessionToolbar onAdd={openCreateModal} />
            <SessionList sessions={sessions} onSelect={openEditModal} />
          </>
        )}
      </div>
      <TherapySessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        session={selectedSession}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        mode={mode}
      />
    </>
  );
}
