import { ApiError } from "next/dist/server/api-utils";

export interface SignUpPayload {
  email: string;
  username: string;
  password: string;
}

export interface SignUpResponse {
  message: string;
}

export const signUpUser = async (
  payload: SignUpPayload,
  onError: (error: ApiError) => void
): Promise<void> => {
  try {
    const response = await fetch("http://127.0.0.1:5000/v1/unmind/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || "Failed to sign up";

      const apiError: ApiError = {
        name: "SignUpError",
        statusCode: response.status,
        message: errorMessage,
      };

      onError(apiError);

      throw apiError;
    }

    const data = await response.json();
    return data.message;
  } catch (err: any) {
    if (err.name === "SignUpError") {
      throw err;
    }

    // For network errors, create a new ApiError
    const networkError: ApiError = {
      name: "Network Error",
      statusCode: 500,
      message: err.message || "Network error occurred",
    };

    onError(networkError);
    throw networkError;
  }
};
