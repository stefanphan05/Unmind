import { ApiError } from "next/dist/server/api-utils";
import { handleMutationRequest } from "./handler";

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export interface SignUpPayload {
  email: string;
  username: string;
  password: string;
}

export const signUpUser = async (
  payload: SignUpPayload,
  onError: (error: ApiError) => void
): Promise<string | null> => {
  try {
    const data = await handleMutationRequest<{ message: string }>(
      `${AUTH_BASE_URL}/signup`,
      "SignUpError",
      payload,
      "POST"
    );

    return data.message;
  } catch (error) {
    onError(error as ApiError);
    return null;
  }
};

export interface SignInPayload {
  email: string;
  password: string;
}

export const signInUser = async (
  payload: SignInPayload,
  onError: (error: ApiError) => void
): Promise<string | null> => {
  try {
    const data = await handleMutationRequest<{ token: string }>(
      `${AUTH_BASE_URL}/signin`,
      "SignUpError",
      payload,
      "POST"
    );
    return data.token;
  } catch (error) {
    onError(error as ApiError);
    return null;
  }
};

export const signInWithGoogle = async (
  googleToken: string,
  onError: (error: ApiError) => void
): Promise<string | null> => {
  try {
    const data = await handleMutationRequest<{ token: string }>(
      `${AUTH_BASE_URL}/google-signin`,
      "Google signin",
      { credential: googleToken },
      "POST"
    );

    return data.token;
  } catch (error) {
    onError(error as ApiError);
    return null;
  }
};
