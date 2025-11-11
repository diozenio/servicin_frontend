import { ServiceAdapter } from "@/core/interfaces/adapters/ServiceAdapter";
import {
  ServiceListResponse,
  ServiceQueryParams,
  ServiceResponse,
} from "@/core/domain/models/service";
import { search } from "@/lib/search";
import { mockServices } from "./mock-data";

export class ServiceMock extends ServiceAdapter {
  async findAll(params?: ServiceQueryParams): Promise<ServiceListResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const services = mockServices;

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

      if (params?.providerId) {
        filteredServices = filteredServices.filter(
          (service) => service.providerId === params.providerId
        );
      }

      const total = filteredServices.length;

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

  async findById(id: string): Promise<ServiceResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const service = mockServices.find((s) => s.id === id);

      if (!service) {
        return {
          data: null,
          success: false,
          message: "Service not found",
        };
      }

      return {
        data: service,
        success: true,
        message: "Service fetched successfully",
      };
    } catch (error) {
      return {
        data: null,
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch service",
      };
    }
  }
}
