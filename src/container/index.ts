import { LocationService } from "@/core/services/LocationService";
import { ServiceService } from "@/core/services/ServiceService";
import { ScheduleService } from "@/core/services/ScheduleService";
import { ContractService } from "@/core/services/ContractService";
import { AuthService } from "@/core/services/AuthService";
import { LocationLocalStorage } from "@/infra/locations/LocationLocalStorage";
import { ServiceLocalStorage } from "@/infra/services/ServiceLocalStorage";
import { ScheduleLocalStorage } from "@/infra/schedule/ScheduleLocalStorage";
import { ContractLocalStorage } from "@/infra/contract/ContractLocalStorage";
import { AuthLocalStorage } from "@/infra/auth/AuthLocalStorage";

// Create adapter instances
const locationAdapter = new LocationLocalStorage();
const serviceAdapter = new ServiceLocalStorage();
const scheduleAdapter = new ScheduleLocalStorage();
const contractAdapter = new ContractLocalStorage();
const authAdapter = new AuthLocalStorage();

// Create service instances with dependency injection
const locationService = new LocationService(locationAdapter);
const serviceService = new ServiceService(serviceAdapter);
const scheduleService = new ScheduleService(scheduleAdapter);
const contractService = new ContractService(contractAdapter);
const authService = new AuthService(authAdapter);

// Export services container
export const container = {
  locationService,
  serviceService,
  scheduleService,
  contractService,
  authService,
};
