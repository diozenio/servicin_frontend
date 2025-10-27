"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { TimeSlot } from "@/core/domain/models/schedule";

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  selectedTimeSlot?: string;
  onTimeSlotSelect?: (timeSlot: string) => void;
  className?: string;
}

export function TimeSlotPicker({
  timeSlots,
  selectedTimeSlot,
  onTimeSlotSelect,
  className,
}: TimeSlotPickerProps) {
  const handleTimeSlotClick = (timeSlot: TimeSlot) => {
    if (timeSlot.isAvailable && !timeSlot.isBooked) {
      onTimeSlotSelect?.(timeSlot.time);
    }
  };

  const getTimeSlotVariant = (timeSlot: TimeSlot) => {
    if (timeSlot.isBooked) {
      return "secondary";
    }
    if (selectedTimeSlot === timeSlot.time) {
      return "default";
    }
    if (timeSlot.isAvailable) {
      return "outline";
    }
    return "secondary";
  };

  const getTimeSlotClassName = (timeSlot: TimeSlot) => {
    if (timeSlot.isBooked) {
      return "opacity-50 cursor-not-allowed line-through";
    }
    if (!timeSlot.isAvailable) {
      return "opacity-30 cursor-not-allowed";
    }
    return "cursor-pointer hover:bg-accent";
  };

  if (timeSlots.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-muted-foreground">
          Nenhum horário disponível para esta data.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h4 className="text-lg font-semibold">Horários Disponíveis</h4>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {timeSlots.map((timeSlot) => (
          <Button
            key={timeSlot.id}
            variant={getTimeSlotVariant(timeSlot)}
            size="sm"
            onClick={() => handleTimeSlotClick(timeSlot)}
            disabled={!timeSlot.isAvailable || timeSlot.isBooked}
            className={cn(
              "text-sm font-medium transition-colors",
              getTimeSlotClassName(timeSlot)
            )}
          >
            {timeSlot.time}
          </Button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border border-input bg-background" />
          <span>Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border border-input bg-primary" />
          <span>Selecionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border border-input bg-muted opacity-50" />
          <span>Ocupado</span>
        </div>
      </div>
    </div>
  );
}
