import { handleApiRequest } from "./request";
import { ApiError } from "next/dist/server/api-utils";

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export interface SignUpPayload {
  email: string;
  username: string;
  password: string;
}

export const signUpUser = async (
  payload: SignUpPayload,
  onError: (error: ApiError) => void
): Promise<string> => {
  const data = await handleApiRequest<{ message: string }>(
    `${AUTH_BASE_URL}/signup`,
    payload,
    "POST",
    onError,
    "SignUpError"
  );

  return data.message;
};

export interface SignInPayload {
  email: string;
  password: string;
}

export const signInUser = async (
  payload: SignInPayload,
  onError: (error: ApiError) => void
): Promise<string> => {
  const data = await handleApiRequest<{ token: string }>(
    `${AUTH_BASE_URL}/signin`,
    payload,
    "POST",
    onError,
    "SignUpError"
  );

  return data.token;
};

export const signInWithGoogle = async (
  googleToken: string,
  onError: (error: ApiError) => void
): Promise<string> => {
  const data = await handleApiRequest<{ token: string }>(
    `${AUTH_BASE_URL}/google-signin`,
    { credential: googleToken },
    "POST",
    onError,
    "Google signin"
  );

  return data.token;
};
