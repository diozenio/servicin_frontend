"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { ServiceCard } from "@/components/service/service-card";
import { ServiceCardSkeleton } from "@/components/service/service-card-skeleton";
import { useServices } from "@/hooks/use-services";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ServiceFilters } from "@/core/domain/models/filters";
import { useStates, useCitiesByState } from "@/hooks/use-locations";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultFilters = React.useMemo<ServiceFilters>(
    () => ({
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      pageSize: searchParams.get("pageSize")
        ? Number(searchParams.get("pageSize"))
        : 12,
      q: searchParams.get("q") || "",
      providerName: searchParams.get("providerName") || "",
      category: searchParams.get("category") || "",
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      minRating: searchParams.get("minRating")
        ? Number(searchParams.get("minRating"))
        : undefined,
      stateId: searchParams.get("state") || "",
      cityId: searchParams.get("city") || "",
    }),
    [
      searchParams.get("page"),
      searchParams.get("pageSize"),
      searchParams.get("q"),
      searchParams.get("providerName"),
      searchParams.get("category"),
      searchParams.get("minPrice"),
      searchParams.get("maxPrice"),
      searchParams.get("minRating"),
      searchParams.get("state"),
      searchParams.get("city"),
    ]
  );

  const { services, isLoading, isFetching, loadMore, limit, total, hasMore } =
    useServices({
      filters: defaultFilters,
    });

  const { data: states = [] } = useStates();
  const { data: cities = [] } = useCitiesByState(
    defaultFilters.stateId || null
  );

  const selectedState = states.find((s) => s.id === defaultFilters.stateId);
  const selectedCity = cities.find((c) => c.id === defaultFilters.cityId);

  const activeFilters = React.useMemo(() => {
    const filters: Array<{
      key: keyof ServiceFilters;
      label: string;
      value: string;
    }> = [];

    if (defaultFilters.q) {
      filters.push({ key: "q", label: "Busca", value: defaultFilters.q });
    }
    if (defaultFilters.providerName) {
      filters.push({
        key: "providerName",
        label: "Prestador",
        value: defaultFilters.providerName,
      });
    }
    if (defaultFilters.category) {
      filters.push({
        key: "category",
        label: "Categoria",
        value: defaultFilters.category,
      });
    }
    if (defaultFilters.stateId && selectedState) {
      filters.push({
        key: "stateId",
        label: "Estado",
        value: selectedState.name,
      });
    }
    if (defaultFilters.cityId && selectedCity) {
      filters.push({
        key: "cityId",
        label: "Cidade",
        value: selectedCity.name,
      });
    }
    if (defaultFilters.minPrice !== undefined) {
      filters.push({
        key: "minPrice",
        label: "Preço Mín.",
        value: `R$ ${defaultFilters.minPrice.toFixed(2)}`,
      });
    }
    if (defaultFilters.maxPrice !== undefined) {
      filters.push({
        key: "maxPrice",
        label: "Preço Máx.",
        value: `R$ ${defaultFilters.maxPrice.toFixed(2)}`,
      });
    }
    if (defaultFilters.minRating !== undefined) {
      filters.push({
        key: "minRating",
        label: "Avaliação Mín.",
        value: `${defaultFilters.minRating.toFixed(1)} ⭐`,
      });
    }

    return filters;
  }, [defaultFilters, selectedState, selectedCity]);

  const handleSearch = (filters: ServiceFilters) => {
    const params = new URLSearchParams();
    if (filters.q?.trim()) {
      params.set("q", filters.q.trim());
    }
    if (filters.stateId) {
      params.set("state", filters.stateId);
    }
    if (filters.cityId) {
      params.set("city", filters.cityId);
    }
    if (filters.providerName) {
      params.set("providerName", filters.providerName);
    }
    if (filters.category) {
      params.set("category", filters.category);
    }
    if (filters.minPrice !== undefined) {
      params.set("minPrice", filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      params.set("maxPrice", filters.maxPrice.toString());
    }
    if (filters.minRating !== undefined) {
      params.set("minRating", filters.minRating.toString());
    }
    if (filters.page) {
      params.set("page", filters.page.toString());
    }
    if (filters.pageSize) {
      params.set("pageSize", filters.pageSize.toString());
    }

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`);
  };

  const handleLoadMore = () => {
    loadMore();
  };

  return (
    <div className="min-h-screen bg-background">
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchInput
            onSearch={handleSearch}
            defaultFilters={defaultFilters}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-serif font-semibold mb-2">
              {isLoading ? (
                <Skeleton className="h-8 w-64" />
              ) : defaultFilters.q ||
                defaultFilters.stateId ||
                defaultFilters.cityId ? (
                `Resultados da busca${
                  defaultFilters.q ? ` por "${defaultFilters.q}"` : ""
                }${
                  defaultFilters.stateId || defaultFilters.cityId
                    ? ` em ${defaultFilters.cityId ? "cidade" : "estado"}`
                    : ""
                }`
              ) : (
                "Todos os serviços"
              )}
            </h1>
            <div className="text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <>
                  {services.length} de {total} serviço
                  {total !== 1 ? "s" : ""} encontrado
                  {total !== 1 ? "s" : ""}
                </>
              )}
            </div>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">
                Filtros ativos:
              </span>
              {activeFilters.map((filter) => (
                <Badge
                  key={filter.key}
                  variant="secondary"
                  className="px-3 py-1"
                >
                  <span className="text-xs font-medium">
                    {filter.label}: {filter.value}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: limit }, (_, index) => (
              <ServiceCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : services.length > 0 ? (
            services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground">
                <SearchIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhum serviço encontrado
                </h3>
                <p className="text-sm">
                  Tente ajustar seus critérios de busca ou explorar outras
                  categorias.
                </p>
              </div>
            </div>
          )}
        </div>

        {services.length > 0 && hasMore && (
          <div className="flex justify-center mt-8">
            <Button
              variant="secondary"
              onClick={handleLoadMore}
              disabled={isLoading || isFetching}
              className="px-8 py-2"
            >
              {isLoading || isFetching ? "Carregando..." : "Ver mais"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
