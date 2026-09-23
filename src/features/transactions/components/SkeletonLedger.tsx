import React from "react";

export const SkeletonLedger: React.FC = () => {
  return (
    <div className="space-y-3" role="status" aria-label="Loading transactions">
      <div className="h-4 w-28 rounded animate-shimmer" />
      <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border/60">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4">
            <div className="h-9 w-9 rounded-full animate-shimmer shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-44 rounded animate-shimmer" />
              <div className="h-3 w-28 rounded animate-shimmer" />
            </div>
            <div className="h-5 w-24 rounded animate-shimmer shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};