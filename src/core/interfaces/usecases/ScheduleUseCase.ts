import {
  ProviderSchedule,
  BookingRequest,
  BookingResponse,
} from "@/core/domain/models/schedule";

export interface ScheduleUseCase {
  getProviderSchedule(
    providerId: string,
    serviceId: string
  ): Promise<ProviderSchedule | null>;
  createBooking(booking: BookingRequest): Promise<BookingResponse>;
  checkAvailability(
    providerId: string,
    serviceId: string,
    date: string,
    timeSlot: string
  ): Promise<boolean>;
}
