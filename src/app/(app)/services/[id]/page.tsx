"use client";

import { use } from "react";
import { useService } from "@/hooks/use-service";
import { ServiceDetails } from "@/components/service/service-details";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { service, isLoading, error } = useService(id);

  const handleContact = () => {
    // TODO: Implement contact logic for services without WhatsApp
    // Contacting service: service?.id
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <LoaderIcon className="w-6 h-6 animate-spin" />
              <span>Carregando detalhes do serviço...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-card-foreground">
              Serviço não encontrado
            </h1>
            <p className="text-muted-foreground">
              O serviço que você está procurando não foi encontrado ou pode ter
              sido removido.
            </p>
            <div className="flex gap-2 justify-center">
              <Button asChild variant="outline">
                <Link href="/">
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Voltar ao início
                </Link>
              </Button>
              <Button asChild>
                <Link href="/search">Buscar serviços</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Voltar
          </Button>
        </div>

        {/* Service Details */}
        <ServiceDetails service={service} onContact={handleContact} />
      </div>
    </div>
  );
}
