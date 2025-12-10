import { AuthUseCase } from "@/core/interfaces/usecases/AuthUseCase";
import { AuthAdapter } from "@/core/interfaces/adapters/AuthAdapter";
import {
  LoginRequest,
  SignupRequest,
  LoginResponse,
  SignupResponse,
  LogoutResponse,
  GetCurrentUserResponse,
} from "@/core/domain/models/user";
import { ApiResponse } from "@/core/types/api";

export class AuthService implements AuthUseCase {
  constructor(private authAdapter: AuthAdapter) {}

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return await this.authAdapter.login(credentials);
  }

  async signup(userData: SignupRequest): Promise<ApiResponse<SignupResponse>> {
    return await this.authAdapter.signup(userData);
  }

  async logout(): Promise<ApiResponse<LogoutResponse>> {
    return await this.authAdapter.logout();
  }

  async getCurrentUser(): Promise<ApiResponse<GetCurrentUserResponse>> {
    return await this.authAdapter.getCurrentUser();
  }
}
