"use client";

import { useAuth } from "@/context/AuthContext";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { FaAngleDown } from "react-icons/fa6";
import { GoSidebarCollapse } from "react-icons/go";

import { CgProfile } from "react-icons/cg";
import { LogOut } from "lucide-react";
import { MdOutlineEmail } from "react-icons/md";

export default function Header() {
  const { isAuthenticated, signOut } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    router.push("/signin");
    signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="max-w-full p-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex justify-center items-center">
            <button className="cursor-pointer hover:bg-gray-100 p-2 rounded-xl">
              <GoSidebarCollapse className="h-6 w-6" title="Open sidebar" />
            </button>
            <button className="cursor-pointer hover:bg-gray-100 p-2 rounded-xl">
              <div className="flex justify-center items-center gap-1">
                <p className="text-lg">Unmind</p>
                <FaAngleDown className="h-4 w-4 text-gray-400" />
              </div>
            </button>
            {/* <GoSidebarExpand /> */}
          </div>

          {/* Right Section */}
          <div>
            {isAuthenticated && (
              <div className="flex">
                <button
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded-xl"
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  <CgProfile className="w-6 h-6" />
                </button>
              </div>
            )}

            {menuOpen && (
              <div className="absolute right-4 top-12 mt-2 w-100 bg-white rounded-xl shadow-lg border border-gray-300 z-50">
                <ul className="p-1">
                  <li className="px-4 py-1 hover:bg-gray-100 rounded-xl cursor-pointer flex items-center gap-2 text-gray-500">
                    <MdOutlineEmail className="w-5 h-5" />
                    <span>phannguyentuanhung2005@gmail.com</span>
                  </li>
                  <li className="px-4 py-1 hover:bg-gray-100 rounded-xl cursor-pointer flex items-center gap-2 text-gray-500">
                    <CgProfile className="w-5 h-5" />
                    <span>Stefan</span>
                  </li>
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
