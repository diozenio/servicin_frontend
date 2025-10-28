"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ServiceCard } from "@/components/service/service-card";
import { ServiceCardSkeleton } from "@/components/service/service-card-skeleton";
import { useServices } from "@/hooks/use-services";
import { SearchInput } from "@/components/search-input";
import { useState, useCallback } from "react";
import { Location as LocationModel } from "@/core/domain/models/location";

export default function Home() {
  const router = useRouter();
  useState<LocationModel | null>(null);

  const { services, isLoading } = useServices({ limit: 6 });

  const handleSearch = useCallback(
    (search: string, location: LocationModel | null) => {
      const params = new URLSearchParams();
      if (search.trim()) {
        params.set("q", search.trim());
      }
      if (location) {
        params.set("location", location.id);
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

          <div className="max-w-2xl mx-auto mb-8">
            <SearchInput onSearch={handleSearch} />
          </div>

          <div className="text-sm">
            <span className="mr-2">Populares:</span>
            <button
              onClick={useCallback(() => {
                handleSearch("Encanador", null);
              }, [handleSearch])}
              className="underline mr-2 hover:text-primary transition-colors"
            >
              Encanador,
            </button>
            <button
              onClick={useCallback(() => {
                handleSearch("Eletricista", null);
              }, [handleSearch])}
              className="underline mr-2 hover:text-primary transition-colors"
            >
              Eletricista,
            </button>
            <button
              onClick={useCallback(() => {
                handleSearch("Pintor", null);
              }, [handleSearch])}
              className="underline mr-2 hover:text-primary transition-colors"
            >
              Pintor,
            </button>
            <button
              onClick={useCallback(() => {
                handleSearch("Pedreiro", null);
              }, [handleSearch])}
              className="underline hover:text-primary transition-colors"
            >
              Pedreiro
            </button>
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
