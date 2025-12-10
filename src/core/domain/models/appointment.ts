export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

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

export type Service = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  rating: number;
  photos: ServicePhoto[];
  provider: Provider;
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
};

export type AppointmentsResponse = {
  appointments: Appointment[];
};