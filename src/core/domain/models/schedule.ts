export type TimeSlot = {
  id: string;
  time: string; // Format: "HH:MM"
  isAvailable: boolean;
  isBooked: boolean;
};

export type DaySchedule = {
  date: string; // Format: "YYYY-MM-DD"
  timeSlots: TimeSlot[];
  isAvailable: boolean;
};

export type ProviderSchedule = {
  providerId: string;
  serviceId: string;
  workingHours: {
    start: string; // Format: "HH:MM"
    end: string; // Format: "HH:MM"
  };
  workingDays: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  breakTime?: {
    start: string; // Format: "HH:MM"
    end: string; // Format: "HH:MM"
  };
  schedule: DaySchedule[];
};

export type BookingRequest = {
  serviceId: string;
  providerId: string;
  date: string;
  timeSlot: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
};

export type BookingResponse = {
  success: boolean;
  message: string;
  bookingId?: string;
};
