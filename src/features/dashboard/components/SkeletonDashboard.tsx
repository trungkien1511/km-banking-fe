/**
 * SkeletonDashboard — mirrors the visual structure of the real dashboard
 * using shimmer placeholders. Shown while data is loading.
 * Uses `animate-shimmer` defined in src/index.css.
 */
export function SkeletonDashboard() {
  return (
    <div
      className="space-y-4"
      role="status"
      aria-busy="true"
      aria-label="Loading dashboard data"
    >
      {/* Balance card skeleton */}
      <div className="rounded-2xl border border-border bg-card px-5 py-5 shadow-card space-y-4">
        <div className="h-3 w-28 rounded animate-shimmer" />
        <div className="h-10 w-48 rounded animate-shimmer" />
        <div className="flex gap-2">
          <div className="h-9 flex-1 rounded-xl animate-shimmer" />
          <div className="h-9 w-28 rounded-xl animate-shimmer" />
        </div>
      </div>

      {/* Quick actions skeleton — mirrors QuickActions: 2-col on mobile, 4-col on sm+,
          icon + label side-by-side (flex row) matching the real component layout */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-lg animate-shimmer shrink-0" />
            <div className="h-3 w-14 rounded animate-shimmer" />
          </div>
        ))}
      </div>

      {/* Accounts section skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-20 rounded animate-shimmer" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card px-4 py-3.5 flex items-center gap-3.5"
          >
            <div className="h-9 w-9 rounded-xl animate-shimmer shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 rounded animate-shimmer" />
              <div className="h-2.5 w-32 rounded animate-shimmer" />
            </div>
            <div className="h-4 w-24 rounded animate-shimmer shrink-0" />
          </div>
        ))}
      </div>

      {/* Transactions section skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-32 rounded animate-shimmer" />
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 border-b border-border/60 last:border-b-0"
            >
              <div className="h-8 w-8 rounded-full animate-shimmer shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 rounded animate-shimmer" />
                <div className="h-2.5 w-24 rounded animate-shimmer" />
              </div>
              <div className="h-4 w-20 rounded animate-shimmer shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}