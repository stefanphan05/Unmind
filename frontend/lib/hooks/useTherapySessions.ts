import { useEffect, useState } from "react";

import { ApiError } from "next/dist/server/api-utils";
import { TherapySession } from "@/types/therapySession";
import { getStoredToken } from "../utils/authToken";
import {
  createSession,
  getAllSessions,
  updateSession,
  deleteSession,
} from "../api/session";

export default function useTherapySession(onError: (e: ApiError) => void) {
  const [sessions, setSessions] = useState<TherapySession[]>([]);

  const fetchSessions = async () => {
    const token = getStoredToken();
    if (!token) return;
    const data = await getAllSessions(token, onError);

    if (data) {
      setSessions(data);
    }
  };

  const create = async (payload: TherapySession) => {
    const token = getStoredToken();
    if (!token) return null;

    await createSession(token, onError, payload);
    fetchSessions();
  };

  const update = async (payload: TherapySession) => {
    const token = getStoredToken();
    if (!token) return null;

    await updateSession(token, onError, payload);
    fetchSessions();
  };

  const remove = async (id: string) => {
    const token = getStoredToken();
    if (!token) return null;

    await deleteSession(token, onError, id);
    fetchSessions();
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return { sessions, fetchSessions, create, update, remove };
}
