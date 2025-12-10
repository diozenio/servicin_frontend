import {
  Notification,
  MarkAsReadResponse,
  MarkAllAsReadResponse,
} from "@/core/domain/models/notification";
import { NotificationAdapter } from "@/core/interfaces/adapters/NotificationAdapter";
import { ApiResponse } from "@/core/types/api";
import { client } from "@/lib/client";

export class NotificationAPI implements NotificationAdapter {
  async fetchNotifications(): Promise<ApiResponse<Notification[]>> {
    const { data } = await client.get("/notifications/");
    return data;
  }

  async fetchUnreadNotifications(): Promise<ApiResponse<Notification[]>> {
    const { data } = await client.get("/notifications/unread");
    return data;
  }

  async fetchNotificationById(
    id: string
  ): Promise<ApiResponse<Notification | null>> {
    if (!id) {
      return { success: false, data: null };
    }

    const { data } = await client.get(`/notifications/${id}`);
    return data;
  }

  async markAsRead(
    notificationId: string
  ): Promise<ApiResponse<MarkAsReadResponse>> {
    const { data } = await client.patch(
      `/notifications/${notificationId}/read`
    );
    return data;
  }

  async markAllAsRead(): Promise<ApiResponse<MarkAllAsReadResponse>> {
    const { data } = await client.patch("/notifications/read-all");
    return data;
  }
}
