import { LocationService } from "@/core/services/LocationService";
import { ServiceService } from "@/core/services/ServiceService";
import { ScheduleService } from "@/core/services/ScheduleService";
import { LocationMock } from "@/infra/locations/LocationMock";
import { ServiceMock } from "@/infra/services/ServiceMock";
import { ScheduleMock } from "@/infra/schedule/ScheduleMock";

// Create adapter instances
const locationAdapter = new LocationMock();
const serviceAdapter = new ServiceMock();
const scheduleAdapter = new ScheduleMock();

// Create service instances with dependency injection
const locationService = new LocationService(locationAdapter);
const serviceService = new ServiceService(serviceAdapter);
const scheduleService = new ScheduleService(scheduleAdapter);

// Export services container
export const container = {
  locationService,
  serviceService,
  scheduleService,
};
