"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { SearchIcon, FilterIcon } from "lucide-react";
import { useStates, useCitiesByState } from "@/hooks/use-locations";
import { ServiceFilters } from "@/core/domain/models/filters";

interface SearchInputProps {
  onSearch: (filters: ServiceFilters) => void;
  defaultFilters?: ServiceFilters;
}

export function SearchInput({
  onSearch,
  defaultFilters = {},
}: SearchInputProps) {
  const router = useRouter();
  const initialFilters = React.useMemo<ServiceFilters>(
    () => ({
      page: defaultFilters.page || 1,
      pageSize: defaultFilters.pageSize || 12,
      q: defaultFilters.q || "",
      providerName: defaultFilters.providerName || "",
      category: defaultFilters.category || "",
      minPrice: defaultFilters.minPrice,
      maxPrice: defaultFilters.maxPrice,
      minRating: defaultFilters.minRating,
      stateId: defaultFilters.stateId || "",
      cityId: defaultFilters.cityId || "",
    }),
    [
      defaultFilters.page,
      defaultFilters.pageSize,
      defaultFilters.q,
      defaultFilters.providerName,
      defaultFilters.category,
      defaultFilters.minPrice,
      defaultFilters.maxPrice,
      defaultFilters.minRating,
      defaultFilters.stateId,
      defaultFilters.cityId,
    ]
  );

  const [searchQuery, setSearchQuery] = React.useState(initialFilters.q);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<ServiceFilters>(initialFilters);

  const { data: states = [], isLoading: isLoadingStates } = useStates();
  const { data: cities = [], isLoading: isLoadingCities } = useCitiesByState(
    filters.stateId || null
  );

  const prevInitialFiltersRef = React.useRef<ServiceFilters>(initialFilters);

  React.useEffect(() => {
    const prev = prevInitialFiltersRef.current;
    const hasChanged =
      initialFilters.page !== prev.page ||
      initialFilters.pageSize !== prev.pageSize ||
      initialFilters.q !== prev.q ||
      initialFilters.providerName !== prev.providerName ||
      initialFilters.category !== prev.category ||
      initialFilters.minPrice !== prev.minPrice ||
      initialFilters.maxPrice !== prev.maxPrice ||
      initialFilters.minRating !== prev.minRating ||
      initialFilters.stateId !== prev.stateId ||
      initialFilters.cityId !== prev.cityId;

    if (hasChanged) {
      setFilters(initialFilters);
      setSearchQuery(initialFilters.q);
      prevInitialFiltersRef.current = initialFilters;
    }
  }, [
    initialFilters.page,
    initialFilters.pageSize,
    initialFilters.q,
    initialFilters.providerName,
    initialFilters.category,
    initialFilters.minPrice,
    initialFilters.maxPrice,
    initialFilters.minRating,
    initialFilters.stateId,
    initialFilters.cityId,
  ]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    onSearch({
      ...filters,
      q: searchQuery,
    });
  };

  const handleStateChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      stateId: value,
      cityId: "",
    }));
  };

  const handleCityChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      cityId: value,
    }));
  };

  const handleFilterChange = (
    field: keyof ServiceFilters,
    value: string | number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handleApplyFilters = () => {
    setIsDrawerOpen(false);
    const filtersToApply: ServiceFilters = {
      ...filters,
      q: searchQuery,
    };

    const params = new URLSearchParams();
    if (filtersToApply.q?.trim()) {
      params.set("q", filtersToApply.q.trim());
    }
    if (filtersToApply.stateId) {
      params.set("state", filtersToApply.stateId);
    }
    if (filtersToApply.cityId) {
      params.set("city", filtersToApply.cityId);
    }
    if (filtersToApply.providerName) {
      params.set("providerName", filtersToApply.providerName);
    }
    if (filtersToApply.category) {
      params.set("category", filtersToApply.category);
    }
    if (filtersToApply.minPrice !== undefined) {
      params.set("minPrice", filtersToApply.minPrice.toString());
    }
    if (filtersToApply.maxPrice !== undefined) {
      params.set("maxPrice", filtersToApply.maxPrice.toString());
    }
    if (filtersToApply.minRating !== undefined) {
      params.set("minRating", filtersToApply.minRating.toString());
    }
    if (filtersToApply.page) {
      params.set("page", filtersToApply.page.toString());
    }
    if (filtersToApply.pageSize) {
      params.set("pageSize", filtersToApply.pageSize.toString());
    }

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`);
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      pageSize: 12,
      q: "",
      providerName: "",
      category: "",
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      stateId: "",
      cityId: "",
    });
    setSearchQuery("");
  };

  const selectedState = states.find((s) => s.id === filters.stateId);
  const selectedCity = cities.find((c) => c.id === filters.cityId);
  const hasActiveFilters =
    filters.stateId ||
    filters.cityId ||
    filters.providerName ||
    filters.category ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minRating;

  const filtersLabel = selectedCity
    ? `${selectedCity.name}, ${selectedState?.name || ""}`
    : selectedState
    ? selectedState.name
    : hasActiveFilters
    ? "Filtros ativos"
    : "Filtros";

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div className="flex border border-foreground rounded-lg overflow-hidden w-full">
        <Drawer
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          direction="right"
        >
          <DrawerTrigger asChild>
            <button className="w-full sm:w-48 flex items-center justify-center px-3 h-12 border-r border-foreground hover:bg-accent transition-colors">
              <FilterIcon className="w-4 h-4 mr-2" />
              <span className="flex-1 text-left truncate">{filtersLabel}</span>
            </button>
          </DrawerTrigger>
          <DrawerContent direction="right">
            <DrawerHeader>
              <DrawerTitle>Filtros</DrawerTitle>
              <DrawerDescription>
                Aplique filtros para encontrar os serviços que você precisa
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
              <Field>
                <FieldLabel htmlFor="providerName">
                  Nome do Prestador
                </FieldLabel>
                <Input
                  id="providerName"
                  type="text"
                  placeholder="Nome do prestador"
                  value={filters.providerName || ""}
                  onChange={(e) =>
                    handleFilterChange("providerName", e.target.value)
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="category">Categoria</FieldLabel>
                <Input
                  id="category"
                  type="text"
                  placeholder="Nome da categoria"
                  value={filters.category || ""}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="state">Estado</FieldLabel>
                <Select
                  value={filters.stateId || undefined}
                  onValueChange={handleStateChange}
                  disabled={isLoadingStates}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.id} value={state.id}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="city">Cidade</FieldLabel>
                <Select
                  value={filters.cityId || undefined}
                  onValueChange={handleCityChange}
                  disabled={!filters.stateId || isLoadingCities}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="minPrice">Preço Mínimo</FieldLabel>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "minPrice",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="maxPrice">Preço Máximo</FieldLabel>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "maxPrice",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="minRating">Avaliação Mínima</FieldLabel>
                <Input
                  id="minRating"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filters.minRating || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "minRating",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </Field>
            </div>
            <DrawerFooter className="flex-row gap-2">
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="flex-1"
              >
                Limpar
              </Button>
              <Button onClick={handleApplyFilters} className="flex-1">
                Aplicar
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

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
