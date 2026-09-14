import React from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Transaction } from "@/features/dashboard/types/dashboard.types";

interface TransactionCardProps {
  transaction: Transaction;
}

// English status labels — visible text, not color-only (WCAG 1.4.1)
const STATUS_LABEL: Record<Transaction["status"], string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

const STATUS_CLASS: Record<Transaction["status"], string> = {
  PENDING: "text-warning",
  COMPLETED: "text-success",
  FAILED: "text-destructive",
  CANCELLED: "text-muted-foreground",
};

const TYPE_LABEL: Record<Transaction["transactionType"], string> = {
  DEPOSIT: "Deposit",
  WITHDRAWAL: "Withdrawal",
  TRANSFER: "Transfer",
  FEE: "Service fee",
};

export const TransactionCard = React.memo(function TransactionCard({
  transaction,
}: TransactionCardProps) {
  const isIncoming = transaction.direction === "IN";
  const isNeutral = transaction.direction === null;
  const typeLabel = TYPE_LABEL[transaction.transactionType];

  return (
    <div
      className="
        flex items-center gap-3
        px-4 py-3
        border-b border-border/60 last:border-b-0
        transition-colors duration-100
        hover:bg-muted/30
      "
    >
      {/* Direction icon */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isNeutral
            ? "bg-muted/60 text-muted-foreground"
            : isIncoming
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive",
        )}
        aria-hidden="true"
      >
        {isNeutral ? (
          <ArrowsLeftRight size={14} />
        ) : isIncoming ? (
          <ArrowDownLeft size={14} />
        ) : (
          <ArrowUpRight size={14} />
        )}
      </div>

      {/* Description + status row */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {transaction.description ?? typeLabel}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          {/* Visible status text — satisfies WCAG 1.4.1, no aria-hidden */}
          <span
            className={cn(
              "text-sm font-semibold",
              STATUS_CLASS[transaction.status],
            )}
          >
            {STATUS_LABEL[transaction.status]}
          </span>
          <p className="text-sm text-muted-foreground">
            {formatDate(transaction.createdAt)}
          </p>
        </div>
      </div>

      {/* Amount */}
      <p
        className={cn(
          "shrink-0 font-mono text-sm font-semibold tabular-nums",
          isNeutral
            ? "text-foreground"
            : isIncoming
              ? "text-success"
              : "text-destructive",
        )}
        translate="no"
      >
        {!isNeutral && (isIncoming ? "+" : "-")}
        {formatCurrency(transaction.amount, transaction.currency)}
      </p>
    </div>
  );
});
