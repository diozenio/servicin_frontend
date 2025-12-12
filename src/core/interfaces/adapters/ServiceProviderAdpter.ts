import { ServiceProviderByIdResponseData, UpdateServiceProviderPayload } from "@/core/domain/models/user";
import { ApiResponse } from "@/core/types/api";

export abstract class ServiceProviderAdapter {
  abstract getById(id: string): Promise<ApiResponse<ServiceProviderByIdResponseData>>;
  abstract updateSettings(id:String, payload: UpdateServiceProviderPayload):Promise<ApiResponse<null>>
}
