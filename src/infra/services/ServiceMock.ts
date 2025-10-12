import { ServiceAdapter } from "@/core/interfaces/adapters/ServiceAdapter";
import {
  ServiceListResponse,
  ServiceQueryParams,
} from "@/core/domain/models/service";
import { search } from "@/lib/search";
import { mockServices } from "./mock-data";

export class ServiceMock extends ServiceAdapter {
  async findAll(params?: ServiceQueryParams): Promise<ServiceListResponse> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const services = mockServices;

      // Apply filters if params are provided
      let filteredServices = services;

      if (params?.search) {
        filteredServices = search(filteredServices, params.search, {
          keys: ["title", "company"],
          caseSensitive: false,
        });
      }

      if (params?.location) {
        filteredServices = filteredServices.filter(
          (service) => service.location.id === params.location
        );
      }

      // Apply limit if provided
      if (params?.limit && params.limit > 0) {
        filteredServices = filteredServices.slice(0, params.limit);
      }

      return {
        data: filteredServices,
        success: true,
        message: "Services fetched successfully",
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch services",
      };
    }
  }
}
