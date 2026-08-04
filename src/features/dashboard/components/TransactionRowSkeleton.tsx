import { Skeleton } from "@/components/ui/Skeleton";

export function TransactionRowSkeleton() {
  return (
    <div className="p-6 flex items-center justify-between">
      {/* Left: icon circle + two text lines */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      {/* Right: amount + date */}
      <div className="text-right space-y-1">
        <Skeleton className="h-3.5 w-20 ml-auto" />
        <Skeleton className="h-3 w-16 ml-auto" />
      </div>
    </div>
  );
}
