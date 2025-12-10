export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

export type NotificationType = "appointment" | "review" | "success" | "alert" | string;
