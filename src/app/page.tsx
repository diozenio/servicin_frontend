"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchIcon, MapPinIcon } from "lucide-react";
import { ServiceCard, type Service } from "@/components/service-card";

type Location = {
  value: string;
  label: string;
};

const locations: Location[] = [
  {
    value: "sao-paulo",
    label: "São Paulo, SP",
  },
  {
    value: "rio-de-janeiro",
    label: "Rio de Janeiro, RJ",
  },
  {
    value: "belo-horizonte",
    label: "Belo Horizonte, MG",
  },
  {
    value: "salvador",
    label: "Salvador, BA",
  },
  {
    value: "brasilia",
    label: "Brasília, DF",
  },
  {
    value: "fortaleza",
    label: "Fortaleza, CE",
  },
  {
    value: "manaus",
    label: "Manaus, AM",
  },
  {
    value: "curitiba",
    label: "Curitiba, PR",
  },
];

const services: Service[] = [
  {
    id: "1",
    title: "Encanador Profissional",
    company: "AquaFix Soluções",
    type: "Urgente",
    requirements: [
      "Licença profissional ativa",
      "5+ anos de experiência",
      "Disponibilidade 24h",
    ],
    location: "São Paulo, SP",
    price: "R$ 80 - 150 por hora",
    rating: 4.8,
    reviews: 127,
    logo: "",
    logoFallback: "AF",
  },
  {
    id: "2",
    title: "Eletricista Especializado",
    company: "VoltTech Elétrica",
    type: "Padrão",
    requirements: [
      "CREA ativo",
      "3+ anos de experiência",
      "Conhecimento em automação",
    ],
    location: "Rio de Janeiro, RJ",
    price: "R$ 100 - 200 por serviço",
    rating: 4.9,
    reviews: 89,
    logo: "",
    logoFallback: "VT",
  },
  {
    id: "3",
    title: "Pintor Residencial",
    company: "ColorCasa Pinturas",
    type: "Orçamento",
    requirements: [
      "Experiência em pintura residencial",
      "2+ anos de experiência",
      "Materiais inclusos",
    ],
    location: "Belo Horizonte, MG",
    price: "R$ 15 - 25 por m²",
    rating: 4.7,
    reviews: 156,
    logo: "",
    logoFallback: "CC",
  },
  {
    id: "4",
    title: "Pedreiro Especialista",
    company: "Construtora Forte",
    type: "Urgente",
    requirements: [
      "Experiência em alvenaria",
      "4+ anos de experiência",
      "Trabalho com acabamento",
    ],
    location: "Salvador, BA",
    price: "R$ 120 - 180 por dia",
    rating: 4.6,
    reviews: 203,
    logo: "",
    logoFallback: "CF",
  },
  {
    id: "5",
    title: "Técnico em Ar Condicionado",
    company: "CoolAir Refrigeração",
    type: "Padrão",
    requirements: [
      "Certificação técnica",
      "3+ anos de experiência",
      "Manutenção preventiva",
    ],
    location: "Fortaleza, CE",
    price: "R$ 90 - 140 por visita",
    rating: 4.8,
    reviews: 94,
    logo: "",
    logoFallback: "CA",
  },
  {
    id: "6",
    title: "Marceneiro Artesão",
    company: "Madeira Nobre",
    type: "Orçamento",
    requirements: [
      "Especialização em móveis sob medida",
      "6+ anos de experiência",
      "Trabalho com madeiras nobres",
    ],
    location: "Curitiba, PR",
    price: "R$ 200 - 400 por m²",
    rating: 4.9,
    reviews: 67,
    logo: "",
    logoFallback: "MN",
  },
];

export default function Home() {
  const [locationOpen, setLocationOpen] = React.useState(false);
  const [selectedLocation, setSelectedLocation] =
    React.useState<Location | null>(null);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-[60vh] px-4 pt-32 md:pt-40">
        <div className="max-w-5xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">
            Conecte-se com os melhores profissionais urbanos da sua região
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl mb-12 leading-relaxed">
            Receba orçamentos gratuitos em poucos minutos.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
              {/* Search Bar Container */}
              <div className="flex border rounded-lg overflow-hidden w-full">
                {/* Location Field */}
                <div className="w-full sm:w-48 flex items-center justify-center px-3 h-14 border-r">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                    <PopoverTrigger asChild>
                      <button className="flex-1 text-left focus:outline-none h-full">
                        {selectedLocation
                          ? selectedLocation.label
                          : "Localização"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" side="bottom" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar cidade..." />
                        <CommandList>
                          <CommandEmpty>
                            Nenhuma cidade encontrada.
                          </CommandEmpty>
                          <CommandGroup>
                            {locations.map((location) => (
                              <CommandItem
                                key={location.value}
                                value={location.value}
                                onSelect={(value) => {
                                  setSelectedLocation(
                                    locations.find(
                                      (loc) => loc.value === value
                                    ) || null
                                  );
                                  setLocationOpen(false);
                                }}
                              >
                                {location.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Services Field */}
                <div className="w-full flex items-center justify-center px-3 h-14">
                  <SearchIcon className="w-4 h-4 mr-2" />
                  <Input
                    placeholder="Que tipo de serviço você precisa?"
                    className="border-0 focus-visible:ring-0 p-0 bg-transparent dark:bg-transparent"
                  />
                </div>
              </div>

              {/* Search Button */}
              <Button className="rounded-lg px-8 whitespace-nowrap h-14 w-full sm:w-auto">
                Buscar
              </Button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="text-sm">
            <span className="mr-2">Populares:</span>
            <a href="#" className="underline mr-2">
              Encanador,
            </a>
            <a href="#" className="underline mr-2">
              Eletricista,
            </a>
            <a href="#" className="underline mr-2">
              Pintor,
            </a>
            <a href="#" className="underline">
              Pedreiro
            </a>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">
            Serviços Disponíveis
          </h2>
          <p className="text-lg text-muted-foreground">
            Encontre os melhores profissionais para suas necessidades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </main>
  );
}
