import React from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/features/dashboard/types/dashboard.types";

interface TransactionCardProps {
  transaction: Transaction;
}

const STATUS_DOT: Record<Transaction["status"], string> = {
  PENDING: "bg-warning",
  COMPLETED: "bg-success",
  FAILED: "bg-destructive",
  CANCELLED: "bg-muted-foreground/40",
};

const TYPE_LABEL: Record<Transaction["transactionType"], string> = {
  DEPOSIT: "Deposit",
  WITHDRAWAL: "Withdrawal",
  TRANSFER: "Transfer",
  FEE: "Fee",
};

// js-cache-function-results
const currencyFormatterCache = new Map<string, Intl.NumberFormat>();
const formatCurrency = (amount: number, currency: string = "VND"): string => {
  let fmt = currencyFormatterCache.get(currency);
  if (fmt === undefined) {
    fmt = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    currencyFormatterCache.set(currency, fmt);
  }
  return fmt.format(amount);
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});
const formatDate = (dateStr: string): string =>
  dateFormatter.format(new Date(dateStr));

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

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {transaction.description !== null
            ? transaction.description
            : typeLabel}
        </p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full shrink-0",
              STATUS_DOT[transaction.status],
            )}
            aria-hidden="true"
          />
          <p className="text-[11px] text-muted-foreground">
            {formatDate(transaction.createdAt)}
          </p>
        </div>
      </div>

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
