import {
  Availability,
  Service,
  UnavailableTimeSlot,
} from "@/core/domain/models/service";
import {
  DaySchedule,
  ProviderSchedule,
  TimeSlot,
} from "@/core/domain/models/schedule";

type DateWindow = {
  start: Date;
  end: Date;
};

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function isWithinWindow(time: number, window?: DateWindow | null): boolean {
  if (!window) return false;
  return (
    time >= toMinutes(window.start.toISOString().slice(11, 16)) &&
    time < toMinutes(window.end.toISOString().slice(11, 16))
  );
}

function buildBreakWindow(
  date: Date,
  breakStart?: string | null,
  breakEnd?: string | null
): DateWindow | null {
  if (!breakStart || !breakEnd) return null;
  const start = new Date(date);
  const end = new Date(date);
  const [bsH, bsM] = breakStart.split(":").map(Number);
  const [beH, beM] = breakEnd.split(":").map(Number);
  start.setHours(bsH, bsM, 0, 0);
  end.setHours(beH, beM, 0, 0);
  return { start, end };
}

function buildUnavailableLookup(unavailables: UnavailableTimeSlot[]) {
  const map = new Map<string, Array<{ start: number; end: number }>>();

  unavailables.forEach((slot) => {
    const key = slot.date;
    const startMinutes = toMinutes(slot.start.slice(11, 16));
    const endMinutes = toMinutes(slot.end.slice(11, 16));
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push({ start: startMinutes, end: endMinutes });
  });

  return map;
}

function isUnavailable(
  dateKey: string,
  timeMinutes: number,
  unavailableMap: Map<string, Array<{ start: number; end: number }>>
): boolean {
  const ranges = unavailableMap.get(dateKey);
  if (!ranges) return false;
  return ranges.some(
    (range) => timeMinutes >= range.start && timeMinutes < range.end
  );
}

export function buildScheduleFromService(
  service: Service,
  daysAhead = 14
): ProviderSchedule {
  const today = new Date();
  const unavailableMap = buildUnavailableLookup(
    service.unavailableTimeSlots || []
  );

  const schedule: DaySchedule[] = [];

  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split("T")[0];
    const weekday = date.getDay(); // 0 sunday

    const dayAvailabilities = (service.availabilities || []).filter(
      (av: Availability) => av.dayOfWeek === weekday
    );

    let daySlots: TimeSlot[] = [];

    dayAvailabilities.forEach((av) => {
      const startMinutes = toMinutes(av.startTime);
      const endMinutes = toMinutes(av.endTime);
      const breakWindow = buildBreakWindow(
        date,
        av.breakStart ?? null,
        av.breakEnd ?? null
      );

      for (
        let cursor = startMinutes;
        cursor + av.slotDuration <= endMinutes;
        cursor += av.slotDuration
      ) {
        const timeLabel = minutesToTime(cursor);
        const timeMinutes = cursor;
        const isBreak =
          breakWindow &&
          timeMinutes >= toMinutes(av.breakStart ?? "00:00") &&
          timeMinutes < toMinutes(av.breakEnd ?? "00:00");
        const unavailable = isUnavailable(
          dateString,
          timeMinutes,
          unavailableMap
        );

        const slot: TimeSlot = {
          id: `${dateString}-${timeLabel}`,
          time: timeLabel,
          isAvailable: !isBreak && !unavailable,
          isBooked: unavailable,
        };

        daySlots.push(slot);
      }
    });

    const isAvailable = daySlots.some((s) => s.isAvailable);

    schedule.push({
      date: dateString,
      timeSlots: daySlots,
      isAvailable,
    });
  }

  return {
    providerId: service.provider.userId,
    serviceId: service.id,
    workingHours: {
      start: "00:00",
      end: "23:59",
    },
    workingDays: [0, 1, 2, 3, 4, 5, 6],
    schedule,
  };
}
