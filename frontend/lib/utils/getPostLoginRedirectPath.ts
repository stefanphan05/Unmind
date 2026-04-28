import { ApiError } from "next/dist/server/api-utils";

import { createSession } from "@/lib/api/session";

export const getPostLoginRedirectPath = async (
  token: string,
  onError: (error: ApiError) => void
): Promise<string> => {
  const createdSession = await createSession(token, onError, {
    name: "New session",
    status: "upcoming",
    result: "neutral",
  });

  if (!createdSession?.id) {
    throw new Error("Unable to create a new therapy session.");
  }

  return `/chat/${createdSession.id}`;
};
