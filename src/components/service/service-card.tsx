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

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const router = useRouter();

  const handleHireClick = () => {
    router.push(`/services/${service.id}`);
  };

  return (
    <div className="dark:bg-card bg-secondary/15 border border-border rounded-lg p-6">
      {/* Service Title and Company */}
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

      {/* Service Type Tag */}
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

      {/* Requirements */}
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

      {/* Location and Price */}
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

      {/* Rating */}
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

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button className="flex-1" onClick={handleHireClick}>
          Contratar Serviço
        </Button>
        <Button variant="outline" className="bg-transparent" size="icon">
          <BookmarkIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
