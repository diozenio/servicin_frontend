export interface ServiceFilters {
  page?: number;
  pageSize?: number;
  q?: string;
  providerName?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  stateId?: string;
  cityId?: string;
}
