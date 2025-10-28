import {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  User,
} from "@/core/domain/models/user";

export abstract class AuthAdapter {
  abstract login(credentials: LoginRequest): Promise<AuthResponse>;
  abstract signup(userData: SignupRequest): Promise<AuthResponse>;
  abstract logout(): Promise<boolean>;
  abstract getCurrentUser(): Promise<User | null>;
  abstract isAuthenticated(): Promise<boolean>;
}
