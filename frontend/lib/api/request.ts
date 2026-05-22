import { RequestOptions } from "@/types/api";
import { ApiError } from "next/dist/server/api-utils";

export const sendRequest = async <T>({
  method,
  url,
  payload,
  token,
  errorName,
}: RequestOptions): Promise<T> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add autorization header if token is provided
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: method !== "GET" ? JSON.stringify(payload) : undefined,
    });
  } catch {
    const apiError: ApiError = {
      name: "Error",
      statusCode: 503,
      message:
        "Cannot reach the API server. Start the backend with `python3 main.py` in the backend folder (port 5001).",
    };
    throw apiError;
  }

  const data = await response.json();

  if (!response.ok) {
    const apiError: ApiError = {
      name: "Error",
      statusCode: response.status,
      message: data.message || `Failed to ${errorName.toLowerCase()}`,
    };
    throw apiError;
  }

  return data;
};
