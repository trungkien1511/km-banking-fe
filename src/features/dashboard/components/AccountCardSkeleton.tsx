import { Skeleton } from "@/components/ui/Skeleton";

export function AccountCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
      <div className="space-y-4">
        {/* Row 1: account type label + status badge */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-4 w-14 rounded-full" />
        </div>

        {/* Row 2: "Account Number" label + masked account number */}
        <div className="space-y-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Row 3: balance + trend indicator */}
        <div className="pt-2 border-t border-border/50 flex items-baseline justify-between">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}
