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

      // Store total before pagination
      const total = filteredServices.length;

      // Apply pagination if provided
      const offset = params?.offset || 0;
      const limit = params?.limit || filteredServices.length;

      if (limit > 0) {
        filteredServices = filteredServices.slice(offset, offset + limit);
      }

      return {
        data: filteredServices,
        success: true,
        message: "Services fetched successfully",
        total,
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
