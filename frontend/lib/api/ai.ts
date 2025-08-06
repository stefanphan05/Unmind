import { ApiError } from "next/dist/server/api-utils";
import { handleMutationRequest } from "./handler";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_URL = `${BASE_URL}/messages/ai/respond`;

export const getAIAnswer = async (
  content: string,
  therapySessionId: number,
  onError: (error: ApiError) => void,
  token: string
): Promise<void> => {
  try {
    await handleMutationRequest<{ answer: string }>(
      `${BASE_URL}/sessions/${therapySessionId}/messages/ai`,
      "get AI answer",
      { content },
      "POST",
      token
    );
  } catch (error) {
    onError(error as ApiError);
  }
};
