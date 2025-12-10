"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  StarIcon,
  DollarSignIcon,
  CalendarIcon,
  InfoIcon,
  LockIcon,
  MapPinIcon,
  TagIcon,
  ClockIcon,
  PhoneIcon,
  MailIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Service, Contact } from "@/core/domain/models/service";
import { ScheduleBooking } from "./schedule-booking";
import { useAuth } from "@/hooks/use-auth";

interface ServiceDetailsProps {
  service: Service;
  onContact?: () => void;
  className?: string;
}

const formatRating = (rating: number | string, count?: number) => {
  const numericRating = parseFloat(rating as string);
  
  if (isNaN(numericRating)) {
      return 'N/A';
  }
    
  const formattedRating = numericRating.toFixed(1).replace(".", ",");
  
  if (count === undefined) return formattedRating;
  
  return `${formattedRating} (${count} avaliações)`;
};

const getDayName = (dayOfWeek: number): string => {
  const days = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  return days[dayOfWeek];
};

const renderContactIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "phone":
      return <PhoneIcon className="w-4 h-4 mr-2" />;
    case "email":
      return <MailIcon className="w-4 h-4 mr-2" />;
    default:
      return <InfoIcon className="w-4 h-4 mr-2" />;
  }
};

interface InfoItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  isPrimaryValue?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({
  icon,
  title,
  value,
  isPrimaryValue = false,
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      {icon}
      <h4 className="font-semibold">{title}</h4>
    </div>
    <p
      className={cn(
        "text-lg font-medium",
        isPrimaryValue ? "text-primary" : "text-card-foreground"
      )}
    >
      {value}
    </p>
  </div>
);

export function ServiceDetails({
  service,
  onContact,
  className,
}: ServiceDetailsProps) {
  const [activeTab, setActiveTab] = useState<"info" | "schedule">("info");
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const { provider, category } = service;
  const providerUser = provider.user;

  const handleHire = () => {
    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(`/services/${service.id}`);
      router.push(`/auth/login?returnUrl=${returnUrl}`);
      return;
    }

    setActiveTab("schedule");

    if (tabsRef.current) {
      const navbarHeight = 88;
      const offset = tabsRef.current.offsetTop - navbarHeight;

      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-card-foreground">
          {service.name}
        </h1>

        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={providerUser.photoUrl || ""}
              alt={providerUser.individual?.fullName}
            />
            <AvatarFallback>
              {providerUser.individual?.fullName?.charAt(0).toUpperCase() ?? "P"}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="text-lg font-medium text-card-foreground">
              {providerUser.individual?.fullName || "Prestador Anônimo"}
            </p>
            <p className="text-sm text-muted-foreground">Prestador de Serviços</p>
          </div>
        </div>
      </div>

      <div ref={tabsRef} className="border-b border-border">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("info")}
            className={cn(
              "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === "info"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <InfoIcon className="w-4 h-4 mr-2 inline" />
            Informações
          </button>

          <button
            onClick={() => {
              if (!isAuthenticated) {
                const returnUrl = encodeURIComponent(`/services/${service.id}`);
                router.push(`/auth/login?returnUrl=${returnUrl}`);
                return;
              }
              setActiveTab("schedule");
            }}
            className={cn(
              "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === "schedule"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <CalendarIcon className="w-4 h-4 mr-2 inline" />
            Agendar
          </button>
        </nav>
      </div>

      {activeTab === "info" && (
        <>
          <div className="flex items-center gap-3">
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => {
                const filled = i < service.rating;
                return (
                  <StarIcon
                    key={i}
                    className={cn(
                      "w-5 h-5",
                      filled ? "text-yellow-400 fill-current" : "text-gray-300"
                    )}
                  />
                );
              })}
            </div>
            <span className="text-lg font-medium">
              {formatRating(service.rating)}
            </span>
          </div>

          {service.description && (
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-card-foreground">
                Sobre o Serviço
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          )}

          <h3 className="text-xl font-semibold text-card-foreground pt-4">
            Detalhes Adicionais
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <InfoItem
              icon={<TagIcon className="w-5 h-5 text-primary" />}
              title="Categoria"
              value={category.name}
            />

            {service.price && (
              <InfoItem
                icon={<DollarSignIcon className="w-5 h-5 text-primary" />}
                title="Valor"
                value={service.price}
                isPrimaryValue
              />
            )}

            {providerUser.address?.city?.name && (
              <InfoItem
                icon={<MapPinIcon className="w-5 h-5 text-primary" />}
                title="Localização"
                value={`${providerUser.address.city.name} - ${providerUser.address.state.name}`}
              />
            )}

            <InfoItem
              icon={<StarIcon className="w-5 h-5 text-yellow-500" />}
              title="Média do Prestador"
              value={formatRating(provider.averageRating)}
            />
          </div>

          {provider.contacts?.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-card-foreground pt-4">
                Contatos
              </h3>
              <div className="flex flex-wrap gap-4">
                {provider.contacts.map((contact: Contact) => (
                  <div
                    key={contact.type}
                    className="flex items-center text-sm font-medium bg-secondary p-3 rounded-lg"
                  >
                    {renderContactIcon(contact.type)}
                    {contact.value}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="pt-4">
            <Button
              className="w-full"
              onClick={handleHire}
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LockIcon className="w-4 h-4 mr-2" />
                  Verificando...
                </>
              ) : isAuthenticated ? (
                "Contratar Serviço"
              ) : (
                <>
                  <LockIcon className="w-4 h-4 mr-2" />
                  Faça login para contratar
                </>
              )}
            </Button>
          </div>
        </>
      )}

      {activeTab === "schedule" && isAuthenticated && (
        <ScheduleBooking service={service} />
      )}
    </div>
  );
}