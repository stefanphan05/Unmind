"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  clearStoredToken,
  DecodedToken,
  decodeToken,
  getStoredToken,
  storeToken,
} from "@/lib/utils/authToken";

// ----------------Types----------------
interface AuthContextType {
  isAuthenticated: boolean;
  user: DecodedToken | null;
  signIn: (token: string, rememberMe: boolean) => void;
  signOut: () => void;
}

// ----------------Create Context----------------
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  signIn: () => {},
  signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

// ----------------Provider Component----------------
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<DecodedToken | null>(null);

  // On inital load, check if a token is stored and decode it
  useEffect(() => {
    const token = getStoredToken();

    if (token) {
      const decodedUser = decodeToken(token);
      setUser(decodedUser);
      setIsAuthenticated(!!token);
    }
  }, []);

  // Sign in by storing token and decoding user info
  const signIn = (token: string, rememberMe: boolean) => {
    storeToken(token, rememberMe);
    const decodedUser = decodeToken(token);
    setUser(decodedUser);
    setIsAuthenticated(!!token);
  };

  // Sign out by clearing token and resetting state
  const signOut = () => {
    clearStoredToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
