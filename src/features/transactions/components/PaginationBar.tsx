import React from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface PaginationBarProps {
  page: number;
  totalPages: number;
  totalElements: number;
  size: number;
  onPageChange: (page: number) => void;
}

export const PaginationBar: React.FC<PaginationBarProps> = React.memo(
  function PaginationBar({ page, totalPages, totalElements, size, onPageChange }) {
    if (totalPages <= 1 && totalElements === 0) return null;

    const start = Math.min((page - 1) * size + 1, totalElements);
    const end = Math.min(page * size, totalElements);

    return (
      <nav
        aria-label="Transaction pagination"
        className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/60"
      >
        <p className="text-xs text-muted-foreground tabular-nums">
          Showing {start}–{end} of {totalElements}
        </p>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors min-h-[36px]"
          >
            <CaretLeft size={14} aria-hidden="true" />
            Previous
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            const isCurrent = p === page;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-label={`Page ${p}`}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "w-9 h-9 rounded-lg text-xs font-semibold transition-colors min-h-[36px] min-w-[36px]",
                  isCurrent
                    ? "bg-primary text-primary-fg font-bold shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {p}
              </button>
            );
          })}

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors min-h-[36px]"
          >
            Next
            <CaretRight size={14} aria-hidden="true" />
          </button>
        </div>
      </nav>
    );
  }
);