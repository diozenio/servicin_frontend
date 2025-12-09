import { AppointmentAdapter } from "@/core/interfaces/adapters/AppointmentAdapter";
import { AppointmentUseCase } from "@/core/interfaces/usecases/AppointmentUseCase";
import { Appointment } from "@/core/domain/models/appointment";
import { ApiResponse } from "@/core/types/api";

export class AppointmentService implements AppointmentUseCase {
  constructor(private appointmentAdapter: AppointmentAdapter) {}

  async fetchAppointmentsForUser(
    userId: string
  ): Promise<ApiResponse<Appointment[]>> {
    return await this.appointmentAdapter.fetchAppointmentsForUser(userId);
  }

  async fetchAppointmentById(
    id: string
  ): Promise<ApiResponse<Appointment | null>> {
    return await this.appointmentAdapter.fetchAppointmentById(id);
  }

  async createAppointment(
    payload: Partial<Appointment>
  ): Promise<ApiResponse<{ appointment: Appointment }>> {
    return await this.appointmentAdapter.createAppointment(payload);
  }

  async updateAppointmentStatus(
    id: string,
    status: Appointment['status']
  ): Promise<ApiResponse<{ success: boolean }>> {
    return await this.appointmentAdapter.updateAppointmentStatus(id, status);
  }

  async cancelAppointment(
    id: string,
    reason?: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return await this.appointmentAdapter.cancelAppointment(id, reason);
  }
}