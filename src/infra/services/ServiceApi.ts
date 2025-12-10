import { ServiceAdapter } from "@/core/interfaces/adapters/ServiceAdapter";
import {
  ServiceListResponse,
  ServiceQueryParams,
  ServiceResponse,
  CreateServicePayload,
  CreateServiceApiResponse,
} from "@/core/domain/models/service";
import { client } from "@/lib/client";

export class ServiceApi extends ServiceAdapter {
  async findAll(params?: ServiceQueryParams): Promise<ServiceListResponse> {
    try {
      const queryParams = {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 12,
        q: params?.q,
        providerName: params?.providerName,
        category: params?.category,
        minPrice: params?.minPrice,
        maxPrice: params?.maxPrice,
        minRating: params?.minRating,
        stateId: params?.stateId,
        cityId: params?.cityId,
      };

      const cleanParams = Object.fromEntries(
        Object.entries(queryParams).filter(([_, v]) => v != null && v !== "")
      );

      const response = await client.get("/services/", {
        params: cleanParams,
      });

      return {
        data: response.data.data?.data || [],
        total: response.data.data?.total || 0,
        totalPages: response.data.data?.totalPages || 0,
        page: response.data.data?.page || 1,
        pageSize: response.data.data?.pageSize || 12,
      };
    } catch (error) {
      console.error("Erro no findAll:", error);
      return {
        data: [],
        total: 0,
        totalPages: 0,
        page: 1,
        pageSize: params?.pageSize || 12,
      };
    }
  }

  async findById(id: string): Promise<ServiceResponse> {
    try {
      const response = await client.get(`/services/${id}`);

      return {
        success: true,
        message: response.data.message || "Serviço carregado com sucesso",
        data: response.data.data || null,
      };
    } catch (error) {
      return {
        success: false,
        message: "Erro desconhecido ao buscar serviço",
        data: null,
      };
    }
  }

  async create(
    payload: CreateServicePayload
  ): Promise<CreateServiceApiResponse> {
    try {
      const response = await client.post("/services/", payload);

      return {
        success: true,
        message: response.data.message || "Serviço criado com sucesso",
        data: response.data.data || { id: "" },
      };
    } catch (error) {
      return {
        success: false,
        message: "Erro ao criar serviço",
        data: { id: "" },
      };
    }
  }
}
