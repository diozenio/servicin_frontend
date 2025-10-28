"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPinIcon,
  StarIcon,
  BookmarkIcon,
  DollarSignIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Service } from "@/core/domain/models/service";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaWhatsapp } from "react-icons/fa";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleHireClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    router.push(`/services/${service.id}`);
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="dark:bg-card bg-secondary/15 border border-border rounded-lg p-6 cursor-pointer transition-all duration-450 hover:shadow-lg hover:scale-[1.05] hover:border-primary/50"
      >
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-card-foreground mb-2">
            {service.title}
          </h3>
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={service.logo} alt={service.company} />
              <AvatarFallback>{service.logoFallback}</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground">{service.company}</span>
          </div>
        </div>

        <div className="mb-4">
          <Badge
            className="rounded-full px-3 py-1"
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

        <div className="mb-4">
          <ul className="space-y-1">
            {service.requirements.map((req, index) => (
              <li
                key={index}
                className="text-sm text-muted-foreground flex items-start"
              >
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4 space-y-2">
          {service.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPinIcon className="w-4 h-4 mr-2" />
              {service.location.label}
            </div>
          )}
          {service.price && (
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSignIcon className="w-4 h-4 mr-2" />
              {service.price}
            </div>
          )}
        </div>

        {service.rating && service.reviews && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => {
                const starIndex = i + 1;
                const isFullStar = starIndex <= Math.floor(service.rating);

                return (
                  <StarIcon
                    key={i}
                    className={cn("w-4 h-4 text-yellow-400", {
                      "fill-current": isFullStar,
                    })}
                  />
                );
              })}
            </div>
            <span className="text-sm text-muted-foreground">
              {service.rating} ({service.reviews} avaliações)
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleHireClick}>
            Contratar Serviço
          </Button>
          <Button variant="outline" className="bg-transparent" size="icon">
            <BookmarkIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{service.title}</DialogTitle>
            <DialogDescription asChild>
              <div className="flex items-center gap-3 mt-2">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={service.logo || "/placeholder.svg"}
                    alt={service.company}
                  />
                  <AvatarFallback>{service.logoFallback}</AvatarFallback>
                </Avatar>
                <span className="text-base font-medium text-foreground">
                  {service.company}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <Badge
                className="rounded-full px-3 py-1"
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

            {service.description && (
              <div>
                <h4 className="font-semibold mb-3 text-foreground">
                  Descrição do Serviço
                </h4>
                <div className="text-sm text-muted-foreground flex items-start">
                  {service.description}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-3 text-foreground">
                Requisitos do Serviço
              </h4>
              <ul className="space-y-2">
                {service.requirements.map((req, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              {service.location && (
                <div className="flex items-center text-base text-foreground">
                  <MapPinIcon className="w-5 h-5 mr-3 text-primary" />
                  <span>{service.location.label}</span>
                </div>
              )}
              {service.price && (
                <div className="flex items-center text-base text-foreground">
                  <DollarSignIcon className="w-5 h-5 mr-3 text-primary" />
                  <span className="font-semibold">{service.price}</span>
                </div>
              )}
              {service.whatsappContact && (
                <div className="flex items-center text-base text-foreground">
                  <FaWhatsapp className="w-5 h-5 mr-3 text-primary" />
                  <span className="font-semibold">
                    {service.whatsappContact}
                  </span>
                </div>
              )}
            </div>

            {service.rating && service.reviews && (
              <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
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
                <span className="text-base font-medium text-foreground">
                  {service.rating} ({service.reviews} avaliações)
                </span>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCloseModal}
              className="bg-transparent"
            >
              Fechar
            </Button>
            <Button onClick={handleHireClick}>Contratar Serviço</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
