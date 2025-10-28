"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { container } from "@/container";
import { LoginRequest, SignupRequest } from "@/core/domain/models/user";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const user = await container.authService.getCurrentUser();
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
    onError: () => {
      // Login error handled by mutation
    },
  });

  const signupMutation = useMutation({
    mutationFn: (userData: SignupRequest) =>
      container.authService.signup(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/");
    },
    onError: () => {
      // Signup error handled by mutation
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => container.authService.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/");
    },
    onError: () => {
      // Logout error handled by mutation
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
