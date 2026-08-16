import React from "react";
import { Link } from "react-router-dom";
import { Wallet, TrendUp, CreditCard, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { Account } from "@/features/dashboard/types/dashboard.types";

interface AccountCardProps {
  account: Account;
}

const ACCOUNT_TYPE_LABEL: Record<Account["accountType"], string> = {
  PRIMARY: "Primary",
  SAVINGS: "Savings",
  CHECKING: "Checking",
};

const STATUS_BADGE: Record<
  Account["status"],
  { text: string; className: string }
> = {
  ACTIVE: { text: "Active", className: "text-(--color-success) bg-(--color-success)/10" },
  INACTIVE: { text: "Inactive", className: "text-(--color-muted-foreground)  bg-(--color-muted)/60" },
  FROZEN: { text: "Frozen", className: "text-(--color-warning)  bg-(--color-warning)/10" },
  CLOSED: { text: "Closed", className: "text-(--color-destructive)    bg-(--color-destructive)/10" },
};

const ICON_BG: Record<Account["accountType"], string> = {
  PRIMARY: "bg-(--color-accent)/10  text-(--color-accent)",
  SAVINGS: "bg-(--color-primary)/15 text-(--color-primary)",
  CHECKING: "bg-(--color-info)/15    text-(--color-info)",
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

export const AccountCard = React.memo(function AccountCard({
  account,
}: AccountCardProps) {
  const typeLabel = ACCOUNT_TYPE_LABEL[account.accountType];
  const badge = STATUS_BADGE[account.status];

  return (
    <Link
      to={`/dashboard/accounts/${account.id}`}
      className="
        group flex items-center gap-3.5
        rounded-xl border border-(--color-border)
        bg-card
        px-4 py-3.5
        transition-[background-color,border-color,box-shadow,transform,opacity] duration-normal ease-out
        hover:border-(--color-border-hover) hover:-translate-y-0.5
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-(--color-ring)/40
        active:scale-[0.995]
        touch-action-manipulation
      "
      // em-dash replaced with hyphen - screen readers handle hyphen better
      aria-label={`${typeLabel} account - ${account.accountNumber}`}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          ICON_BG[account.accountType],
        )}
        aria-hidden="true"
      >
        {account.accountType === "SAVINGS" ? (
          <TrendUp size={16} />
        ) : account.accountType === "CHECKING" ? (
          <CreditCard size={16} />
        ) : (
          <Wallet size={16} />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{typeLabel}</p>
          <span
            className={cn(
              "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
              badge.className,
            )}
          >
            {badge.text}
          </span>
        </div>
        {/*
         * translate="no" — account numbers must not be auto-translated/garbled
         * by browser translation tools or Google Translate.
         */}
        <p
          className="mt-0.5 font-mono text-[11px] tracking-wider text-muted-foreground"
          translate="no"
        >
          {account.accountNumber}
        </p>
      </div>

      {/* Balance */}
      <div className="shrink-0 text-right">
        {/* translate="no" — currency amounts must not be modified by auto-translation */}
        <p
          className="font-mono text-sm font-bold text-foreground tabular-nums"
          translate="no"
        >
          {formatCurrency(account.balance, account.currency)}
        </p>
        {account.availableBalance !== account.balance ? (
          <p
            className="mt-0.5 font-mono text-[11px] text-muted-foreground tabular-nums"
            translate="no"
          >
            {formatCurrency(account.availableBalance, account.currency)} avail.
          </p>
        ) : null}
      </div>

      <CaretRight
        size={16}
        className="shrink-0 text-muted-foreground transition-transform duration-normal group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
});
