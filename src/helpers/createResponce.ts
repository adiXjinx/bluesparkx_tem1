// /utils/createResponse.ts

type Status = "success" | "error" | "info" | "warning";
type ResponseData<T = undefined> = {
  status: Status;
  message: string;
  data?: T;
  [key: string]: any; // allow additional info
};

export function createResponse<T = undefined>(
  status: Status,
  message: string,
  data?: T,
  extra?: Record<string, any>
): ResponseData<T> {
  return {
    status,
    message,
    ...(data !== undefined && { data }),
    ...extra,
  };
}
