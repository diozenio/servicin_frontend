import { ServiceAdapter } from "@/core/interfaces/adapters/ServiceAdapter";
import {
  ServiceListResponse,
  ServiceQueryParams,
  ServiceResponse,
} from "@/core/domain/models/service";
import { client } from "@/lib/client";

export class ServiceApi extends ServiceAdapter {
  async findAll(params?: ServiceQueryParams): Promise<ServiceListResponse> {
    try {
      const queryParams = {
        page: params?.page ?? 0,       
        pageSize: params?.pageSize ?? 10, 
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

      const response = await client.get<ServiceListResponse>(`http://localhost:8080/services/`, {
        params: cleanParams,
      });

      return {
        data: response.data.data || [],
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0,
        page: response.data.page || 0,
        pageSize: response.data.pageSize,
      };

    } catch (error) {
      console.error("Erro no findAll:", error);
      return {
        data: [],
        total: 0,
        totalPages: 0,
        page: 0,
        pageSize: params?.pageSize || 10,
      };
    }
  }

  async findById(id: string): Promise<ServiceResponse> {
    try {
      const response = await client.get(`http://localhost:8080/services/${id}`);

      return {
        success: true,
        message: "Serviço carregado com sucesso",
        data: response.data.data || response.data,
      };

    } catch (error) {
      return {
        success: false,
        message: "Erro desconhecido ao buscar serviço",
        data: null,
      };
    }
  }
}