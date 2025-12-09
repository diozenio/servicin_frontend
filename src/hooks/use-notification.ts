"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { container } from "@/container";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await container.notificationService.fetchNotifications();
      return response.notifications || [];
    }
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["notifications", "unreadCount"],
    queryFn: async () => {
      const count = await container.notificationService.getUnreadCount();
      return count ?? 0;
    }
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      return await container.notificationService.markAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
