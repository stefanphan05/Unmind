import { ApiError } from "next/dist/server/api-utils";
import { handleGetRequest } from "./handler";
import { TherapySession } from "@/types/therapySession";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const getAllSessions = async (
  token: string,
  onError: (error: ApiError) => void
): Promise<TherapySession[] | null> => {
  try {
    const data = await handleGetRequest<TherapySession[]>(
      `${BASE_URL}/sessions`,
      "Fetch sessions",
      token
    );
    return data;
  } catch (error) {
    onError(error as ApiError);
    return null;
  }
};
