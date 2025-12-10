"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppointmentList } from "@/components/service/appointment-list";
import { Appointment } from "@/core/domain/models/appointment";
import {
  useAppointments,
  useReceivedAppointments,
} from "@/hooks/use-appointment";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoaderIcon } from "lucide-react";

export default function AppointmentsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const {
    data: myAppointments = [],
    isLoading: isMyAppointmentsLoading,
    error: myAppointmentsError,
  } = useAppointments();

  const {
    data: receivedAppointments = [],
    isLoading: isReceivedAppointmentsLoading,
    error: receivedAppointmentsError,
  } = useReceivedAppointments();

  const [tab, setTab] = useState("mine");

  const isLoading =
    isAuthLoading || isMyAppointmentsLoading || isReceivedAppointmentsLoading;
  const error = myAppointmentsError || receivedAppointmentsError;

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      const returnUrl = encodeURIComponent("/appointments");
      router.push(`/auth/login?returnUrl=${returnUrl}`);
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const handleViewAppointment = (appointment: Appointment) => {
    router.push(`/appointments/${appointment.id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoaderIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Carregando agendamentos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-card-foreground mb-4">
            Erro ao carregar agendamentos
          </h1>
          <p className="text-muted-foreground mb-4">
            Não foi possível carregar seus agendamentos. Tente novamente.
          </p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Meus Agendamentos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus agendamentos de serviços
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="mine">Agendados por mim</TabsTrigger>
            <TabsTrigger value="received">Agendamentos recebidos</TabsTrigger>
          </TabsList>

          <TabsContent value="mine" className="space-y-4">
            <AppointmentList
              appointments={myAppointments}
              onViewAppointment={handleViewAppointment}
            />
          </TabsContent>

          <TabsContent value="received" className="space-y-4">
            <AppointmentList
              appointments={receivedAppointments}
              onViewAppointment={handleViewAppointment}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
