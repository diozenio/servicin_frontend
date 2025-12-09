"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  availableDates?: string[];
  className?: string;
  allowPastDates?: boolean;
}

export function Calendar({
  selectedDate,
  onDateSelect,
  availableDates = [],
  className,
  allowPastDates = false,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = new Date(year, month - 1, 0);
  const prevMonthDays = Array.from(
    { length: startingDayOfWeek },
    (_, i) => prevMonth.getDate() - startingDayOfWeek + i + 1
  );

  const nextMonthDays = Array.from(
    { length: 42 - (startingDayOfWeek + daysInMonth) },
    (_, i) => i + 1
  );

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const isDateAvailable = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return availableDates.includes(dateString);
  };

  const isDateSelected = (date: Date) => {
    return (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;

    const date = new Date(year, month, day);
    const canSelect = allowPastDates
      ? availableDates.length === 0 || isDateAvailable(date)
      : isDateAvailable(date) && !isPastDate(date);
    
    if (canSelect) {
      onDateSelect?.(date);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1));
  };

  return (
    <div className={cn("w-full max-w-sm mx-auto", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <h3 className="text-lg font-semibold">
          {monthNames[month]} {year}
        </h3>

        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {prevMonthDays.map((day) => (
          <div
            key={`prev-${day}`}
            className="h-10 w-10 flex items-center justify-center text-sm text-muted-foreground/50"
          >
            {day}
          </div>
        ))}

        {days.map((day) => {
          const date = new Date(year, month, day);
          const available = isDateAvailable(date);
          const selected = isDateSelected(date);
          const today = isToday(date);
          const past = isPastDate(date);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day, true)}
              disabled={!allowPastDates && (!available || past)}
              className={cn(
                "h-10 w-10 flex items-center justify-center text-sm rounded-md transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent",
                {
                  "bg-primary text-primary-foreground hover:bg-primary/90":
                    selected,
                  "bg-accent text-accent-foreground": today && !selected,
                  "text-muted-foreground": !allowPastDates && (!available || past),
                  "cursor-pointer": allowPastDates || (available && !past),
                  "cursor-not-allowed": !allowPastDates && (!available || past),
                }
              )}
            >
              {day}
            </button>
          );
        })}

        {nextMonthDays.map((day) => (
          <div
            key={`next-${day}`}
            className="h-10 w-10 flex items-center justify-center text-sm text-muted-foreground/50"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
