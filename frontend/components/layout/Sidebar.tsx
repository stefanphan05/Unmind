"use client";

import { useErrorHandler } from "@/lib/hooks/useErrorHandler";
import { getAllSessions } from "@/lib/api/session";
import { TherapySession } from "@/types/therapySession";
import { getStoredToken } from "@/lib/utils/authToken";
import { Calendar, Plus, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { BsDashCircle } from "react-icons/bs";
import TherapySessionModal from "../features/sessions/TherapySessionModal";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const router = useRouter();
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"edit" | "create">("create");
  const [selectedSession, setSelectedSession] = useState<TherapySession | null>(
    null
  );

  const { error, handleError, closeErrorModal } = useErrorHandler();

  /**
   * Handle user authentication check and inital message loading
   */
  useEffect(() => {
    const token = getStoredToken();

    if (!token) {
      router.replace("/signin");
      return;
    }

    fetchSessions(token);
  }, []);

  const fetchSessions = async (token: string) => {
    try {
      const fetched = await getAllSessions(token, handleError);

      if (fetched) {
        setSessions(fetched);
      }
    } catch (error) {
      handleError({
        name: "Failed to fetch sessions",
        statusCode: 400,
        message: "Failed to fetch session",
      });
    }
  };

  const getStatusColor = (status: TherapySession["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "upcoming":
        return "text-blue-600 bg-blue-50";
      case "ongoing":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTypeIcon = (type: TherapySession["result"]) => {
    switch (type) {
      case "positive":
        return <AiOutlineLike className="w-4 h-4" />;
      case "neutral":
        return <BsDashCircle className="w-4 h-4" />;
      case "negative":
        return <AiOutlineDislike className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

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

  const handleSaveSession = () => {};

  return (
    <>
      <div
        className={`bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300 ease-in-out ${
          isOpen ? "w-80 opacity-100" : "w-0 opacity-0 overflow-hidden"
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b border-gray-200 transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Therapy Sessions
            </h2>
            <button
              onClick={openCreateModal}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:shadow-sm"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div
          className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out delay-75 ${
            isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        >
          <div className="p-4">
            <div className="space-y-3">
              {sessions.map((session, index) => (
                <div
                  key={session.id}
                  onClick={() => openEditModal(session)}
                  className={`p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-sm hover:border-gray-300 transform hover:scale-[1.02] ${
                    isOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                      {session.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        session.status
                      )}`}
                    >
                      {session.status}
                    </span>
                  </div>

                  <div className="flex gap-4 text-xs text-gray-500 justify-between">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {getTypeIcon(session.result)}
                      <span className="capitalize">{session.result}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <TherapySessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        session={selectedSession}
        onSave={handleSaveSession}
        mode={mode}
      />
    </>
  );
}
