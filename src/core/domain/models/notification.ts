import { ApiResponse } from "@/core/types/api";

export type NotificationType = "string"; 

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

export type NotificationResponse = {
  notifications: Notification[];
};

export type NotificationListResponse = NotificationResponse;

export type NotificationRequest = {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  appointmentId?: string | null;
  reviewId?: string | null;
  serviceId?: string | null;
};
