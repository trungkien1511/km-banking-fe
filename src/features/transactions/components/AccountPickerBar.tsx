import React from "react";
import { formatCurrency, maskAccountNumber } from "@/lib/format";
import { formatAccountType } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type { Account } from "@/features/dashboard/types/dashboard.types";

interface AccountPickerBarProps {
  accounts: Account[];
  selectedAccountId: string;
  onSelectAccount: (id: string) => void;
}

export const AccountPickerBar: React.FC<AccountPickerBarProps> = React.memo(
  function AccountPickerBar({ accounts, selectedAccountId, onSelectAccount }) {
    if (accounts.length === 0) return null;

    return (
      <div
        role="tablist"
        aria-label="Bank accounts"
        className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none"
      >
        {accounts.map((acc) => {
          const isSelected = acc.id === selectedAccountId;
          return (
            <button
              key={acc.id}
              role="tab"
              type="button"
              id={`account-tab-${acc.id}`}
              aria-selected={isSelected}
              aria-controls="transaction-ledger-panel"
              onClick={() => onSelectAccount(acc.id)}
              className={cn(
                "flex-1 min-w-[200px] text-left p-3.5 rounded-xl border transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                isSelected
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-card hover:bg-muted/40 hover:border-border-hover"
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {formatAccountType(acc.accountType)}
                </span>
                <span
                  className="font-mono text-xs text-muted-foreground"
                  translate="no"
                >
                  {maskAccountNumber(acc.accountNumber)}
                </span>
              </div>
              <p
                className="font-mono text-base font-bold text-foreground tabular-nums"
                translate="no"
              >
                {formatCurrency(acc.availableBalance, acc.currency)}
              </p>
            </button>
          );
        })}
      </div>
    );
  }
);