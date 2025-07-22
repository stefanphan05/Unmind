import { ApiError } from "next/dist/server/api-utils";
import { useState } from "react";

export function useErrorHandler() {
  const [error, setError] = useState<ApiError | null>(null);

  const handleError = (error: ApiError) => {
    setError(error);
  };

  const closeErrorModal = () => {
    setError(null);
  };

  return {
    error,
    handleError,
    closeErrorModal,
  };
}
