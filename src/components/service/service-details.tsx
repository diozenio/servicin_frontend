"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

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
  ImageIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Service, Contact, Review } from "@/core/domain/models/service";
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
    return "N/A";
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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const { provider, category, photos, reviews } = service;
  const providerUser = provider.user;
  const servicePhotos = photos || [];
  const serviceReviews = reviews || [];

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

  const nextPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev + 1) % servicePhotos.length);
  };

  const prevPhoto = () => {
    setSelectedPhotoIndex(
      (prev) => (prev - 1 + servicePhotos.length) % servicePhotos.length
    );
  };

  return (
    <div className={cn("space-y-6 max-w-5xl mx-auto px-4", className)}>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-card-foreground leading-tight">
            {service.name}
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={providerUser.photoUrl || ""}
              alt={providerUser.individual?.fullName}
            />
            <AvatarFallback>
              {providerUser.individual?.fullName?.charAt(0).toUpperCase() ??
                "P"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-[220px]">
            <p className="text-lg font-medium text-card-foreground">
              {providerUser.individual?.fullName || "Prestador Anônimo"}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium">
                  {formatRating(provider.averageRating)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                Prestador de Serviços
              </span>
            </div>
          </div>
        </div>
      </div>

      {servicePhotos.length > 0 && (
        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <img
              src={servicePhotos[selectedPhotoIndex].photoUrl}
              alt={`${service.name} - Foto ${selectedPhotoIndex + 1}`}
              className="h-full w-full object-cover"
            />
            {servicePhotos.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={prevPhoto}
                  aria-label="Foto anterior"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={nextPhoto}
                  aria-label="Próxima foto"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {servicePhotos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhotoIndex(index)}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        index === selectedPhotoIndex
                          ? "w-8 bg-primary"
                          : "w-2 bg-background/60 hover:bg-background/80"
                      )}
                      aria-label={`Ir para foto ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {servicePhotos.length > 1 && (
            <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
              {servicePhotos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className={cn(
                    "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all",
                    index === selectedPhotoIndex
                      ? "border-primary"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={photo.photoUrl}
                    alt={`Miniatura ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => {
                    const ratingNum = parseFloat(service.rating) || 0;
                    const filled = i < Math.floor(ratingNum);
                    const halfFilled =
                      i === Math.floor(ratingNum) && ratingNum % 1 >= 0.5;
                    return (
                      <StarIcon
                        key={i}
                        className={cn(
                          "w-6 h-6",
                          filled
                            ? "text-yellow-400 fill-current"
                            : halfFilled
                            ? "text-yellow-400 fill-current opacity-50"
                            : "text-gray-300"
                        )}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold leading-none">
                    {formatRating(service.rating)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {serviceReviews.length}{" "}
                    {serviceReviews.length === 1 ? "avaliação" : "avaliações"}
                  </span>
                </div>
              </div>
            </div>

            {service.description && (
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-card-foreground">
                  Sobre o Serviço
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
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

            {serviceReviews.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-card-foreground">
                  Avaliações ({serviceReviews.length})
                </h3>
                <div className="space-y-4">
                  {serviceReviews.map((review: Review) => {
                    const ratingNum = parseFloat(review.rating) || 0;
                    const clientName =
                      review.client.individual?.fullName ||
                      review.client.company?.corporateName ||
                      "Cliente";
                    return (
                      <div
                        key={review.id}
                        className="bg-muted/50 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-3 min-w-[220px]">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={review.client.photoUrl || undefined}
                                alt={clientName}
                              />
                              <AvatarFallback>
                                {clientName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{clientName}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString(
                                  "pt-BR",
                                  {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <StarIcon
                                key={i}
                                className={cn(
                                  "w-4 h-4",
                                  i < ratingNum
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
          </div>
        </>
      )}

      {activeTab === "schedule" && isAuthenticated && (
        <ScheduleBooking service={service} />
      )}
    </div>
  );
}
