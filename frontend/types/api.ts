export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method: RequestMethod;
  url: string;
  payload?: any;
  token?: string;
  errorName: string;
}
