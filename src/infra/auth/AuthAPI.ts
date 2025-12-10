import {
  LoginRequest,
  SignupRequest,
  LoginResponse,
  SignupResponse,
  LogoutResponse,
  GetCurrentUserResponse,
} from "@/core/domain/models/user";
import { AuthAdapter } from "@/core/interfaces/adapters/AuthAdapter";
import { ApiResponse } from "@/core/types/api";
import { client } from "@/lib/client";

export class AuthAPI implements AuthAdapter {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const { email, password } = credentials;
    const response = await client.post("/auth/login", { email, password });
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
    };
  }

  async signup(userData: SignupRequest): Promise<ApiResponse<SignupResponse>> {
    const response = await client.post("/auth/signup", userData);
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
    };
  }

  async logout(): Promise<ApiResponse<LogoutResponse>> {
    const response = await client.post("/auth/logout");
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
    };
  }

  async getCurrentUser(): Promise<ApiResponse<GetCurrentUserResponse>> {
    const response = await client.get("/auth/me");
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
    };
  }
}
