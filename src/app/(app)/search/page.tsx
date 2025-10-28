"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { ServiceCard } from "@/components/service/service-card";
import { ServiceCardSkeleton } from "@/components/service/service-card-skeleton";
import { useServices } from "@/hooks/use-services";
import { useLocation } from "@/hooks/use-location";
import { SearchInput } from "@/components/search-input";
import { Location as LocationModel } from "@/core/domain/models/location";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const locationId = searchParams.get("location") || "";

  const { services, isLoading, isFetching, loadMore, limit, total, hasMore } =
    useServices({
      searchTerm: searchQuery,
      selectedLocation: locationId,
    });

  const { location: selectedLocation, isLoading: isLoadingLocation } =
    useLocation(locationId || null);

  const handleSearch = (search: string, location: LocationModel | null) => {
    const params = new URLSearchParams();
    if (search.trim()) {
      params.set("q", search.trim());
    }
    if (location) {
      params.set("location", location.id);
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
            defaultSearch={searchQuery}
            defaultLocation={selectedLocation}
            isLoadingLocation={isLoadingLocation}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif font-semibold mb-2">
              {isLoading ? (
                <Skeleton className="h-8 w-64" />
              ) : searchQuery || locationId ? (
                `Resultados da busca${
                  searchQuery ? ` por "${searchQuery}"` : ""
                }${
                  locationId
                    ? ` em ${
                        isLoadingLocation
                          ? "carregando..."
                          : selectedLocation?.label || locationId
                      }`
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
