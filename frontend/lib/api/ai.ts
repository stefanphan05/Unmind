import { ApiError } from "next/dist/server/api-utils";
import { handleMutationRequest } from "./handler";

import Message from "@/types/message";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export interface AIAnswerResponse {
  question: string;
  answer: Message;
  audio?: string;
}

export const getAIAnswer = async (
  content: string,
  therapySessionId: number,
  onError: (error: ApiError) => void,
  token: string
): Promise<AIAnswerResponse | null> => {
  try {
    const res = await handleMutationRequest<AIAnswerResponse>(
      `${BASE_URL}/sessions/${therapySessionId}/messages/ai`,
      "get AI answer",
      { content },
      "POST",
      token
    );

    return res;
  } catch (error) {
    onError(error as ApiError);
    return null;
  }
};
