import { NotificationListResponse } from "../domain/models/notification";
import { NotificationAdapter } from "../interfaces/adapters/NotificationAdapter";
import { NotificationUseCase } from "../interfaces/usecases/NotificationUseCase";

export class NotificationService implements NotificationUseCase {
    constructor(private notificationAdapter: NotificationAdapter) {}

    getUnreadCount(): Promise<number> {
        return this.notificationAdapter.getUnreadCount();
    }
    fetchNotifications(): Promise<NotificationListResponse> {
        return this.notificationAdapter.fetchNotifications();
    }

}