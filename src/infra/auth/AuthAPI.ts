import {
  LoginRequest,
  AuthResponse,
  SignupRequest,
  User,
} from "@/core/domain/models/user";
import { AuthAdapter } from "@/core/interfaces/adapters/AuthAdapter";
import { client } from "@/lib/client";

export class AuthAPI implements AuthAdapter {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { email, password } = credentials;
    const response = await client.post("/auth/login", { email, password });
    return response.data;
  }

  signup(userData: SignupRequest): Promise<AuthResponse> {
    throw new Error("Method not implemented.");
  }

  logout(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  getCurrentUser(): Promise<User | null> {
    throw new Error("Method not implemented.");
  }

  isAuthenticated(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
