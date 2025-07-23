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

  const response = await fetch(url, {
    method,
    headers,
    body: method !== "GET" ? JSON.stringify(payload) : undefined,
  });

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
