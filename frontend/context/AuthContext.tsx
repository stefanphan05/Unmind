"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Define the interface of the context
interface AuthContextType {
  isAuthenticated: boolean;
  signIn: (token: string, rememberMe: boolean) => void;
  signOut: () => void;
}

// Create an actual context
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  signIn: () => {},
  signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    setIsAuthenticated(!!token);
  }, []);

  // Sign in and store token based on "remmeber me"
  const signIn = (token: string, rememberMe: boolean) => {
    if (rememberMe) {
      localStorage.setItem("authToken", token);
      sessionStorage.removeItem("authToken");
    } else {
      sessionStorage.setItem("authToken", token);
      localStorage.removeItem("authToken");
    }
    setIsAuthenticated(true);
  };

  // Sign out and remove tokens
  const signOut = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
