import { ApiError } from "next/dist/server/api-utils";

export const handleApiRequest = async <T>(
  url: string,
  payload: any,
  method: string,
  onError: (error: ApiError) => void,
  errorName: string,
  token?: string
): Promise<T> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add autorization header if token is provided
  if (token) {
    headers["Authorization"] = `Bear ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const apiError: ApiError = {
      name: "Error",
      statusCode: response.status,
      message: data.message || `Failed to ${errorName.toLowerCase()}`,
    };

    onError(apiError);
    throw apiError;
  }

  return data;
};
