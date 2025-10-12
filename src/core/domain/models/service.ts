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
};

export type ServiceQueryParams = {
  search?: string;
  location?: string;
};

export type ServiceListResponse = ApiResponse<Service[]>;
export type ServiceResponse = ApiResponse<Service>;
