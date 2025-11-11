import { ApiResponse } from "@/core/types/api";
import { Location } from "./location";

export type Service = {
  id: string;
  title: string;
  company: string;
  type: string;
  requirements: string[];
  location: Location;
  price: string;
  rating: number;
  reviews: number;
  logo: string;
  logoFallback: string;
  description?: string;
  duration?: string;
  whatsappContact?: string;
  providerId: string;
};

export type ServiceQueryParams = {
  search?: string;
  location?: string;
  providerId?: string;
  limit?: number;
  offset?: number;
};

export type ServiceListResponse = ApiResponse<Service[]> & {
  total?: number;
};
export type ServiceResponse = ApiResponse<Service | null>;
