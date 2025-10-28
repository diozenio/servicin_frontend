import {
  ProviderSchedule,
  TimeSlot,
  DaySchedule,
} from "@/core/domain/models/schedule";
import { faker } from "@faker-js/faker";

const generateTimeSlots = (date: string, isWorkingDay: boolean): TimeSlot[] => {
  if (!isWorkingDay) {
    return [];
  }

  const slots: TimeSlot[] = [];
  const startHour = 8;
  const endHour = 18;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;

      // Randomly mark some slots as booked (20% chance)
      const isBooked = faker.datatype.boolean({ probability: 0.2 });

      slots.push({
        id: `${date}-${timeString}`,
        time: timeString,
        isAvailable: true,
        isBooked,
      });
    }
  }

  return slots;
};

// Generate schedule for the next 30 days
const generateSchedule = (): DaySchedule[] => {
  const schedule: DaySchedule[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dateString = date.toISOString().split("T")[0];
    const dayOfWeek = date.getDay();

    // Working days: Monday to Friday (1-5)
    const isWorkingDay = dayOfWeek >= 1 && dayOfWeek <= 5;

    schedule.push({
      date: dateString,
      timeSlots: generateTimeSlots(dateString, isWorkingDay),
      isAvailable: isWorkingDay,
    });
  }

  return schedule;
};

export const mockProviderSchedules: ProviderSchedule[] = [
  {
    providerId: "1",
    serviceId: "1",
    workingHours: {
      start: "08:00",
      end: "18:00",
    },
    workingDays: [1, 2, 3, 4, 5],
    breakTime: {
      start: "12:00",
      end: "13:00",
    },
    schedule: generateSchedule(),
  },
  {
    providerId: "2",
    serviceId: "2",
    workingHours: {
      start: "09:00",
      end: "17:00",
    },
    workingDays: [1, 2, 3, 4, 5, 6],
    breakTime: {
      start: "12:00",
      end: "13:00",
    },
    schedule: generateSchedule(),
  },
  {
    providerId: "3",
    serviceId: "3",
    workingHours: {
      start: "07:00",
      end: "19:00",
    },
    workingDays: [0, 1, 2, 3, 4, 5, 6],
    breakTime: {
      start: "12:00",
      end: "13:00",
    },
    schedule: generateSchedule(),
  },
];

// Add more mock schedules for other services
for (let i = 4; i <= 60; i++) {
  const workingDays = faker.helpers.arrayElement([
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5, 6],
    [0, 1, 2, 3, 4, 5, 6],
  ]);

  const startHour = faker.number.int({ min: 7, max: 9 });
  const endHour = faker.number.int({ min: 17, max: 20 });

  mockProviderSchedules.push({
    providerId: i.toString(),
    serviceId: i.toString(),
    workingHours: {
      start: `${startHour.toString().padStart(2, "0")}:00`,
      end: `${endHour.toString().padStart(2, "0")}:00`,
    },
    workingDays: Array.from(workingDays),
    breakTime: faker.datatype.boolean({ probability: 0.8 })
      ? {
          start: "12:00",
          end: "13:00",
        }
      : undefined,
    schedule: generateSchedule(),
  });
}
