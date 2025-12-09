import { ApiError } from "next/dist/server/api-utils";
import { handleGetRequest, handleMutationRequest } from "./handler";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export interface Voice {
  name: string;
  id: string;
}

export interface CurrentVoiceResponse {
  status: string;
  current_voice: string;
  voice_id: string;
  available_voices: string[];
}

export interface SwitchVoiceResponse {
  status: string;
  message: string;
  current_voice: string;
  voice_id: string;
}

export const getCurrentVoice = async (
  token: string,
  onError: (error: ApiError) => void
): Promise<CurrentVoiceResponse | null> => {
  try {
    const data = await handleGetRequest<CurrentVoiceResponse>(
      `${BASE_URL}/voice/current`,
      "Fetch current voice",
      token
    );
    return data;
  } catch (error) {
    onError(error as ApiError);
    return null;
  }
};

export const switchVoice = async (
  token: string,
  voiceName: string,
  onError: (error: ApiError) => void
): Promise<SwitchVoiceResponse | null> => {
  try {
    const data = await handleMutationRequest<SwitchVoiceResponse>(
      `${BASE_URL}/voice/switch`,
      "Switch voice",
      { voice: voiceName },
      "POST",
      token
    );
    return data;
  } catch (error) {
    onError(error as ApiError);
    return null;
  }
};
