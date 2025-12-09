"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { container } from "@/container";
import { Location } from "@/core/domain/models/location";

export function useStates() {
  return useQuery({
    queryKey: ["locations", "states"],
    queryFn: async () => {
      const response = await container.locationService.getStates();
      return response.data;
    },
  });
}

export function useCitiesByState(stateId: string | null) {
  return useQuery({
    queryKey: ["locations", "cities", stateId],
    queryFn: async () => {
      if (!stateId) return [];
      const response = await container.locationService.getCitiesByState(stateId);
      return response.data;
    },
    enabled: !!stateId,
  });
}

export function useLocations(options?: { limit?: number }) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: states = [], isLoading: isLoadingStates } = useStates();
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const { data: cities = [], isLoading: isLoadingCities } = useCitiesByState(selectedStateId);

  const searchLocations = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const allLocations: Location[] = cities
    .filter((city) => {
      if (!searchQuery) return true;
      return city.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .slice(0, options?.limit || 10)
    .map((city) => ({
      id: city.id,
      value: city.id,
      label: city.name,
    }));

  return {
    locations: allLocations,
    searchLocations,
    isLoading: isLoadingStates || isLoadingCities,
  };
}
