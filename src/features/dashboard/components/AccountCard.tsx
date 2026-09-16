import React from "react";
import { Link } from "react-router-dom";
import { Wallet, TrendUp, CreditCard, CaretRight, Copy, Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { formatCurrency, maskAccountNumber } from "@/lib/format";
import { formatAccountType } from "@/lib/labels";
import type { Account } from "@/features/dashboard/types/dashboard.types";

interface AccountCardProps {
  account: Account;
}

const STATUS_BADGE: Record<
  Account["status"],
  { text: string; className: string }
> = {
  ACTIVE: { text: "Active", className: "text-success bg-success/20" },
  INACTIVE: { text: "Inactive", className: "text-muted-foreground bg-muted" },
  FROZEN: { text: "Frozen", className: "text-warning bg-warning/20" },
  CLOSED: { text: "Closed", className: "text-destructive bg-destructive/20" },
};

const ICON_BG: Record<Account["accountType"], string> = {
  PRIMARY: "bg-accent/10 text-accent",
  SAVINGS: "bg-primary/15 text-primary",
  CHECKING: "bg-info/15 text-info",
};

export const AccountCard = React.memo(function AccountCard({
  account,
}: AccountCardProps) {
  const typeLabel = formatAccountType(account.accountType);
  const badge = STATUS_BADGE[account.status];
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(account.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="
        group flex items-center justify-between gap-3.5
        rounded-xl border border-border
        bg-card
        px-4 py-3.5
        transition-[background-color,border-color,box-shadow,opacity] duration-normal ease-out
        hover:bg-muted/30 hover:border-border-hover
        focus-within:ring-2 focus-within:ring-ring/40
        touch-manipulation
      "
    >
      <Link
        to={`/accounts/${account.id}`}
        className="
          flex flex-1 items-center gap-3.5 min-w-0
          focus-visible:outline-none
        "
        aria-label={`${typeLabel} account - ${maskAccountNumber(account.accountNumber)}`}
      >
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

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{typeLabel}</p>
            <span
              className={cn(
                "inline-flex rounded-full px-2 py-0.5 text-sm font-medium",
                badge.className,
              )}
            >
              {badge.text}
            </span>
          </div>
          <p
            className="mt-0.5 font-mono text-sm tracking-wider text-muted-foreground"
            translate="no"
          >
            {maskAccountNumber(account.accountNumber)}
          </p>
        </div>

        <div className="shrink-0 text-right pr-1">
          <p
            className="font-mono text-sm font-bold text-foreground tabular-nums"
            translate="no"
          >
            {formatCurrency(account.balance, account.currency)}
          </p>
          {account.availableBalance !== account.balance ? (
            <p
              className="mt-0.5 font-mono text-sm text-muted-foreground tabular-nums"
              translate="no"
            >
              {formatCurrency(account.availableBalance, account.currency)} avail.
            </p>
          ) : null}
        </div>
      </Link>

      <div className="flex items-center gap-1 shrink-0 border-l border-border/40 pl-2">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy account number"}
          className="
            flex h-9 w-9 items-center justify-center rounded-lg
            text-muted-foreground
            hover:bg-muted/60 hover:text-foreground
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50
          "
        >
          {copied ? (
            <Check size={14} className="text-success" aria-hidden="true" />
          ) : (
            <Copy size={14} aria-hidden="true" />
          )}
        </button>

        <Link
          to={`/accounts/${account.id}`}
          tabIndex={-1}
          aria-hidden="true"
          className="text-muted-foreground transition-transform duration-normal group-hover:translate-x-0.5 p-1"
        >
          <CaretRight size={16} />
        </Link>
      </div>
    </div>
  );
});
