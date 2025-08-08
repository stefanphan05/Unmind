import { ApiError } from "next/dist/server/api-utils";
import { handleGetRequest, handleMutationRequest } from "./handler";
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

export const createSession = async (
  token: string,
  onError: (error: ApiError) => void,
  payload: TherapySession
): Promise<TherapySession | null> => {
  try {
    const data = await handleMutationRequest<TherapySession>(
      `${BASE_URL}/sessions`,
      "Create session",
      payload,
      "POST",
      token
    );
    return data;
  } catch (error) {
    onError(error as ApiError);
    return null;
  }
};

export const updateSession = async (
  token: string,
  onError: (error: ApiError) => void,
  payload: TherapySession
): Promise<TherapySession | null> => {
  try {
    const data = await handleMutationRequest<TherapySession>(
      `${BASE_URL}/sessions`,
      "Update session",
      payload,
      "PATCH",
      token
    );
    return data;
  } catch (error) {
    onError(error as ApiError);
    return null;
  }
};
