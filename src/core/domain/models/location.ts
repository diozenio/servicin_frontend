import { ApiResponse } from "@/core/types/api";

export type Location = {
  value: string;
  label: string;
};

export type LocationQueryParams = {
  search?: string;
};

export type LocationListResponse = ApiResponse<Location[]>;
