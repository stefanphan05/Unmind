import { ApiError } from "next/dist/server/api-utils";
import { handleMutationRequest } from "./handler";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_URL = `${BASE_URL}/ask`;

export const getAIAnswer = async (
  message: string,
  onError: (error: ApiError) => void,
  token: string
): Promise<void> => {
  await handleMutationRequest<{ answer: string }>(
    API_URL,
    "get AI answer",
    { message },
    "POST",
    token
  );
};
