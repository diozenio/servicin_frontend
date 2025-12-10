import { ApiResponse } from "@/core/types/api";
import { Address, User } from "./user";
import { City, State } from "./location";

export type ServiceQueryParams = {
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
};

export type Service = {
  id: string;
  name: string;
  description?: string;
  price: string;
  rating: number;
  photos: PhotoURL[];
  avaliabilites: Avaliabilites[];
  provider: Provider;
  category: Category;
  unavaliableTimeSlots: UnavaliableTimeSlots[];
  adress: AdressService;
  reviews: Reviews[];
};

export type ServiceResponse = ApiResponse<Service | null>;

export type PhotoURL = {
  id: string;
  photoUrl: string;
};

export type Avaliabilites = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  breakStart: null;
  breakEnd: null;
  slotDuration: number;
  serviceId: null;
};

export type Provider = {
  userId: string;
  averageRating: string;
  user: User;
  contacts: Contact[];
};

export type Contact = {
  type: string;
  value: string;
};

export type Category = {
  id: number;
  name: string;
  description: string;
};

export type UnavaliableTimeSlots = {
  start: string;
  end: string;
  date: string;
};

export type AdressService = {
  state: {
    id: string;
    name: string;
  };
  city: {
    id: string;
    name: string;
  };
};

export type Reviews = {
  id: string;
  rating: string;
  comment: string | null;
  createdAt: string;
  client: {
    id: string;
    individual: {
      fullname: string;
    } | null;
    company: {
      corporateName: string;
    } | null;
    photoUrl: null;
  };
};

export type ServiceListResponse = {
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  data: Service[];
};
