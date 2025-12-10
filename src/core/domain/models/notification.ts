export type NotificationType =
  | "appointment"
  | "review"
  | "success"
  | "alert"
  | string;

export type Service = {
  id: string;
  name: string;
};

export type Appointment = {
  id: string;
  service: Service;
};

export type Review = {
  id: string;
  serviceId: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  appointmentId: string | null;
  reviewId: string | null;
  serviceId: string | null;
  createdAt: string;
  appointment?: Appointment;
  review?: Review;
  service?: Service;
};

export type NotificationListResponse = {
  notifications: Notification[];
};

export type NotificationResponse = {
  notification: Notification;
};

export type MarkAsReadResponse = {
  message: string;
};

export type MarkAllAsReadResponse = {
  message: string;
};
