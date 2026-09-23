import React from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowsLeftRight,
  CaretRight,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Transaction } from "@/features/dashboard/types/dashboard.types";

interface TransactionRowProps {
  transaction: Transaction;
  onClick: () => void;
}

const STATUS_CLASS: Record<Transaction["status"], string> = {
  PENDING: "text-warning",
  COMPLETED: "text-success",
  FAILED: "text-destructive",
  CANCELLED: "text-muted-foreground",
};

export const TransactionRow: React.FC<TransactionRowProps> = React.memo(
  function TransactionRow({ transaction, onClick }) {
    const isIncoming = transaction.direction === "IN";
    const isNeutral = transaction.direction === null;

    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left flex items-center justify-between gap-3 px-4 py-3.5 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Direction Icon: green for in, muted navy for out, never alarming red for normal spending */}
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              isNeutral
                ? "bg-muted/60 text-muted-foreground"
                : isIncoming
                ? "bg-success/15 text-success"
                : "bg-muted/80 text-foreground"
            )}
            aria-hidden="true"
          >
            {isNeutral ? (
              <ArrowsLeftRight size={16} />
            ) : isIncoming ? (
              <ArrowDownLeft size={16} />
            ) : (
              <ArrowUpRight size={16} />
            )}
          </div>

          {/* Description & Reference */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate">
              {transaction.description ?? transaction.transactionType}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={cn("text-xs font-semibold", STATUS_CLASS[transaction.status])}
              >
                {transaction.status}
              </span>
              <span className="text-xs text-muted-foreground font-mono" translate="no">
                {transaction.referenceNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Amount: Green for Inflow (+), Clean High-Contrast Neutral for Outflow (-) */}
        <div className="shrink-0 text-right flex items-center gap-2">
          <div>
            <p
              className={cn(
                "font-mono text-sm font-bold tabular-nums",
                isNeutral
                  ? "text-foreground"
                  : isIncoming
                  ? "text-success"
                  : "text-destructive"
              )}
              translate="no"
            >
              {!isNeutral && (isIncoming ? "+" : "-")}
              {formatCurrency(transaction.amount, transaction.currency)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDateTime(transaction.createdAt).split(" ")[1]}
            </p>
          </div>
          <CaretRight size={14} className="text-muted-foreground" aria-hidden="true" />
        </div>
      </button>
    );
  }
);