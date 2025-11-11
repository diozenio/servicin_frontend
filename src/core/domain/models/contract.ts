export type PaymentMethod = "pix" | "credit_card" | "debit_card" | "cash";

export type ServiceStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type Contract = {
  id: string;
  serviceId: string;
  providerId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  timeSlot: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  serviceStatus: ServiceStatus;
  approvalStatus: ApprovalStatus;
  totalAmount: number;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ContractRequest = {
  serviceId: string;
  providerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  timeSlot: string;
  notes?: string;
  paymentMethod: PaymentMethod;
};

export type ContractResponse = {
  success: boolean;
  message: string;
  contractId?: string;
  contract?: Contract;
};

export type PaymentDetails = {
  method: PaymentMethod;
  pixQrCode?: string;
  pixKey?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardName?: string;
};
