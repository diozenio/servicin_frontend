import { ApiResponse } from "@/core/types/api";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type AuthError = {
  message: string;
  field?: string;
};

export type UserWithPassword = User & {
  password: string;
};

export type AuthSession = {
  token: string;
  user: User;
  expiresAt: string;
};
