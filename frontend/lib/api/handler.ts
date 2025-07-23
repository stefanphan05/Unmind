import { RequestMethod } from "@/types/api";
import { sendRequest } from "./request";

export const handleMutationRequest = async <T>(
  url: string,
  errorName: string,
  payload: any,
  method: RequestMethod,
  token?: string
): Promise<T> => {
  return sendRequest<T>({ method, url, payload, token, errorName });
};

export const handleGetRequest = async <T>(
  url: string,
  errorName: string,
  token?: string
): Promise<T> => {
  return sendRequest<T>({ method: "GET", url, token, errorName });
};
