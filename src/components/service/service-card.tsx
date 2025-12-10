"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { 
  StarIcon, 
  MapPinIcon, 
  PhoneIcon,
  ImageIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export type ServiceData = {
  id: string;
  name: string;
  description: string;
  price: string;
  rating: string;
  photos: { id: string; photoUrl: string }[];
  provider: {
    user: {
      photoUrl: string | null;
      individual?: { fullName: string };
      company?: { corporateName: string };
      contacts: { type: string; value: string }[];
    };
  };
  category: { name: string };
  address: {
    state: { name: string };
    city: { name: string };
  };
  reviews: any[];
};

interface ServiceCardProps {
  service: ServiceData;
}

const formatCurrency = (value: string | number) => {
  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numberValue);
};

export function ServiceCard({ service }: ServiceCardProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const servicePhoto = service.photos && service.photos.length > 0 
    ? service.photos[0].photoUrl 
    : null;
  const providerUser = service.provider?.user;
  const providerName = 
    providerUser?.individual?.fullName || 
    providerUser?.company?.corporateName || 
    "Prestador";
  const providerAvatar = providerUser?.photoUrl || undefined;
  const contact = providerUser?.contacts?.find(c => c.type === "PHONE") || providerUser?.contacts?.[0];
  const contactValue = contact?.value;
  const city = service.address?.city?.name;
  const state = service.address?.state?.name; 

  const locationShort = city && state ? `${city}` : city;
  const locationFull = city && state ? `${city} - ${state}` : city;

  const ratingValue = parseFloat(service.rating);
  const reviewCount = service.reviews?.length || 0;

  const handleHire = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.push(`/services/${service.id}`);
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group cursor-pointer flex flex-col rounded-xl border bg-card shadow-sm hover:shadow-md transition-all overflow-hidden h-full"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {servicePhoto ? (
            <img
              src={servicePhoto}
              alt={service.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col h-full items-center justify-center text-muted-foreground bg-secondary/50">
              <ImageIcon size={32} className="opacity-20 mb-1" />
              <span className="text-xs font-medium">Sem foto</span>
            </div>
          )}

          {service.category?.name && (
            <Badge className="absolute top-2 right-2 bg-background/90 backdrop-blur-md text-xs hover:bg-background text-foreground border-none shadow-sm">
              {service.category.name}
            </Badge>
          )}
        </div>

        <div className="p-4 flex flex-col gap-3 flex-1">
          <div className="flex justify-between items-start gap-3">
            <h3 className="font-semibold leading-tight line-clamp-2 text-foreground text-sm md:text-base">
              {service.name}
            </h3>
            <span className="font-bold text-primary whitespace-nowrap text-sm md:text-base">
              {formatCurrency(service.price)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-auto">
            <StarIcon size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="font-medium text-foreground">{ratingValue.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">
              ({reviewCount} {reviewCount === 1 ? 'avaliação' : 'avaliações'})
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t mt-1 gap-2">

            <div className="flex items-center gap-2 overflow-hidden max-w-[60%]">
              <Avatar className="h-7 w-7 border shrink-0">
                <AvatarImage src={providerAvatar} alt={providerName} />
                <AvatarFallback className="text-[10px]">
                  {providerName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold truncate leading-none" title={providerName}>
                  {providerName}
                </span>
                <span className="text-[10px] text-muted-foreground truncate mt-0.5">
                  Prestador
                </span>
              </div>
            </div>

            {locationShort && (
              <div 
                className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0 bg-secondary px-2 py-1 rounded-full max-w-[40%]"
                title={locationFull}
              >
                <MapPinIcon size={10} />
                <span className="font-medium truncate">{locationShort}</span>
              </div>
            )}
          </div>

          <Button className="w-full mt-1" size="sm" onClick={handleHire}>
            Ver detalhes
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md md:max-w-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{service.name}</DialogTitle>
            {locationFull && (
              <DialogDescription className="flex items-center gap-1 mt-1">
                <MapPinIcon size={14} /> {locationFull}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-5">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted border">
              {servicePhoto ? (
                <img src={servicePhoto} alt={service.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <span className="flex items-center gap-2"><ImageIcon /> Sem imagem disponível</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-semibold">Descrição</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </div>

            <div className="flex items-center justify-between bg-secondary/20 p-4 rounded-lg border">
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase">Valor do serviço</span>
                <p className="text-xl font-bold text-primary">{formatCurrency(service.price)}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 bg-background px-2 py-1 rounded border shadow-sm">
                  <StarIcon size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-sm">{ratingValue.toFixed(1)}</span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">
                  Baseado em {reviewCount} avaliações
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t">
              <h4 className="text-sm font-semibold">Sobre o profissional</h4>
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={providerAvatar} />
                  <AvatarFallback>{providerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium text-sm">{providerName}</p>
                  
                  {contactValue && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
                      <PhoneIcon size={12} />
                      <span>{contactValue}</span>
                    </div>
                  )}
                  
                  <p className="text-[10px] text-muted-foreground mt-1">
                   {service.provider.user.individual ? "Pessoa Física" : "Empresa"}
                  </p>
                </div>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={() => router.push(`/services/${service.id}`)}>
              Contratar agora
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}