import axios, { AxiosError } from "axios";
import { toast } from "sonner";

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

    if (
      !error.response &&
      (error.code === "ERR_NETWORK" || error.message === "Network Error")
    ) {
      if (typeof window !== "undefined") {
        toast.error(
          "Erro de conexão. Verifique sua internet e tente novamente."
        );
      }
      const networkError = new Error("Erro de conexão");
      (networkError as any).code = error.code;
      return Promise.reject(networkError);
    }

    return Promise.reject(error);
  }
);
