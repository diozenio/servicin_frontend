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

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await client.post("/auth/signup", userData);
    return response.data;
  }

  async logout(): Promise<boolean> {
    const response = await client.post("/auth/logout");
    return !!response.data.message;
  }

  async getCurrentUser(): Promise<User | null> {
    const response = await client.get("/auth/me");
    return response.data;
  }
}
