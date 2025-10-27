"use client";

import * as React from "react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlotPicker } from "@/components/ui/time-slot-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSchedule, useCreateBooking } from "@/hooks/use-schedule";
import { Service } from "@/core/domain/models/service";
import { DaySchedule, TimeSlot } from "@/core/domain/models/schedule";
import { cn } from "@/lib/utils";
import {
  LoaderIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
} from "lucide-react";

interface ScheduleBookingProps {
  service: Service;
  className?: string;
}

export function ScheduleBooking({ service, className }: ScheduleBookingProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<
    string | undefined
  >();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Use the service ID as provider ID for simplicity in this mock
  const providerId = service.id;
  const serviceId = service.id;

  const { data: schedule, isLoading: isLoadingSchedule } = useSchedule(
    providerId,
    serviceId
  );
  const createBookingMutation = useCreateBooking();

  const availableDates = React.useMemo(() => {
    if (!schedule) return [];
    return schedule.schedule
      .filter((day: DaySchedule) => day.isAvailable)
      .map((day: DaySchedule) => day.date);
  }, [schedule]);

  const selectedDaySchedule = React.useMemo(() => {
    if (!schedule || !selectedDate) return null;
    const dateString = selectedDate.toISOString().split("T")[0];
    return schedule.schedule.find(
      (day: DaySchedule) => day.date === dateString
    );
  }, [schedule, selectedDate]);

  const availableTimeSlots = React.useMemo(() => {
    if (!selectedDaySchedule) return [];
    return selectedDaySchedule.timeSlots.filter(
      (slot: TimeSlot) => slot.isAvailable && !slot.isBooked
    );
  }, [selectedDaySchedule]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(undefined); // Reset time slot when date changes
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTimeSlot || !customerName || !customerPhone) {
      return;
    }

    const booking = {
      serviceId,
      providerId,
      date: selectedDate.toISOString().split("T")[0],
      timeSlot: selectedTimeSlot,
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      notes: notes || undefined,
    };

    try {
      const result = await createBookingMutation.mutateAsync(booking);
      if (result.success) {
        // Reset form
        setSelectedDate(undefined);
        setSelectedTimeSlot(undefined);
        setCustomerName("");
        setCustomerPhone("");
        setCustomerEmail("");
        setNotes("");

        // Show success message (you could use a toast here)
        alert("Agendamento realizado com sucesso!");
      } else {
        alert(`Erro: ${result.message}`);
      }
    } catch (error) {
      alert("Erro ao realizar agendamento. Tente novamente.");
    }
  };

  const isFormValid =
    selectedDate && selectedTimeSlot && customerName && customerPhone;

  if (isLoadingSchedule) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <LoaderIcon className="w-6 h-6 animate-spin" />
            <span>Carregando horários disponíveis...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Não foi possível carregar os horários disponíveis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Agendar Serviço</h3>
        <p className="text-muted-foreground">
          Selecione uma data e horário para agendar o serviço
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar and Time Selection */}
        <div className="space-y-6">
          {/* Calendar */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-semibold">Selecionar Data</h4>
            </div>
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              availableDates={availableDates}
            />
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-primary" />
                <h4 className="text-lg font-semibold">Selecionar Horário</h4>
              </div>
              <TimeSlotPicker
                timeSlots={selectedDaySchedule?.timeSlots || []}
                selectedTimeSlot={selectedTimeSlot}
                onTimeSlotSelect={handleTimeSlotSelect}
              />
            </div>
          )}
        </div>

        {/* Customer Information Form */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-semibold">Informações do Cliente</h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nome Completo *</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone">Telefone *</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerEmail">E-mail (opcional)</Label>
              <Input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alguma informação adicional sobre o serviço..."
                rows={3}
              />
            </div>

            {/* Selected Date and Time Summary */}
            {(selectedDate || selectedTimeSlot) && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h5 className="font-medium">Resumo do Agendamento</h5>
                {selectedDate && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Data:</strong>{" "}
                    {selectedDate.toLocaleDateString("pt-BR")}
                  </p>
                )}
                {selectedTimeSlot && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Horário:</strong> {selectedTimeSlot}
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || createBookingMutation.isPending}
            >
              {createBookingMutation.isPending ? (
                <>
                  <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                  Agendando...
                </>
              ) : (
                "Confirmar Agendamento"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
