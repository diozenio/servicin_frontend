"use client";

import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ServiceReviewForm } from "@/components/review-form";
import { useAppointmentDetails } from "@/hooks/use-appointment";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();

  const appointmentId = params.appointmentId as string;

  const { data: appointment, isLoading } = useAppointmentDetails(appointmentId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!appointment) {
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
        <button
          onClick={() => router.push("/appointments")}
          className="text-primary hover:underline"
        >
          Voltar para meus agendamentos
        </button>
      </div>
    );
  }

  const serviceName = appointment.service?.name || "Serviço contratado";

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 transition-colors"
          >
            <span>←</span> Voltar
          </button>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
          <ServiceReviewForm
            appointmentId={appointmentId}
            serviceName={serviceName}
            onSuccessReview={() => {
              router.push("/appointments");
            }}
          />
        </div>
      </div>
    </div>
  );
}
