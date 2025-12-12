"use client";

import { useRouter } from "next/navigation";
import { ServiceCard } from "@/components/service/service-card";
import { ServiceCardSkeleton } from "@/components/service/service-card-skeleton";
import { useServices } from "@/hooks/use-services";
import { SearchInput } from "@/components/search-input";
import { useCallback } from "react";
import { ServiceQueryParams } from "@/core/domain/models/service";
import { useCategories } from "@/hooks/use-categories";

export default function Home() {
  const router = useRouter();

  const { services, isLoading } = useServices({ page: 1, pageSize: 6 });
  const { data: categories = [] } = useCategories();
  const popularCategories = categories.slice(0, 4);

  const handleSearch = useCallback(
    (filters: ServiceQueryParams) => {
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
    },
    [router]
  );

  return (
    <main className="min-h-screen">
      <div className="flex items-start justify-center h-[95vh] px-4 pt-28  bg-gradient-to-b from-background via-background to-primary/40 dark:to-card">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-8 leading-tight">
            Conecte-se com os melhores profissionais urbanos da sua região
          </h1>

          <p className="text-lg md:text-xl mb-12 leading-relaxed">
            Receba orçamentos gratuitos em poucos minutos.
          </p>

          <div className="max-w-4xl mx-auto mb-8">
            <SearchInput onSearch={handleSearch} />
          </div>

          <div className="text-sm">
            <span className="mr-2">Populares:</span>
            {popularCategories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => {
                  handleSearch({ category: category.name });
                }}
                className="underline mr-2 hover:text-primary transition-colors"
              >
                {category.name}
                {index < popularCategories.length - 1 && ","}
              </button>
            ))}
          </div>
        </div>
      </div>

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
