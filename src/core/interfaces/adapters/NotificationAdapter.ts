import { NotificationListResponse } from "@/core/domain/models/notification";

export interface NotificationAdapter {
    fetchUnreadNotifications(): Promise<NotificationListResponse>;
    markAsRead(notificationId: string): Promise<boolean>;
    fetchNotifications(): Promise<NotificationListResponse>;
}