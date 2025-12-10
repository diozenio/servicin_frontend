import {
  Appointment,
  CreateAppointmentPayload,
  CreateAppointmentResponse,
  UpdateAppointmentStatusPayload,
  UpdateAppointmentStatusResponse,
  CancelAppointmentPayload,
  CancelAppointmentResponse,
  CompleteServiceResponse,
  ConfirmPaymentResponse,
} from "@/core/domain/models/appointment";
import { AppointmentAdapter } from "@/core/interfaces/adapters/AppointmentAdapter";
import { ApiResponse } from "@/core/types/api";
import { client } from "@/lib/client";

export class AppointmentAPI implements AppointmentAdapter {
  async fetchAppointmentsForUser(): Promise<ApiResponse<Appointment[]>> {
    const { data } = await client.get("/appointments/my-appointments");
    return data;
  }

  async fetchReceivedAppointments(): Promise<ApiResponse<Appointment[]>> {
    const { data } = await client.get("/appointments/received");
    return data;
  }

  async fetchAppointmentById(
    id: string
  ): Promise<ApiResponse<Appointment | null>> {
    if (!id) {
      return { success: false, data: null };
    }

    const { data } = await client.get(`/appointments/${id}`);
    return data;
  }

  async createAppointment(
    payload: CreateAppointmentPayload
  ): Promise<ApiResponse<CreateAppointmentResponse>> {
    const { data } = await client.post("/appointments/", payload);
    return data;
  }

  async updateAppointmentStatus(
    appointmentId: string,
    status: Appointment["status"],
    reason?: string
  ): Promise<ApiResponse<UpdateAppointmentStatusResponse>> {
    const payload: UpdateAppointmentStatusPayload = { status };
    if (reason) {
      payload.reason = reason;
    }
    const { data } = await client.patch(
      `/appointments/${appointmentId}/status`,
      payload
    );
    return data;
  }

  async cancelAppointment(
    appointmentId: string,
    reason: string
  ): Promise<ApiResponse<CancelAppointmentResponse>> {
    const payload: CancelAppointmentPayload = { reason };
    const { data } = await client.patch(
      `/appointments/${appointmentId}/cancel`,
      payload
    );
    return data;
  }

  async completeService(
    appointmentId: string
  ): Promise<ApiResponse<CompleteServiceResponse>> {
    const { data } = await client.patch(
      `/appointments/${appointmentId}/complete-service`
    );
    return data;
  }

  async confirmPayment(
    appointmentId: string
  ): Promise<ApiResponse<ConfirmPaymentResponse>> {
    const { data } = await client.patch(
      `/appointments/${appointmentId}/confirm-payment`
    );
    return data;
  }
}
