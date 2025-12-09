import { ApiResponse } from "@/core/types/api";

export type State = {
  id: string;
  name: string;
};

export type City = {
  id: string;
  name: string;
};

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
export type StateListResponse = ApiResponse<State[]>;
export type CityListResponse = ApiResponse<City[]>;
