import { NotificationListResponse } from "@/core/domain/models/notification";
import { NotificationAdapter } from "@/core/interfaces/adapters/NotificationAdapter";
import { client } from "@/lib/client";

export class NotificationAPI implements NotificationAdapter {
    async getUnreadCount(): Promise<number> {
        const response = await client.get(`/notifications/unread`);
        const data = response.data;
        return data.unreadCount;
    }

    // async markAsRead(userId: string, notificationId: string): Promise<boolean> {
    //     // Implement API call to mark a notification as read
    //     const response = await fetch(`/api/notifications/${userId}/mark-as-read/${notificationId}`, {
    //         method: 'POST',
    //     });
    //     const data = await response.json();
    //     return data.success;
    // }

    async fetchNotifications(): Promise<NotificationListResponse> {
        const response = await client.get(`/notifications`);
        const data = response.data;
        return data as NotificationListResponse;
    }
}