import {
  Notification,
  MarkAsReadResponse,
  MarkAllAsReadResponse,
} from "../domain/models/notification";
import { NotificationAdapter } from "../interfaces/adapters/NotificationAdapter";
import { NotificationUseCase } from "../interfaces/usecases/NotificationUseCase";
import { ApiResponse } from "@/core/types/api";

export class NotificationService implements NotificationUseCase {
  constructor(private notificationAdapter: NotificationAdapter) {}

  async fetchNotifications(): Promise<ApiResponse<Notification[]>> {
    return await this.notificationAdapter.fetchNotifications();
  }

  async fetchUnreadNotifications(): Promise<ApiResponse<Notification[]>> {
    return await this.notificationAdapter.fetchUnreadNotifications();
  }

  async fetchNotificationById(
    id: string
  ): Promise<ApiResponse<Notification | null>> {
    return await this.notificationAdapter.fetchNotificationById(id);
  }

  async markAsRead(
    notificationId: string
  ): Promise<ApiResponse<MarkAsReadResponse>> {
    return await this.notificationAdapter.markAsRead(notificationId);
  }

  async markAllAsRead(): Promise<ApiResponse<MarkAllAsReadResponse>> {
    return await this.notificationAdapter.markAllAsRead();
  }
}