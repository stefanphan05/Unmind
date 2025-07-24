import { jwtDecode } from "jwt-decode";

// ----------------Types----------------
export interface DecodedToken {
  email: string;
  username: string;
}

// ----------------Helper functions----------------
/**
 * Gets token from either localStorage or sessionStorage
 */
export const getStoredToken = (): string | null => {
  return (
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
  );
};

/**
 * Decodes a JWT token and returns user data
 */
export const decodeToken = (token: string): DecodedToken => {
  return jwtDecode<DecodedToken>(token);
};

/**
 * Stores token in either localStorage or sessionStorage based on rememberMe
 */
export const storeToken = (token: string, rememberMe: boolean) => {
  if (rememberMe) {
    localStorage.setItem("authToken", token);
    sessionStorage.removeItem("authToken");
  } else {
    sessionStorage.setItem("authToken", token);
    localStorage.removeItem("authToken");
  }
};

/**
 * Clear all stored tokens
 */
export const clearStoredToken = () => {
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");
};
