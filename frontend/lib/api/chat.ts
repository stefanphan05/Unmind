import { ApiError } from "next/dist/server/api-utils";
import { handleGetRequest, handleMutationRequest } from "./handler";
import Message from "@/types/message";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const getAllMessages = async (
  token: string,
  onError: (error: ApiError) => void
): Promise<Message[] | null> => {
  try {
    const data = await handleGetRequest<Message[]>(
      `${BASE_URL}/messages`,
      "Fetch messages",
      token
    );
    return data;
  } catch (error) {
    onError(error as ApiError);
    return null;
  }
};

export const saveUserInput = async (
  token: string,
  onError: (error: ApiError) => void,
  content: string
): Promise<void> => {
  try {
    await handleMutationRequest<Message[]>(
      `${BASE_URL}/messages/user`,
      "Save user input error",
      { content },
      "POST",
      token
    );
  } catch (error) {
    onError(error as ApiError);
  }
};

export const removeAllMessages = async (
  token: string,
  onError: (error: ApiError) => void
): Promise<Message[] | null> => {
  try {
    const data = await handleMutationRequest<Message[]>(
      `${BASE_URL}/messages`,
      "Remove messages",
      {},
      "DELETE",
      token
    );
    return data;
  } catch (error) {
    onError(error as ApiError);
    return null;
  }
};
