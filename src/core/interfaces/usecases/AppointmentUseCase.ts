import { Appointment } from "@/core/domain/models/appointment";
import { ApiResponse } from "@/core/types/api";

export interface AppointmentUseCase {
  fetchAppointmentsForUser(userId: string): Promise<ApiResponse<Appointment[]>>;
  fetchAppointmentById(id: string): Promise<ApiResponse<Appointment | null>>;
  createAppointment(payload: Partial<Appointment>): Promise<ApiResponse<{ appointment: Appointment }>>;
  updateAppointmentStatus(id: string, status: Appointment['status']): Promise<ApiResponse<{ success: boolean }>>;
  cancelAppointment(id: string, reason?: string): Promise<ApiResponse<{ success: boolean }>>;
}
