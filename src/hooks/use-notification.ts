"use client";

import { useQuery } from "@tanstack/react-query";
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
