"use client";

import * as React from "react";
import { useState } from "react";
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
import { useSchedule } from "@/hooks/use-schedule";
import { useCreateContract, useConfirmPayment } from "@/hooks/use-contract";
import { useAuth } from "@/hooks/use-auth";
import { Service } from "@/core/domain/models/service";
import { DaySchedule } from "@/core/domain/models/schedule";
import { PaymentMethod } from "@/core/domain/models/contract";
import { cn } from "@/lib/utils";
import { LoaderIcon, CalendarIcon, ClockIcon, UserIcon } from "lucide-react";

interface ScheduleBookingProps {
  service: Service;
  className?: string;
}

export function ScheduleBooking({ service, className }: ScheduleBookingProps) {
  const { user, isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<
    string | undefined
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
  const [contractId, setContractId] = useState<string | null>(null);

  React.useEffect(() => {
    if (user && isAuthenticated) {
      setCustomerName(user.name);
      setCustomerEmail(user.email);
      if (user.phone) {
        setCustomerPhone(user.phone);
      }
    }
  }, [user, isAuthenticated]);

  const providerId = service.id;
  const serviceId = service.id;

  const { data: schedule, isLoading: isLoadingSchedule } = useSchedule(
    providerId,
    serviceId
  );
  const createContractMutation = useCreateContract();
  const confirmPaymentMutation = useConfirmPayment();

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
    setSelectedTimeSlot(timeSlot);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTimeSlot || !customerName || !customerPhone) {
      return;
    }

    setCurrentStep("payment");
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const handleCreateContract = async () => {
    if (
      !selectedDate ||
      !selectedTimeSlot ||
      !customerName ||
      !customerPhone ||
      !selectedPaymentMethod ||
      !isAuthenticated
    ) {
      return;
    }

    const contract = {
      serviceId,
      providerId,
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      date: selectedDate.toISOString().split("T")[0],
      timeSlot: selectedTimeSlot,
      notes: notes || undefined,
      paymentMethod: selectedPaymentMethod,
    };

    try {
      const result = await createContractMutation.mutateAsync(contract);
      if (result.success && result.contractId) {
        setContractId(result.contractId);
        setCurrentStep("confirmation");
      } else {
      }
    } catch {}
  };

  const handlePaymentConfirmed = async () => {
    if (!contractId) return;

    try {
      await confirmPaymentMutation.mutateAsync(contractId);
      setSelectedDate(undefined);
      setSelectedTimeSlot(undefined);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setNotes("");
      setSelectedPaymentMethod(null);
      setCurrentStep("schedule");
      setContractId(null);
    } catch {}
  };

  const isFormValid =
    selectedDate &&
    selectedTimeSlot &&
    customerName &&
    customerPhone &&
    isAuthenticated;

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

  if (currentStep === "payment") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">Contratar Serviço</h3>
          <p className="text-muted-foreground">
            Escolha a forma de pagamento para finalizar a contratação
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h5 className="font-medium">Resumo do Serviço</h5>
          <p className="text-sm text-muted-foreground">
            <strong>Serviço:</strong> {service.title}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Cliente:</strong> {customerName}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Data:</strong> {selectedDate?.toLocaleDateString("pt-BR")}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Horário:</strong> {selectedTimeSlot}
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
            onClick={handleCreateContract}
            disabled={
              !selectedPaymentMethod || createContractMutation.isPending
            }
            className="w-full"
            size="lg"
          >
            {createContractMutation.isPending ? (
              <>
                <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                Criando Contrato...
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
    const amount = parseFloat(
      service.price.replace("R$ ", "").replace(",", ".")
    );

    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">Finalizar Pagamento</h3>
          <p className="text-muted-foreground">
            Complete o pagamento para confirmar a contratação
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h5 className="font-medium">Resumo do Contrato</h5>
          <p className="text-sm text-muted-foreground">
            <strong>Serviço:</strong> {service.title}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Cliente:</strong> {customerName}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Data:</strong> {selectedDate?.toLocaleDateString("pt-BR")}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Horário:</strong> {selectedTimeSlot}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Forma de Pagamento:</strong>{" "}
            {selectedPaymentMethod === "pix"
              ? "PIX"
              : selectedPaymentMethod === "credit_card"
              ? "Cartão de Crédito"
              : selectedPaymentMethod === "debit_card"
              ? "Cartão de Débito"
              : "Dinheiro"}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Valor:</strong> {service.price}
          </p>
        </div>

        {selectedPaymentMethod === "pix" && (
          <PixPayment
            amount={amount}
            onPaymentConfirmed={handlePaymentConfirmed}
          />
        )}

        {selectedPaymentMethod === "credit_card" && (
          <CardPayment
            amount={amount}
            onPaymentConfirmed={handlePaymentConfirmed}
          />
        )}

        {selectedPaymentMethod === "debit_card" && (
          <CardPayment
            amount={amount}
            onPaymentConfirmed={handlePaymentConfirmed}
          />
        )}

        {selectedPaymentMethod === "cash" && (
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
                selectedTimeSlot={selectedTimeSlot}
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
                disabled={!!user?.name}
                autoComplete="name"
              />
              {user?.name && (
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
                disabled={!!user?.phone}
                autoComplete="tel"
              />
              {user?.phone && (
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
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alguma informação adicional sobre o serviço..."
                rows={3}
              />
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
                    <strong>Horário:</strong> {selectedTimeSlot}
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
