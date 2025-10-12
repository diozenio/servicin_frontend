import { ApiResponse } from "@/core/types/api";

export type Location = {
  id: string;
  value: string;
  label: string;
};

export type LocationQueryParams = {
  search?: string;
  limit?: number;
};

export type LocationListResponse = ApiResponse<Location[]>;
