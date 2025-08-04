import { ApiError } from "next/dist/server/api-utils";
import { handleMutationRequest } from "./handler";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_URL = `${BASE_URL}/request-password-reset`;

export const requestPasswordReset = async (
  email: string,
  onError: (error: ApiError) => void
): Promise<void> => {
  try {
    await handleMutationRequest(API_URL, "Forgot Password", { email }, "POST");
  } catch (error) {
    onError(error as ApiError);
  }
};
