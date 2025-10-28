import {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  User,
} from "@/core/domain/models/user";

export interface AuthUseCase {
  login(credentials: LoginRequest): Promise<AuthResponse>;
  signup(userData: SignupRequest): Promise<AuthResponse>;
  logout(): Promise<boolean>;
  getCurrentUser(): Promise<User | null>;
  isAuthenticated(): Promise<boolean>;
}
