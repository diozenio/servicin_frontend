"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { container } from "@/container";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await container.notificationService.fetchNotifications();
      return response.data || [];
    },
  });
}

export function useUnreadNotifications() {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: async () => {
      const response =
        await container.notificationService.fetchUnreadNotifications();
      return response.data || [];
    },
  });
}

export function useNotification(id: string | undefined) {
  return useQuery({
    queryKey: ["notifications", id],
    queryFn: async () => {
      if (!id) return null;
      const response =
        await container.notificationService.fetchNotificationById(id);
      return response.data;
    },
    enabled: !!id,
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
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await container.notificationService.markAllAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
  });
}
