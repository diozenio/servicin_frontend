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
    const response = await client.get("/appointments/my-appointments");
    return {
      success: true,
      data: response.data.appointments,
    };
  }

  async fetchReceivedAppointments(): Promise<ApiResponse<Appointment[]>> {
    const response = await client.get("/appointments/received");
    return {
      success: true,
      data: response.data.appointments,
    };
  }

  async fetchAppointmentById(
    id: string
  ): Promise<ApiResponse<Appointment | null>> {
    if (!id) {
      return { success: false, data: null };
    }

    try {
      const clientResponse = await client.get("/appointments/my-appointments");
      const foundInClient = clientResponse.data.appointments?.find(
        (a: Appointment) => a.id === id
      );

      if (foundInClient) {
        return { success: true, data: foundInClient };
      }

      const providerResponse = await client.get("/appointments/received");

      const foundInProvider = providerResponse.data.appointments?.find(
        (a: Appointment) => a.id === id
      );

      if (foundInProvider) {
        return { success: true, data: foundInProvider };
      }

      return {
        success: false,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
      };
    }
  }

  async createAppointment(
    payload: CreateAppointmentPayload
  ): Promise<ApiResponse<CreateAppointmentResponse>> {
    const response = await client.post("/appointments/", payload);
    return {
      success: true,
      data: response.data,
    };
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
    const response = await client.patch(
      `/appointments/${appointmentId}/status`,
      payload
    );
    return {
      success: true,
      data: response.data,
    };
  }

  async cancelAppointment(
    appointmentId: string,
    reason: string
  ): Promise<ApiResponse<CancelAppointmentResponse>> {
    const payload: CancelAppointmentPayload = { reason };
    const response = await client.patch(
      `/appointments/${appointmentId}/cancel`,
      payload
    );
    return {
      success: true,
      data: response.data,
    };
  }

  async completeService(
    appointmentId: string
  ): Promise<ApiResponse<CompleteServiceResponse>> {
    const response = await client.patch(
      `/appointments/${appointmentId}/complete-service`
    );
    return {
      success: true,
      data: response.data,
    };
  }

  async confirmPayment(
    appointmentId: string
  ): Promise<ApiResponse<ConfirmPaymentResponse>> {
    const response = await client.patch(
      `/appointments/${appointmentId}/confirm-payment`
    );
    return {
      success: true,
      data: response.data,
    };
  }
}
