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
import { ServiceCard } from "@/components/service/service-card";
import { ServiceCardSkeleton } from "@/components/service/service-card-skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useLocations } from "@/hooks/use-locations";
import { useServices } from "@/hooks/use-services";

export default function Home() {
  const {
    locations,
    selectedLocation,
    isOpen,
    selectLocation,
    setIsOpen,
    searchLocations,
    isLoading: isLoadingLocations,
  } = useLocations();

  const { services, isLoading } = useServices();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="flex items-start justify-center h-[95vh] px-4 pt-28  bg-gradient-to-b from-background via-background to-primary/80 dark:to-card">
        <div className="max-w-5xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-8 leading-tight">
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
              <div className="flex border border-foreground rounded-lg overflow-hidden w-full">
                {/* Location Field */}
                <div className="w-full sm:w-48 flex items-center justify-center px-3 h-14 border-r border-foreground">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                      <button className="flex-1 text-left focus:outline-none h-full truncate">
                        {selectedLocation
                          ? selectedLocation.label
                          : "Localização"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" side="bottom" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Buscar cidade..."
                          onValueChange={searchLocations}
                        />
                        <CommandList>
                          {isLoadingLocations ? (
                            <div className="flex items-center justify-center py-6">
                              <Spinner />
                              <span className="ml-2 text-sm text-muted-foreground">
                                Carregando cidades...
                              </span>
                            </div>
                          ) : (
                            <>
                              <CommandEmpty>
                                Nenhuma cidade encontrada.
                              </CommandEmpty>
                              <CommandGroup>
                                {locations.map((location) => (
                                  <CommandItem
                                    key={location.value}
                                    value={location.value}
                                    onSelect={(value) => {
                                      const foundLocation = locations.find(
                                        (loc) => loc.value === value
                                      );
                                      selectLocation(foundLocation || null);
                                    }}
                                  >
                                    {location.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </>
                          )}
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
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
            Serviços Disponíveis
          </h2>
          <p className="text-lg text-muted-foreground">
            Encontre os melhores profissionais para suas necessidades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }, (_, index) => (
                <ServiceCardSkeleton key={`skeleton-${index}`} />
              ))
            : services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
        </div>
      </div>
    </main>
  );
}
