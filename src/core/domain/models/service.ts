import { ApiResponse } from "@/core/types/api";
import { User } from "./user";
import { Category } from "./category";

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
  rating: string;
  photos: PhotoURL[];
  availabilities: Availability[];
  provider: Provider;
  category: Category;
  unavailableTimeSlots: UnavailableTimeSlot[];
  address: AddressService;
  reviews: Review[];
};

export type ServiceResponse = ApiResponse<Service | null>;

export type PhotoURL = {
  id: string;
  photoUrl: string;
};

export type Availability = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
  slotDuration: number;
  serviceId: string | null;
};

export type Provider = {
  userId: string;
  averageRating: string;
  autoAcceptAppointments: boolean;
  showContactInfo: boolean;
  user: User;
  contacts: Contact[];
};

export type Contact = {
  type: string;
  value: string;
};

export type UnavailableTimeSlot = {
  start: string;
  end: string;
  date: string;
  appointmentId?: string;
  status?: string;
};

export type AddressService = {
  state: {
    id: string;
    name: string;
  };
  city: {
    id: string;
    name: string;
  };
};

export type Review = {
  id: string;
  rating: string;
  comment: string | null;
  createdAt: string;
  client: {
    id: string;
    individual: {
      fullName: string;
    } | null;
    company: {
      corporateName: string;
    } | null;
    photoUrl: string | null;
  };
};

export type ServiceListResponse = {
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  data: Service[];
};

export type CreateServicePayload = {
  providerId: string;
  categoryId: number;
  addressId: string;
  name: string;
  description?: string;
  price: number;
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDuration: number;
  }[];
};

export type CreateServiceResponse = {
  id: string;
};

export type CreateServiceApiResponse = ApiResponse<CreateServiceResponse>;
