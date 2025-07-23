import { ApiError } from "next/dist/server/api-utils";
import { handleGetRequest } from "./handler";
import Message from "@/types/message";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_URL = `${BASE_URL}/messages`;

export const getAllMessages = async (
  token: string,
  onError: (error: ApiError) => void
): Promise<Message[] | null> => {
  try {
    const data = await handleGetRequest<Message[]>(
      API_URL,
      "Fetch messages",
      token
    );
    return data;
  } catch (error) {
    onError(error as ApiError);
    return null;
  }
};
