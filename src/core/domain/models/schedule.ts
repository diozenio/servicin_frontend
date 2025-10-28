export type TimeSlot = {
  id: string;
  time: string;
  isAvailable: boolean;
  isBooked: boolean;
};

export type DaySchedule = {
  date: string;
  timeSlots: TimeSlot[];
  isAvailable: boolean;
};

export type ProviderSchedule = {
  providerId: string;
  serviceId: string;
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: number[];
  breakTime?: {
    start: string;
    end: string;
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
