import { NotificationListResponse } from "@/core/domain/models/notification";

export interface NotificationUseCase {
    fetchUnreadNotifications(): Promise<NotificationListResponse>;
    markAsRead(userId: string, notificationId: string): Promise<boolean>;
    fetchNotifications(): Promise<NotificationListResponse>;
}