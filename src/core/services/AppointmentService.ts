import { AppointmentAdapter } from "@/core/interfaces/adapters/AppointmentAdapter";
import { AppointmentUseCase } from "@/core/interfaces/usecases/AppointmentUseCase";
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

export class AppointmentService implements AppointmentUseCase {
  constructor(private appointmentAdapter: AppointmentAdapter) {}

  async fetchAppointmentsForUser(): Promise<ApiResponse<Appointment[]>> {
    return await this.appointmentAdapter.fetchAppointmentsForUser();
  }

  async fetchReceivedAppointments(): Promise<ApiResponse<Appointment[]>> {
    return await this.appointmentAdapter.fetchReceivedAppointments();
  }

  async fetchAppointmentById(
    id: string
  ): Promise<ApiResponse<Appointment | null>> {
    return await this.appointmentAdapter.fetchAppointmentById(id);
  }

  async createAppointment(
    payload: CreateAppointmentPayload
  ): Promise<ApiResponse<CreateAppointmentResponse>> {
    return await this.appointmentAdapter.createAppointment(payload);
  }

  async updateAppointmentStatus(
    appointmentId: string,
    status: Appointment["status"],
    reason?: string
  ): Promise<ApiResponse<UpdateAppointmentStatusResponse>> {
    return await this.appointmentAdapter.updateAppointmentStatus(
      appointmentId,
      status,
      reason
    );
  }

  async cancelAppointment(
    appointmentId: string,
    reason: string
  ): Promise<ApiResponse<CancelAppointmentResponse>> {
    return await this.appointmentAdapter.cancelAppointment(
      appointmentId,
      reason
    );
  }

  async completeService(
    appointmentId: string
  ): Promise<ApiResponse<CompleteServiceResponse>> {
    return await this.appointmentAdapter.completeService(appointmentId);
  }

  async confirmPayment(
    appointmentId: string
  ): Promise<ApiResponse<ConfirmPaymentResponse>> {
    return await this.appointmentAdapter.confirmPayment(appointmentId);
  }
}
