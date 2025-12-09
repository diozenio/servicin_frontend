import { AuthUseCase } from "@/core/interfaces/usecases/AuthUseCase";
import { AuthAdapter } from "@/core/interfaces/adapters/AuthAdapter";
import {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  User,
} from "@/core/domain/models/user";

export class AuthService implements AuthUseCase {
  constructor(private authAdapter: AuthAdapter) {}

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return await this.authAdapter.login(credentials);
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    return await this.authAdapter.signup(userData);
  }

  async logout(): Promise<boolean> {
    return await this.authAdapter.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    return await this.authAdapter.getCurrentUser();
  }
}
