import axios, { AxiosError } from "axios";

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { data, status } = error.response;

      if (data && typeof data === "object" && "message" in data) {
        const errorMessage = (data as { message: string }).message;
        const errorWithMessage = new Error(errorMessage);
        (errorWithMessage as any).status = status;
        (errorWithMessage as any).response = error.response;
        return Promise.reject(errorWithMessage);
      }
    }

    return Promise.reject(error);
  }
);
