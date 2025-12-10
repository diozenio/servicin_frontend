import { NotificationListResponse } from "@/core/domain/models/notification";
import { NotificationAdapter } from "@/core/interfaces/adapters/NotificationAdapter";
import { client } from "@/lib/client";

export class NotificationAPI implements NotificationAdapter {
  async fetchUnreadNotifications(): Promise<NotificationListResponse> {
    const response = await client.get(`/notifications/unread`);
    const data = response.data;
    return data as NotificationListResponse;
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    const response = await client.patch(
      `/notifications/${notificationId}/read`
    );
    return response.status === 200;
  }

  async fetchNotifications(): Promise<NotificationListResponse> {
    const response = await client.get(`/notifications`);
    const data = response.data;
    return data as NotificationListResponse;
  }
}
