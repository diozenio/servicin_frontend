import { NotificationListResponse } from "@/core/domain/models/notification";

export interface NotificationAdapter {
    getUnreadCount(): Promise<number>;
    markAsRead(notificationId: string): Promise<boolean>;
    fetchNotifications(): Promise<NotificationListResponse>;
}