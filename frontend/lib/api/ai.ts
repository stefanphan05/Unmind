import Message from "@/types/message";
import { ApiError } from "next/dist/server/api-utils";
import { handleApiRequest } from "./request";

const API_URL = "http://127.0.0.1:5000/v1/unmind/ask";

export const getAIAnswer = async (
  message: string,
  onNewMessage: (message: Message) => void,
  onError: (error: ApiError) => void,
  token: string
): Promise<void> => {
  // Add the user's message immediately
  onNewMessage({
    id: Date.now().toString() + "-user",
    content: message,
    role: "user",
    timestamp: new Date(),
  });

  const response = await handleApiRequest<{ answer: string }>(
    API_URL,
    { message },
    "POST",
    onError,
    "get AI answer",
    token
  );

  onNewMessage({
    id: Date.now().toString() + "-assistant",
    content: response.answer,
    role: "assistant",
    timestamp: new Date(),
  });
};
