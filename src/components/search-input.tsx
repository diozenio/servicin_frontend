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
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Location as LocationModel } from "@/core/domain/models/location";
import { useLocations } from "@/hooks/use-locations";

interface SearchInputProps {
  onSearch: (search: string, location: LocationModel | null) => void;
  defaultSearch?: string;
  defaultLocation?: LocationModel | null;
  isLoadingLocation?: boolean;
}

export function SearchInput({
  onSearch,
  defaultSearch = "",
  defaultLocation = null,
  isLoadingLocation = false,
}: SearchInputProps) {
  const [searchQuery, setSearchQuery] = React.useState(defaultSearch);
  const [selectedLocation, setSelectedLocation] =
    React.useState<LocationModel | null>(defaultLocation);
  const [isLocationOpen, setIsLocationOpen] = React.useState(false);

  const {
    locations,
    searchLocations,
    isLoading: isLoadingLocations,
  } = useLocations({ limit: 10 });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLocationSelect = (location: LocationModel | null) => {
    setSelectedLocation(location);
    setIsLocationOpen(false);
  };

  const handleSearch = () => {
    onSearch(searchQuery, selectedLocation);
  };

  React.useEffect(() => {
    if (defaultLocation) {
      setSelectedLocation(defaultLocation);
    }
  }, [defaultLocation]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div className="flex border border-foreground rounded-lg overflow-hidden w-full">
        <div className="w-full sm:w-48 flex items-center justify-center px-3 h-12 border-r border-foreground">
          <MapPinIcon className="w-4 h-4 mr-2" />
          <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
            <PopoverTrigger asChild>
              <button className="flex-1 text-left focus:outline-none h-full truncate">
                {isLoadingLocation ? (
                  <Skeleton className="h-4 w-24" />
                ) : selectedLocation ? (
                  selectedLocation.label
                ) : (
                  "Localização"
                )}
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
                      <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                      <CommandGroup>
                        {locations.map((location) => (
                          <CommandItem
                            key={location.id}
                            value={location.value}
                            onSelect={(value) => {
                              const foundLocation = locations.find(
                                (loc) => loc.value === value
                              );
                              handleLocationSelect(foundLocation || null);
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

        <div className="w-full flex items-center justify-center px-3 h-12">
          <SearchIcon className="w-4 h-4 mr-2" />
          <Input
            placeholder="Que tipo de serviço você precisa?"
            className="border-0 focus-visible:ring-0 p-0 bg-transparent dark:bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>

      <Button
        onClick={handleSearch}
        className="rounded-lg px-8 whitespace-nowrap h-12 w-full sm:w-auto"
      >
        Buscar
      </Button>
    </div>
  );
}
