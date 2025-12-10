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
    const response = await client.get("/notifications/");
    return {
      success: true,
      data: response.data.notifications,
    };
  }

  async fetchUnreadNotifications(): Promise<ApiResponse<Notification[]>> {
    const response = await client.get("/notifications/unread");
    return {
      success: true,
      data: response.data.notifications,
    };
  }

  async fetchNotificationById(
    id: string
  ): Promise<ApiResponse<Notification | null>> {
    if (!id) {
      return { success: false, data: null };
    }

    try {
      const response = await client.get(`/notifications/${id}`);
      return {
        success: true,
        data: response.data.notification,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
      };
    }
  }

  async markAsRead(
    notificationId: string
  ): Promise<ApiResponse<MarkAsReadResponse>> {
    const response = await client.patch(`/notifications/${notificationId}/read`);
    return {
      success: true,
      data: response.data,
    };
  }

  async markAllAsRead(): Promise<ApiResponse<MarkAllAsReadResponse>> {
    const response = await client.patch("/notifications/read-all");
    return {
      success: true,
      data: response.data,
    };
  }
}
