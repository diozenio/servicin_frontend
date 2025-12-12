import { ServiceProviderByIdResponseData, UpdateServiceProviderPayload } from "@/core/domain/models/user";
import { ServiceProviderAdapter } from "@/core/interfaces/adapters/ServiceProviderAdpter";
import { ApiResponse } from "@/core/types/api";
import { client } from "@/lib/client";

export class ServiceProviderApi extends ServiceProviderAdapter {
  async getById(id: string): Promise<ApiResponse<ServiceProviderByIdResponseData>> {
    const { data } = await client.get(`/service-providers/${id}`);
    return data;
  }
  async updateSettings(
    id: string,
    payload: UpdateServiceProviderPayload
  ): Promise<ApiResponse<null>> {
    const { data } = await client.patch(
      `/service-providers/${id}`,
      payload
    );
    return data;
  }
}
