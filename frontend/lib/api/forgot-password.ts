import { ApiError } from "next/dist/server/api-utils";
import { handleMutationRequest } from "./handler";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_URL = `${BASE_URL}/request-password-reset`;

export const requestPasswordReset = async (
  email: string,
  onError: (error: ApiError) => void
): Promise<void> => {
  try {
    await handleMutationRequest(
      `${BASE_URL}/request-password-reset`,
      "Forgot Password",
      { email },
      "POST"
    );
  } catch (error) {
    onError(error as ApiError);
    throw error;
  }
};

export const verifyResetCode = async (
  code: string,
  email: string,
  onError: (error: ApiError) => void
): Promise<string | null> => {
  try {
    const data = await handleMutationRequest<{ token: string }>(
      `${BASE_URL}/verify-reset-code`,
      "Code verification",
      { email, code },
      "POST"
    );
    return data.token;
  } catch (error) {
    onError(error as ApiError);
    throw error;
  }
};

export const resetPassword = async (
  token: string | null,
  newPassword: string,
  onError: (error: ApiError) => void
): Promise<void> => {
  try {
    await handleMutationRequest<void>(
      `${BASE_URL}/reset-password`,
      "Code verification",
      { token: token, new_password: newPassword },
      "POST"
    );
  } catch (error) {
    onError(error as ApiError);
    throw error;
  }
};
