import { LocationService } from "@/core/services/LocationService";
import { ServiceService } from "@/core/services/ServiceService";
import { LocationMock } from "@/infra/locations/LocationMock";
import { ServiceMock } from "@/infra/services/ServiceMock";

// Create adapter instances
const locationAdapter = new LocationMock();
const serviceAdapter = new ServiceMock();

// Create service instances with dependency injection
const locationService = new LocationService(locationAdapter);
const serviceService = new ServiceService(serviceAdapter);

// Export services container
export const services = {
  locationService,
  serviceService,
};
