import { ScheduleAdapter } from "@/core/interfaces/adapters/ScheduleAdapter";
import {
  ProviderSchedule,
  BookingRequest,
  BookingResponse,
} from "@/core/domain/models/schedule";
import { mockProviderSchedules } from "./mock-data";

export class ScheduleMock implements ScheduleAdapter {
  async getProviderSchedule(
    providerId: string,
    serviceId: string
  ): Promise<ProviderSchedule | null> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const schedule = mockProviderSchedules.find(
        (s) => s.providerId === providerId && s.serviceId === serviceId
      );

      if (!schedule) {
        return null;
      }

      return schedule;
    } catch (error) {
      console.error("Error fetching provider schedule:", error);
      return null;
    }
  }

  async createBooking(booking: BookingRequest): Promise<BookingResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Simulate booking creation
      const bookingId = `booking_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // In a real implementation, this would update the schedule
      // For now, we'll just return success

      return {
        success: true,
        message: "Agendamento realizado com sucesso!",
        bookingId,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Erro ao criar agendamento",
      };
    }
  }

  async checkAvailability(
    providerId: string,
    serviceId: string,
    date: string,
    timeSlot: string
  ): Promise<boolean> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const schedule = mockProviderSchedules.find(
        (s) => s.providerId === providerId && s.serviceId === serviceId
      );

      if (!schedule) {
        return false;
      }

      const daySchedule = schedule.schedule.find((d) => d.date === date);
      if (!daySchedule || !daySchedule.isAvailable) {
        return false;
      }

      const slot = daySchedule.timeSlots.find((s) => s.time === timeSlot);
      return slot ? slot.isAvailable && !slot.isBooked : false;
    } catch (error) {
      console.error("Error checking availability:", error);
      return false;
    }
  }
}
