import {
  Notification,
  MarkAsReadResponse,
  MarkAllAsReadResponse,
} from "@/core/domain/models/notification";
import { ApiResponse } from "@/core/types/api";

export interface NotificationAdapter {
  fetchNotifications(): Promise<ApiResponse<Notification[]>>;
  fetchUnreadNotifications(): Promise<ApiResponse<Notification[]>>;
  fetchNotificationById(id: string): Promise<ApiResponse<Notification | null>>;
  markAsRead(notificationId: string): Promise<ApiResponse<MarkAsReadResponse>>;
  markAllAsRead(): Promise<ApiResponse<MarkAllAsReadResponse>>;
}
