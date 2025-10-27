"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { container } from "@/container";
import { LoginRequest, SignupRequest, User } from "@/core/domain/models/user";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const user = await container.authService.getCurrentUser();
      console.log("useAuth: Current user", user);
      return user;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: isAuthenticated, isLoading: isLoadingAuth } = useQuery({
    queryKey: ["auth", "isAuthenticated"],
    queryFn: () => container.authService.isAuthenticated(),
    staleTime: 5 * 60 * 1000,
  });
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) =>
      container.authService.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/");
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const signupMutation = useMutation({
    mutationFn: (userData: SignupRequest) =>
      container.authService.signup(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/");
    },
    onError: (error) => {
      console.error("Signup error:", error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => container.authService.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/");
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });

  return {
    user,
    isAuthenticated: isAuthenticated || false,
    isLoading: isLoadingUser || isLoadingAuth,
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    logoutError: logoutMutation.error,
  };
}
