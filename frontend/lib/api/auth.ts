import { handleApiRequest } from "./request";
import { ApiError } from "next/dist/server/api-utils";

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
    "http://127.0.0.1:5000/v1/unmind/signup",
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
    "http://127.0.0.1:5000/v1/unmind/signin",
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
    "http://127.0.0.1:5000/v1/unmind/google-signin",
    { credential: googleToken },
    "POST",
    onError,
    "Google signin"
  );

  return data.token;
};
