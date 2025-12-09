"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface StepsProps {
  currentStep: number;
  steps: { label: string; description?: string }[];
  className?: string;
}

export function Steps({ currentStep, steps, className }: StepsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div
              key={index}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                isCompleted || isActive
                  ? "bg-primary"
                  : "bg-muted"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

