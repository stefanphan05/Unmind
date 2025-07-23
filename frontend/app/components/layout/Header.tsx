"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const { isAuthenticated, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    router.push("/signin");
    signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Image
            src={"/images/unmind-logo.png"}
            alt="Logo"
            width={130}
            height={20}
          />

          {/* Navigation Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <button
                onClick={handleSignOut}
                className="group flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 ease-in-out cursor-pointer"
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span>Sign out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
