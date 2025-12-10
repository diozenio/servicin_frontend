export type AppointmentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELED"
  | "COMPLETED";

export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "PIX" | "CASH";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type ContactType = "EMAIL" | "PHONE" | "WHATSAPP";

export type Contact = {
  type: ContactType;
  value: string;
};

export type IndividualInfo = {
  fullName: string;
};

export type CompanyInfo = {
  tradeName?: string | null;
  corporateName: string;
};

export type UserInfo = {
  photoUrl?: string | null;
  individual?: IndividualInfo;
  company?: CompanyInfo;
  contacts: Contact[];
};

export type Provider = {
  userId: string;
  averageRating: number;
  user: UserInfo;
};

export type ServicePhoto = {
  id: string;
  photoUrl: string;
};

export type Category = {
  id: number;
  name: string;
};

export type Client = {
  id: string;
  individual?: IndividualInfo;
  company?: CompanyInfo;
  contacts: Contact[];
};

export type Service = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  rating: number;
  photos: ServicePhoto[];
  provider?: Provider;
  category: Category;
};

export type Appointment = {
  id: string;
  description: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  status: AppointmentStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  price: number;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
  service: Service;
  client?: Client;
};

export type AppointmentsResponse = {
  appointments: Appointment[];
};

export type CreateAppointmentPayload = {
  description: string;
  paymentMethod: PaymentMethod;
  scheduledEndTime: string;
  scheduledStartTime: string;
  serviceId: string;
};

export type CreateAppointmentResponse = {
  message: string;
  appointmentId: string;
  status: string;
};

export type UpdateAppointmentStatusPayload = {
  reason?: string;
  status: AppointmentStatus;
};

export type UpdateAppointmentStatusResponse = {
  id: string;
  status: AppointmentStatus;
};

export type CancelAppointmentPayload = {
  reason: string;
};

export type CancelAppointmentResponse = {
  id: string;
  status: AppointmentStatus;
};

export type CompleteServiceResponse = {
  id: string;
  status: AppointmentStatus;
};

export type ConfirmPaymentResponse = {
  id: string;
  status: AppointmentStatus;
};
