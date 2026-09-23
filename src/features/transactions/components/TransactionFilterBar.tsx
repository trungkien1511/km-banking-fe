import React from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { DirectionFilter } from "../types/transactions.types";

interface TransactionFilterBarProps {
  direction: DirectionFilter;
  onDirectionChange: (dir: DirectionFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  filteredCount: number;
  currentPage: number;
}

const PILLS: { id: DirectionFilter; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "IN", label: "Money In" },
  { id: "OUT", label: "Money Out" },
];

export const TransactionFilterBar: React.FC<TransactionFilterBarProps> = React.memo(
  function TransactionFilterBar({
    direction,
    onDirectionChange,
    searchQuery,
    onSearchChange,
    totalCount,
    filteredCount,
    currentPage,
  }) {
    return (
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Direction Filter Pills */}
          <div
            className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/80 w-fit"
            role="group"
            aria-label="Filter transactions by direction"
          >
            {PILLS.map((pill) => {
              const isActive = direction === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => onDirectionChange(pill.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 min-h-[36px]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    isActive
                      ? "bg-card text-foreground shadow-sm border border-border/60"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search description or reference…"
              className="w-full h-10 pl-9 pr-8 rounded-xl bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Clear indication of filter scope on current page */}
        {(direction !== "ALL" || searchQuery) && (
          <p className="text-xs text-muted-foreground" aria-live="polite">
            Showing {filteredCount} of {totalCount} transactions on Page {currentPage}
          </p>
        )}
      </div>
    );
  }
);