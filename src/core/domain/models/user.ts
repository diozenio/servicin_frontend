export type UserRole = "provider" | "customer";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl: string;
  role: UserRole;
  createdAt: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  name: string;
  email: string;
  phone?: string;
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
