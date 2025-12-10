"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlotPicker } from "@/components/ui/time-slot-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PaymentMethodSelector } from "@/components/service/payment-method-selector";
import { PixPayment } from "@/components/service/pix-payment";
import { CardPayment } from "@/components/service/card-payment";
import { CashPayment } from "@/components/service/cash-payment";
import {
  useCreateAppointment,
  useConfirmPayment,
} from "@/hooks/use-appointment";
import { useAuth } from "@/hooks/use-auth";
import { Service } from "@/core/domain/models/service";
import { DaySchedule, TimeSlot } from "@/core/domain/models/schedule";
import {
  PaymentMethod,
  CreateAppointmentPayload,
} from "@/core/domain/models/appointment";
import { cn } from "@/lib/utils";
import { LoaderIcon, CalendarIcon, ClockIcon, UserIcon } from "lucide-react";
import { getUserContactPhone, getUserDisplayName } from "@/utils/user";
import { buildScheduleFromService } from "@/utils/schedule";
import { Toaster, toast } from "sonner";

interface ScheduleBookingProps {
  service: Service;
  className?: string;
}

export function ScheduleBooking({ service, className }: ScheduleBookingProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<
    TimeSlot | undefined
  >();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [currentStep, setCurrentStep] = useState<
    "schedule" | "payment" | "confirmation"
  >("schedule");
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  const userName = getUserDisplayName(user!);
  const userContactPhone = getUserContactPhone(user!);

  React.useEffect(() => {
    if (user && isAuthenticated) {
      setCustomerName(userName);
      setCustomerEmail(user.email);
      if (user.contacts) {
        setCustomerPhone(userContactPhone || "(00) 00000-0000");
      }
    }
  }, [user, isAuthenticated]);

  const schedule = React.useMemo(
    () => buildScheduleFromService(service),
    [service]
  );
  const createAppointmentMutation = useCreateAppointment();
  const confirmPaymentMutation = useConfirmPayment();

  const notifyError = (message: string) =>
    toast.error(message, { position: "top-right" });

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

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(undefined);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    const slot = selectedDaySchedule?.timeSlots.find(
      (s: TimeSlot) => s.time === timeSlot
    );
    setSelectedTimeSlot(slot);
  };

  const getSlotDuration = (): number => {
    if (!selectedDate || !selectedDaySchedule) return 60;

    const weekday = selectedDate.getDay();
    const availability = service.availabilities?.find(
      (av) => av.dayOfWeek === weekday
    );

    return availability?.slotDuration || 60;
  };

  const convertToISO = (
    date: Date,
    time: string
  ): { start: string; end: string } => {
    const [hours, minutes] = time.split(":").map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes, 0, 0);

    const durationMinutes = getSlotDuration();
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + durationMinutes);

    return {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    };
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedDate ||
      !selectedTimeSlot ||
      !customerName ||
      !customerPhone ||
      !notes ||
      notes.trim().length < 20
    ) {
      notifyError(
        "Preencha todos os campos obrigatórios (mín. 20 caracteres nas observações)."
      );
      return;
    }

    setCurrentStep("payment");
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const handleCreateAppointment = async () => {
    if (
      !selectedDate ||
      !selectedTimeSlot ||
      !selectedPaymentMethod ||
      !isAuthenticated ||
      !notes ||
      notes.trim().length < 20
    ) {
      notifyError(
        "Preencha todos os campos e selecione pagamento para continuar."
      );
      return;
    }

    if (!selectedTimeSlot.isAvailable || selectedTimeSlot.isBooked) {
      notifyError("Horário indisponível. Escolha outro.");
      return;
    }

    const { start, end } = convertToISO(selectedDate, selectedTimeSlot.time);

    const appointmentPayload: CreateAppointmentPayload = {
      serviceId: service.id,
      description:
        notes.trim() || `Agendamento para ${customerName || "Cliente"}`,
      paymentMethod: selectedPaymentMethod,
      scheduledStartTime: start,
      scheduledEndTime: end,
    };

    try {
      const result = await createAppointmentMutation.mutateAsync(
        appointmentPayload
      );
      const appointmentId = result.data?.appointmentId;

      if (appointmentId) {
        setAppointmentId(appointmentId);
        setCurrentStep("confirmation");
      } else {
        notifyError(
          result?.message ||
            "Agendamento criado, mas o ID não retornou. Verifique sua lista de agendamentos."
        );
      }
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      const apiMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        "Erro ao criar agendamento. Tente novamente.";
      notifyError(apiMessage);
    }
  };

  const handlePaymentConfirmed = async () => {
    if (!appointmentId) return;

    try {
      const result = await confirmPaymentMutation.mutateAsync(appointmentId);
      if (result?.success) {
        router.push("/appointments");
      } else {
        notifyError(
          result?.message ||
            "Não foi possível confirmar o pagamento. Tente novamente."
        );
      }
    } catch (error) {
      console.error("Erro ao confirmar pagamento:", error);
      const apiMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        "Erro ao confirmar pagamento. Tente novamente.";
      notifyError(apiMessage);
    }
  };

  const isFormValid =
    selectedDate &&
    selectedTimeSlot &&
    customerName &&
    customerPhone &&
    notes &&
    notes.trim().length >= 20 &&
    isAuthenticated;

  const getPaymentMethodLabel = (method: PaymentMethod | null) => {
    if (!method) return "";
    const labels: Record<PaymentMethod, string> = {
      PIX: "PIX",
      CREDIT_CARD: "Cartão de Crédito",
      DEBIT_CARD: "Cartão de Débito",
      CASH: "Dinheiro",
    };
    return labels[method];
  };

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

  if (currentStep === "payment") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">Agendar Serviço</h3>
          <p className="text-muted-foreground">
            Escolha a forma de pagamento para finalizar o agendamento
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h5 className="font-medium">Resumo do Serviço</h5>
          <p className="text-sm text-muted-foreground">
            <strong>Serviço:</strong> {service.name}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Cliente:</strong> {customerName}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Data:</strong> {selectedDate?.toLocaleDateString("pt-BR")}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Horário:</strong> {selectedTimeSlot?.time}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Valor:</strong> {service.price}
          </p>
        </div>

        <PaymentMethodSelector
          selectedMethod={selectedPaymentMethod}
          onMethodSelect={handlePaymentMethodSelect}
        />

        <div className="space-y-4">
          <Button
            onClick={handleCreateAppointment}
            disabled={
              !selectedPaymentMethod ||
              createAppointmentMutation.isPending ||
              !selectedDate ||
              !selectedTimeSlot ||
              !selectedTimeSlot.isAvailable ||
              selectedTimeSlot.isBooked
            }
            className="w-full"
            size="lg"
          >
            {createAppointmentMutation.isPending ? (
              <>
                <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                Criando Agendamento...
              </>
            ) : (
              "Continuar para Pagamento"
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setCurrentStep("schedule")}
            className="w-full"
          >
            Voltar para Agendamento
          </Button>
        </div>
      </div>
    );
  }

  if (currentStep === "confirmation") {
    const priceString = service.price
      .replace("R$ ", "")
      .replace(",", ".")
      .trim();
    const amount = parseFloat(priceString) || 0;

    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">Finalizar Pagamento</h3>
          <p className="text-muted-foreground">
            Complete o pagamento para confirmar a contratação
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h5 className="font-medium">Resumo do Agendamento</h5>
          <p className="text-sm text-muted-foreground">
            <strong>Serviço:</strong> {service.name}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Cliente:</strong> {customerName}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Data:</strong> {selectedDate?.toLocaleDateString("pt-BR")}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Horário:</strong> {selectedTimeSlot?.time}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Forma de Pagamento:</strong>{" "}
            {getPaymentMethodLabel(selectedPaymentMethod)}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Valor:</strong> {service.price}
          </p>
        </div>

        {selectedPaymentMethod === "PIX" && (
          <PixPayment
            amount={amount}
            onPaymentConfirmed={handlePaymentConfirmed}
          />
        )}

        {selectedPaymentMethod === "CREDIT_CARD" && (
          <CardPayment
            amount={amount}
            onPaymentConfirmed={handlePaymentConfirmed}
          />
        )}

        {selectedPaymentMethod === "DEBIT_CARD" && (
          <CardPayment
            amount={amount}
            onPaymentConfirmed={handlePaymentConfirmed}
          />
        )}

        {selectedPaymentMethod === "CASH" && (
          <CashPayment
            amount={amount}
            onPaymentConfirmed={handlePaymentConfirmed}
          />
        )}

        <Button
          variant="outline"
          onClick={() => setCurrentStep("payment")}
          className="w-full"
        >
          Voltar para Seleção de Pagamento
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Toaster richColors closeButton />
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Agendar Serviço</h3>
        <p className="text-muted-foreground">
          Selecione uma data e horário para agendar o serviço
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
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

          {selectedDate && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-primary" />
                <h4 className="text-lg font-semibold">Selecionar Horário</h4>
              </div>
              <TimeSlotPicker
                timeSlots={selectedDaySchedule?.timeSlots || []}
                selectedTimeSlot={selectedTimeSlot?.time}
                onTimeSlotSelect={handleTimeSlotSelect}
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-semibold">Informações do Cliente</h4>
          </div>

          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nome Completo *</Label>
              <Input
                id="customerName"
                name="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Digite seu nome completo"
                required
                disabled={!!userName}
                autoComplete="name"
              />
              {userName && (
                <p className="text-xs text-muted-foreground">
                  Preenchido automaticamente com os dados do seu perfil
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone">Telefone *</Label>
              <Input
                id="customerPhone"
                name="customerPhone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                required
                disabled={!!userContactPhone}
                autoComplete="tel"
              />
              {userContactPhone && (
                <p className="text-xs text-muted-foreground">
                  Preenchido automaticamente com os dados do seu perfil
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerEmail">E-mail (opcional)</Label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={!!user?.email}
                autoComplete="email"
              />
              {user?.email && (
                <p className="text-xs text-muted-foreground">
                  Preenchido automaticamente com os dados do seu perfil
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações *</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alguma informação adicional sobre o serviço..."
                rows={3}
                minLength={20}
                required
              />
              <p className="text-xs text-muted-foreground">
                Mínimo de 20 caracteres.
              </p>
            </div>

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
                    <strong>Horário:</strong> {selectedTimeSlot.time}
                  </p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={!isFormValid}>
              Continuar para Contratação
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
