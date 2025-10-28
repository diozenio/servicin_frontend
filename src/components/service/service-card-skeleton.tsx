"use client";

import * as React from "react";

export function ServiceCardSkeleton() {
  return (
    <div className="dark:bg-card bg-secondary/15 border border-border rounded-lg p-6 animate-pulse">
      <div className="mb-4">
        <div className="h-6 bg-muted rounded-md mb-2 w-3/4"></div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-full"></div>
          <div className="h-4 bg-muted rounded w-24"></div>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-6 bg-muted rounded-full w-16"></div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-start">
          <div className="w-1.5 h-1.5 bg-muted rounded-full mt-2 mr-2 flex-shrink-0"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </div>
        <div className="flex items-start">
          <div className="w-1.5 h-1.5 bg-muted rounded-full mt-2 mr-2 flex-shrink-0"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
        <div className="flex items-start">
          <div className="w-1.5 h-1.5 bg-muted rounded-full mt-2 mr-2 flex-shrink-0"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-muted rounded mr-2"></div>
          <div className="h-4 bg-muted rounded w-20"></div>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-muted rounded mr-2"></div>
          <div className="h-4 bg-muted rounded w-16"></div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="w-4 h-4 bg-muted rounded"></div>
          ))}
        </div>
        <div className="h-4 bg-muted rounded w-24"></div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-muted rounded"></div>
        <div className="w-10 h-10 bg-muted rounded"></div>
      </div>
    </div>
  );
}
