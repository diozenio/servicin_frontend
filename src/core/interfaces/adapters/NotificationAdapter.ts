import { NotificationListResponse } from "@/core/domain/models/notification";

export interface NotificationAdapter {
    getUnreadCount(): Promise<number>;
    // markAsRead(userId: string, notificationId: string): Promise<boolean>;
    fetchNotifications(): Promise<NotificationListResponse>;
}