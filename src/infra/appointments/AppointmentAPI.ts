import { Appointment } from "@/core/domain/models/appointment";
import { AppointmentAdapter } from "@/core/interfaces/adapters/AppointmentAdapter";
import { ApiResponse } from "@/core/types/api";
import { client } from "@/lib/client";

export class AppointmentAPI implements AppointmentAdapter {
  
  async fetchAppointmentsForUser(userId: string): Promise<ApiResponse<Appointment[]>> {
    const response = await client.get("/appointments/my-appointments");
    return {
      success: true,
      data: response.data.appointments,
    };
  }

  async fetchAppointmentById(id: string): Promise<ApiResponse<Appointment | null>> {

    if (!id) {
      return { success: false, data: null};
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
        data: null
      };
    } catch (error) {
      return {
        success: false,
        data: null
      };
    }
  }

  async createAppointment(payload: any): Promise<any> { return {} as any }
  async updateAppointmentStatus(id: string, status: any): Promise<any> { return {} as any }
  async cancelAppointment(id: string): Promise<any> { return {} as any }
}