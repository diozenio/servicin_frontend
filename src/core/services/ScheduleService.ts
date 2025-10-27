import { ScheduleAdapter } from "@/core/interfaces/adapters/ScheduleAdapter";
import { ScheduleUseCase } from "@/core/interfaces/usecases/ScheduleUseCase";
import {
  ProviderSchedule,
  BookingRequest,
  BookingResponse,
} from "@/core/domain/models/schedule";

export class ScheduleService implements ScheduleUseCase {
  constructor(private scheduleAdapter: ScheduleAdapter) {}

  async getProviderSchedule(
    providerId: string,
    serviceId: string
  ): Promise<ProviderSchedule | null> {
    return this.scheduleAdapter.getProviderSchedule(providerId, serviceId);
  }

  async createBooking(booking: BookingRequest): Promise<BookingResponse> {
    return this.scheduleAdapter.createBooking(booking);
  }

  async checkAvailability(
    providerId: string,
    serviceId: string,
    date: string,
    timeSlot: string
  ): Promise<boolean> {
    return this.scheduleAdapter.checkAvailability(
      providerId,
      serviceId,
      date,
      timeSlot
    );
  }

  async releaseTimeSlot(
    providerId: string,
    serviceId: string,
    date: string,
    timeSlot: string
  ): Promise<boolean> {
    return this.scheduleAdapter.releaseTimeSlot(
      providerId,
      serviceId,
      date,
      timeSlot
    );
  }
}
