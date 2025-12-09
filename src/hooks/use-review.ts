"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/container";
import { CreateReviewRequest } from "@/core/domain/models/review";

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateReviewRequest) => {
      return container.reviewService.createReview(request);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["appointment", variables.appointmentId] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}