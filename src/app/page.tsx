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

export default function Home() {
  const [locationOpen, setLocationOpen] = React.useState(false);
  const [selectedLocation, setSelectedLocation] =
    React.useState<Location | null>(null);

  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
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
          <div className="flex justify-center gap-4 w-full">
            {/* Search Bar Container */}
            <div className="flex border rounded-lg overflow-hidden w-full">
              {/* Location Field - Reduced width */}
              <div className="w-48 flex items-center justify-center px-3 h-14 border-r">
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
                        <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
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

              {/* Services Field - Full width */}
              <div className="w-full flex items-center justify-center px-3 h-14">
                <SearchIcon className="w-4 h-4 mr-2" />
                <Input
                  placeholder="Que tipo de serviço você precisa?"
                  className="border-0 focus-visible:ring-0 p-0 bg-transparent dark:bg-transparent"
                />
              </div>
            </div>

            {/* Search Button - Same height as input */}
            <Button className="rounded-lg px-8 whitespace-nowrap h-14">
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
    </main>
  );
}
