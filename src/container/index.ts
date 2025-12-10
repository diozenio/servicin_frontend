import { LocationService } from "@/core/services/LocationService";
import { ServiceService } from "@/core/services/ServiceService";
import { ScheduleService } from "@/core/services/ScheduleService";
import { ContractService } from "@/core/services/ContractService";
import { AuthService } from "@/core/services/AuthService";
import { ReviewService } from "@/core/services/ReviewService";
import { LocationAPI } from "@/infra/locations/LocationAPI";
import { ScheduleLocalStorage } from "@/infra/schedule/ScheduleLocalStorage";
import { ContractLocalStorage } from "@/infra/contract/ContractLocalStorage";
import { AuthAPI } from "@/infra/auth/AuthAPI";
import { ReviewAPI } from "@/infra/Review/ReviewAPI";
import { AppointmentAPI } from "@/infra/appointments/AppointmentAPI";
import { AppointmentService } from "@/core/services/AppointmentService";
import { NotificationAPI } from "@/infra/notifications/NotificationAPI";
import { NotificationService } from "@/core/services/NotificationService";
import { ServiceApi } from "@/infra/services/ServiceApi";

const locationAdapter = new LocationAPI();
const serviceAdapter = new ServiceApi();
const scheduleAdapter = new ScheduleLocalStorage();
const contractAdapter = new ContractLocalStorage();
const authAdapter = new AuthAPI();
const reviewAdapter = new ReviewAPI();
const appointmentAdapter = new AppointmentAPI();
const notificationAdapter = new NotificationAPI();

const locationService = new LocationService(locationAdapter);
const serviceService = new ServiceService(serviceAdapter);
const scheduleService = new ScheduleService(scheduleAdapter);
const contractService = new ContractService(contractAdapter);
const authService = new AuthService(authAdapter);
const reviewService = new ReviewService(reviewAdapter);
const appointmentService = new AppointmentService(appointmentAdapter);
const notificationService = new NotificationService(notificationAdapter);

export const container = {
  locationService,
  serviceService,
  scheduleService,
  contractService,
  authService,
  reviewService,
  appointmentService,
  notificationService,
};
