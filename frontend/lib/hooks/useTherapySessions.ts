import { useCallback, useEffect, useState } from "react";

import { ApiError } from "next/dist/server/api-utils";
import { TherapySession } from "@/types/therapySession";
import { getStoredToken } from "../utils/authToken";
import {
  getAllSessions,
  getOrCreateDraftSession,
  updateSession,
  deleteSession,
} from "../api/session";
import {
  CACHE_KEYS,
  STALE_MS,
  getCacheEntry,
  invalidateCache,
  isCacheFresh,
  setCacheEntry,
} from "../cache/apiCache";

interface UseTherapySessionsOptions {
  /** When false, sessions load only when fetchSessions() is called (e.g. sidebar open). */
  fetchOnMount?: boolean;
}

function readCachedSessions(): TherapySession[] {
  return getCacheEntry<TherapySession[]>(CACHE_KEYS.sessions)?.data ?? [];
}

export default function useTherapySessions(
  onError: (e: ApiError) => void,
  options: UseTherapySessionsOptions = {}
) {
  const { fetchOnMount = true } = options;
  const [sessions, setSessions] = useState<TherapySession[]>(readCachedSessions);
  const [isLoading, setIsLoading] = useState(
    fetchOnMount && !isCacheFresh(CACHE_KEYS.sessions, STALE_MS.sessions)
  );

  const fetchSessions = useCallback(
    async (opts?: { force?: boolean }) => {
      const token = getStoredToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const cached = getCacheEntry<TherapySession[]>(CACHE_KEYS.sessions);
      const fresh =
        !opts?.force &&
        cached &&
        isCacheFresh(CACHE_KEYS.sessions, STALE_MS.sessions);

      if (cached) {
        setSessions(cached.data);
      }

      if (fresh) {
        setIsLoading(false);
        return;
      }

      if (!cached) {
        setIsLoading(true);
      }

      const data = await getAllSessions(token, onError);

      if (data) {
        setCacheEntry(CACHE_KEYS.sessions, data);
        setSessions(data);
      }
      setIsLoading(false);
    },
    [onError]
  );

  const refreshSessions = useCallback(async () => {
    invalidateCache(CACHE_KEYS.sessions);
    await fetchSessions({ force: true });
  }, [fetchSessions]);

  const startNewConversation = async (forceNew = true) => {
    const token = getStoredToken();
    if (!token) return null;

    const draft = await getOrCreateDraftSession(token, onError, { forceNew });
    await refreshSessions();
    return draft;
  };

  const update = async (payload: TherapySession) => {
    const token = getStoredToken();
    if (!token) return null;

    await updateSession(token, onError, payload);
    await refreshSessions();
  };

  const remove = async (id: string) => {
    const token = getStoredToken();
    if (!token) return null;

    await deleteSession(token, onError, id);
    invalidateCache(CACHE_KEYS.messages(Number(id)));
    await refreshSessions();
  };

  useEffect(() => {
    if (fetchOnMount) {
      fetchSessions();
    }
  }, [fetchOnMount, fetchSessions]);

  return {
    sessions,
    isLoading,
    fetchSessions,
    startNewConversation,
    update,
    remove,
  };
}
