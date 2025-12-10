import { LocationService } from "@/core/services/LocationService";
import { ServiceService } from "@/core/services/ServiceService";
import { AuthService } from "@/core/services/AuthService";
import { ReviewService } from "@/core/services/ReviewService";
import { LocationAPI } from "@/infra/locations/LocationAPI";

import { AuthAPI } from "@/infra/auth/AuthAPI";
import { ReviewAPI } from "@/infra/Review/ReviewAPI";
import { AppointmentAPI } from "@/infra/appointments/AppointmentAPI";
import { AppointmentService } from "@/core/services/AppointmentService";
import { NotificationAPI } from "@/infra/notifications/NotificationAPI";
import { NotificationService } from "@/core/services/NotificationService";
import { ServiceApi } from "@/infra/services/ServiceApi";
import { CategoryAPI } from "@/infra/categories/CategoryAPI";
import { CategoryService } from "@/core/services/CategoryService";
import { ScheduleService } from "@/core/services/ScheduleService";

const locationAdapter = new LocationAPI();
const serviceAdapter = new ServiceApi();

const authAdapter = new AuthAPI();
const reviewAdapter = new ReviewAPI();
const appointmentAdapter = new AppointmentAPI();
const notificationAdapter = new NotificationAPI();
const categoryAdapter = new CategoryAPI();

const locationService = new LocationService(locationAdapter);
const serviceService = new ServiceService(serviceAdapter);

const authService = new AuthService(authAdapter);
const reviewService = new ReviewService(reviewAdapter);
const appointmentService = new AppointmentService(appointmentAdapter);
const notificationService = new NotificationService(notificationAdapter);
const categoryService = new CategoryService(categoryAdapter);
const scheduleService = new ScheduleService({
  getProviderSchedule: async () => null,
  createBooking: async () => ({ success: false, message: "not implemented" }),
  checkAvailability: async () => false,
  releaseTimeSlot: async () => false,
});

export const container = {
  locationService,
  serviceService,
  authService,
  reviewService,
  appointmentService,
  notificationService,
  categoryService,
  scheduleService,
};
