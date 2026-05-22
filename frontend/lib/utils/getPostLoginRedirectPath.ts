import { ApiError } from "next/dist/server/api-utils";

import { getOrCreateDraftSession } from "@/lib/api/session";

export const getPostLoginRedirectPath = async (
  token: string,
  onError: (error: ApiError) => void
): Promise<string> => {
  const draft = await getOrCreateDraftSession(token, onError, {
    forceNew: false,
  });

  if (!draft?.id) {
    throw new Error("Unable to open a new conversation.");
  }

  return `/chat/${draft.id}`;
};
