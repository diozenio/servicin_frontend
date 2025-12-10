"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  UserIcon,
  StoreIcon,
  PhoneIcon,
  MailIcon,
} from "lucide-react";
import { AppointmentStatus } from "@/components/service/appointment-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppointmentDetails } from "@/hooks/use-appointment";
import { useAuth } from "@/hooks/use-auth";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR");
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ContactItem({ value }: { value: string }) {
  const isEmail = value.includes("@");
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {isEmail ? (
        <MailIcon className="w-4 h-4" />
      ) : (
        <PhoneIcon className="w-4 h-4" />
      )}
      <span>{value}</span>
    </div>
  );
}

export default function AppointmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.appointmentId as string;
  const { user } = useAuth();

  const {
    data: appointment,
    isLoading,
    error,
  } = useAppointmentDetails(appointmentId);

  const isProvider = user?.role === "PROVIDER";

  const providerName = useMemo(() => {
    const provider = appointment?.service.provider;
    if (!provider) return "Provedor";
    return (
      provider.user.individual?.fullName ||
      provider.user.company?.corporateName ||
      "Provedor"
    );
  }, [appointment]);

  const clientName = useMemo(() => {
    const client = appointment?.client;
    if (!client) return "Cliente";
    return (
      client.individual?.fullName || client.company?.corporateName || "Cliente"
    );
  }, [appointment]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            Agendamento não encontrado
          </h1>
          <p className="text-muted-foreground">
            O agendamento {appointmentId} não existe ou você não tem acesso.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/appointments")}>
          Voltar para agendamentos
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/appointments")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Detalhes do agendamento</h1>
            <p className="text-muted-foreground">#{appointment.id}</p>
          </div>
        </div>

        <AppointmentStatus appointment={appointment} />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <section className="bg-card text-card-foreground rounded-xl border p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Serviço</p>
                  <h2 className="text-xl font-semibold">
                    {appointment.service.name}
                  </h2>
                  {appointment.service.category && (
                    <Badge variant="outline" className="mt-2">
                      {appointment.service.category.name}
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    R$ {appointment.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>

              {appointment.description && (
                <div className="text-sm text-muted-foreground">
                  {appointment.description}
                </div>
              )}

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Início</p>
                  <p className="font-medium">
                    {formatDate(appointment.scheduledStartTime)} às{" "}
                    {formatTime(appointment.scheduledStartTime)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Término previsto
                  </p>
                  <p className="font-medium">
                    {formatDate(appointment.scheduledEndTime)} às{" "}
                    {formatTime(appointment.scheduledEndTime)}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Criado em</p>
                  <p className="font-medium">
                    {formatDate(appointment.createdAt)} às{" "}
                    {formatTime(appointment.createdAt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Última atualização
                  </p>
                  <p className="font-medium">
                    {formatDate(appointment.updatedAt)} às{" "}
                    {formatTime(appointment.updatedAt)}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-card text-card-foreground rounded-xl border p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pagamento</p>
                  <h3 className="text-lg font-semibold">
                    {appointment.paymentMethod}
                  </h3>
                </div>
                <Badge variant="outline">{appointment.paymentStatus}</Badge>
              </div>

              {appointment.cancellationReason && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  Motivo do cancelamento: {appointment.cancellationReason}
                </div>
              )}
            </section>
          </div>

          <div className="space-y-4">
            <section className="bg-card text-card-foreground rounded-xl border p-5 space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Pedido feito por
                </p>
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{clientName}</span>
                </div>
                {appointment.client?.contacts?.[0] && (
                  <ContactItem value={appointment.client.contacts[0].value} />
                )}
              </div>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Pedido recebido por
                </p>
                <div className="flex items-center gap-2">
                  <StoreIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{providerName}</span>
                </div>
                {appointment.service.provider?.user.contacts?.[0] && (
                  <ContactItem
                    value={appointment.service.provider.user.contacts[0].value}
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant={isProvider ? "default" : "outline"}>
                  {isProvider ? "Sou provedor" : "Sou cliente"}
                </Badge>
                <Badge variant="outline">{appointment.status}</Badge>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
