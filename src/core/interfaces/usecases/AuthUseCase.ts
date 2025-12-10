import {
  LoginRequest,
  SignupRequest,
  LoginResponse,
  SignupResponse,
  LogoutResponse,
  GetCurrentUserResponse,
} from "@/core/domain/models/user";
import { ApiResponse } from "@/core/types/api";

export interface AuthUseCase {
  login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>>;
  signup(userData: SignupRequest): Promise<ApiResponse<SignupResponse>>;
  logout(): Promise<ApiResponse<LogoutResponse>>;
  getCurrentUser(): Promise<ApiResponse<GetCurrentUserResponse>>;
}
