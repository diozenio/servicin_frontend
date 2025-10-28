"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPinIcon,
  StarIcon,
  ClockIcon,
  DollarSignIcon,
  MessageCircleIcon,
  PhoneIcon,
  CheckCircleIcon,
  CalendarIcon,
  InfoIcon,
  LockIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Service } from "@/core/domain/models/service";
import { ScheduleBooking } from "./schedule-booking";
import { useAuth } from "@/hooks/use-auth";

interface ServiceDetailsProps {
  service: Service;
  onContact?: () => void;
  className?: string;
}

export function ServiceDetails({
  service,
  onContact,
  className,
}: ServiceDetailsProps) {
  const [activeTab, setActiveTab] = useState<"info" | "schedule">("info");
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const handleHire = () => {
    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(`/services/${service.id}`);
      router.push(`/auth/login?returnUrl=${returnUrl}`);
      return;
    }

    setActiveTab("schedule");
    if (tabsRef.current) {
      const navbarHeight = 88;
      const elementPosition = tabsRef.current.offsetTop;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleWhatsAppContact = () => {
    if (service.whatsappContact) {
      const message = `Olá! Gostaria de contratar o serviço: ${service.title}`;
      const whatsappUrl = `https://wa.me/${service.whatsappContact.replace(
        /\D/g,
        ""
      )}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  const handleContact = () => {
    if (service.whatsappContact) {
      handleWhatsAppContact();
    } else if (onContact) {
      onContact();
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Section */}
      <div className="space-y-4">
        {/* Service Title and Company */}
        <div>
          <h1 className="text-3xl font-bold text-card-foreground mb-2">
            {service.title}
          </h1>
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={service.logo} alt={service.company} />
              <AvatarFallback className="text-lg">
                {service.logoFallback}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-medium text-card-foreground">
                {service.company}
              </p>
              <p className="text-sm text-muted-foreground">
                Prestador de serviços
              </p>
            </div>
          </div>
        </div>

        {/* Service Type Badge */}
        <div>
          <Badge
            className="rounded-full px-4 py-2 text-sm"
            variant={
              service.type === "Urgente"
                ? "destructive"
                : service.type === "Padrão"
                ? "default"
                : "secondary"
            }
          >
            {service.type}
          </Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div ref={tabsRef} className="border-b border-border">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("info")}
            className={cn(
              "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === "info"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
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
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
            )}
          >
            <CalendarIcon className="w-4 h-4 mr-2 inline" />
            Agendar
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <>
          {/* Rating Section */}
          {service.rating && service.reviews && (
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => {
                  const starIndex = i + 1;
                  const isFullStar = starIndex <= Math.floor(service.rating);

                  return (
                    <StarIcon
                      key={i}
                      className={cn("w-5 h-5 text-yellow-400", {
                        "fill-current": isFullStar,
                      })}
                    />
                  );
                })}
              </div>
              <span className="text-lg font-medium text-card-foreground">
                {service.rating}
              </span>
              <span className="text-muted-foreground">
                ({service.reviews} avaliações)
              </span>
            </div>
          )}

          {/* Description */}
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

          {/* Service Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            {service.price && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSignIcon className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-card-foreground">Valor</h4>
                </div>
                <p className="text-lg font-medium text-primary">
                  {service.price}
                </p>
              </div>
            )}

            {/* Duration */}
            {service.duration && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-card-foreground">
                    Duração
                  </h4>
                </div>
                <p className="text-lg font-medium text-card-foreground">
                  {service.duration}
                </p>
              </div>
            )}

            {/* Location */}
            {service.location && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-card-foreground">
                    Localização
                  </h4>
                </div>
                <p className="text-lg font-medium text-card-foreground">
                  {service.location.label}
                </p>
              </div>
            )}
          </div>

          {/* Requirements */}
          {service.requirements && service.requirements.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-card-foreground">
                Requisitos
              </h3>
              <ul className="space-y-2">
                {service.requirements.map((req, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              className="flex-1"
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

            {service.whatsappContact ? (
              <Button
                variant="outline"
                onClick={handleContact}
                className="flex-1 sm:flex-none"
                size="lg"
              >
                <MessageCircleIcon className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={onContact}
                className="flex-1 sm:flex-none"
                size="lg"
              >
                <PhoneIcon className="w-5 h-5 mr-2" />
                Contatar
              </Button>
            )}
          </div>

          {/* Contact Information */}
          {service.whatsappContact && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircleIcon className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-card-foreground">
                  Contato WhatsApp
                </h4>
              </div>
              <p className="text-muted-foreground">
                Entre em contato diretamente via WhatsApp para mais informações
                ou para agendar o serviço.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {service.whatsappContact}
              </p>
            </div>
          )}
        </>
      )}

      {activeTab === "schedule" && isAuthenticated && (
        <ScheduleBooking service={service} />
      )}
    </div>
  );
}
