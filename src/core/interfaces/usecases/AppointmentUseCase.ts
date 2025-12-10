import {
  Appointment,
  CreateAppointmentPayload,
  CreateAppointmentResponse,
  UpdateAppointmentStatusResponse,
  CancelAppointmentResponse,
  CompleteServiceResponse,
  ConfirmPaymentResponse,
} from "@/core/domain/models/appointment";
import { ApiResponse } from "@/core/types/api";

export interface AppointmentUseCase {
  fetchAppointmentsForUser(): Promise<ApiResponse<Appointment[]>>;
  fetchReceivedAppointments(): Promise<ApiResponse<Appointment[]>>;
  fetchAppointmentById(id: string): Promise<ApiResponse<Appointment | null>>;
  createAppointment(
    payload: CreateAppointmentPayload
  ): Promise<ApiResponse<CreateAppointmentResponse>>;
  updateAppointmentStatus(
    appointmentId: string,
    status: Appointment["status"],
    reason?: string
  ): Promise<ApiResponse<UpdateAppointmentStatusResponse>>;
  cancelAppointment(
    appointmentId: string,
    reason: string
  ): Promise<ApiResponse<CancelAppointmentResponse>>;
  completeService(
    appointmentId: string
  ): Promise<ApiResponse<CompleteServiceResponse>>;
  confirmPayment(
    appointmentId: string
  ): Promise<ApiResponse<ConfirmPaymentResponse>>;
}
