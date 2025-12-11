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
    const { data } = await client.post("/auth/login", { email, password });
    return data;
  }

  async signup(userData: SignupRequest): Promise<ApiResponse<SignupResponse>> {
    const { data } = await client.post("/auth/signup", userData);
    return data;
  }

  async logout(): Promise<ApiResponse<LogoutResponse>> {
    const { data } = await client.post("/auth/logout");
    return data;
  }

  async getCurrentUser(): Promise<ApiResponse<GetCurrentUserResponse>> {
    const { data } = await client.get("/auth/me");
    return {
      data,
      success: true,
    };
  }
}
