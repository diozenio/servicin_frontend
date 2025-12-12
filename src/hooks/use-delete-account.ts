"use client";

import { useMutation } from "@tanstack/react-query";
import { container } from "@/container";
import { useAuth } from "./use-auth";

export function useDeleteAccount() {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      await container.deleteAccountUseCase.execute();
      return null;
    },
    onSuccess: () => {
      logout();
    },
  });
}
