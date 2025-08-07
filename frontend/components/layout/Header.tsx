"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { FaAngleDown } from "react-icons/fa6";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { LogOut } from "lucide-react";
import { MdOutlineEmail } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";
import { getStoredToken } from "@/lib/utils/authToken";
import { ApiError } from "next/dist/server/api-utils";

import { removeAllMessages } from "@/lib/api/chat";
import { useAuth } from "@/providers/auth-provider";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  onError: (error: ApiError) => void;
  onRefresh: () => void;
}

export default function Header({
  isSidebarOpen,
  setIsSidebarOpen,
  onError,
  onRefresh,
}: HeaderProps) {
  const router = useRouter();
  const { isAuthenticated, user, signOut } = useAuth();

  const params = useParams();

  const therapySessionId = Number(params?.therapySessionId);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [chatMenuOpen, setChatMenuOpen] = useState(false);

  const handleSignOut = () => {
    router.push("/signin");
    signOut();
  };

  const handleDeleteMessages = async () => {
    const token = getStoredToken();
    if (token) {
      await removeAllMessages(token, therapySessionId, onError);
    }

    setChatMenuOpen(false);
    onRefresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="max-w-full p-3">
        <div className="flex items-center justify-between">
          {/* ---------- LEFT SECTION: Logo & Sidebar ---------- */}
          <div className="flex justify-center items-center">
            {/* Sidebar toggle button */}
            <button
              className="cursor-pointer hover:bg-gray-100 p-2 rounded-xl"
              onClickCapture={() => setIsSidebarOpen((prev) => !prev)}
            >
              {isSidebarOpen ? (
                <GoSidebarExpand className="h-6 w-6" title="Close sidebar" />
              ) : (
                <GoSidebarCollapse className="h-6 w-6" title="Open sidebar" />
              )}
            </button>

            {/* App name with dropdown icon to change voices */}
            <button className="cursor-pointer hover:bg-gray-100 p-2 rounded-xl">
              <div className="flex justify-center items-center gap-1">
                <p className="text-lg">Unmind</p>
                <FaAngleDown className="h-4 w-4 text-gray-400" />
              </div>
            </button>
          </div>

          {/* ---------- RIGHT SECTION: User Profile Dropdown ---------- */}
          <div>
            {isAuthenticated && (
              <button
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-xl"
                onClick={() => setChatMenuOpen((prev) => !prev)}
              >
                <BsThreeDots className="w-6 h-6" />
              </button>
            )}

            {chatMenuOpen && (
              <div className="absolute right-13 top-12 mt-2 w-max min-w-[12rem] bg-white rounded-xl shadow-lg border border-gray-300 z-50">
                <ul className="p-1">
                  {/* Sign out button */}
                  <li
                    onClick={handleDeleteMessages}
                    className="px-4 py-1 hover:bg-red-50 rounded-xl text-red-600 cursor-pointer flex items-center gap-2"
                  >
                    <FiTrash2 className="w-5 h-5" />
                    <span>Delete</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Profile icon button to toggle menu */}
            {isAuthenticated && (
              <button
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-xl"
                onClick={() => setUserMenuOpen((prev) => !prev)}
              >
                <CgProfile className="w-6 h-6" />
              </button>
            )}

            {/* Profile dropdown menu */}
            {userMenuOpen && (
              <div className="absolute right-4 top-12 mt-2 w-max min-w-[12rem] bg-white rounded-xl shadow-lg border border-gray-300 z-50">
                <ul className="p-1">
                  {/* Show user email if available */}
                  <li className="px-4 py-1 hover:bg-gray-100 rounded-xl cursor-pointer flex items-center gap-2 text-gray-500">
                    <MdOutlineEmail className="w-5 h-5" />
                    <span className="break-all">{user?.email}</span>
                  </li>

                  {/* Show username if available */}
                  <li className="px-4 py-1 hover:bg-gray-100 rounded-xl cursor-pointer flex items-center gap-2 text-gray-500">
                    <CgProfile className="w-5 h-5" />
                    <span>{user?.username}</span>
                  </li>

                  {/* Sign out button */}
                  <li
                    onClick={handleSignOut}
                    className="px-4 py-1 hover:bg-red-50 rounded-xl text-red-600 cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign out</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
