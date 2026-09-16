import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/format";
import { formatAccountType } from "@/lib/labels";
import type { Account } from "@/features/dashboard/types/dashboard.types";

interface AccountSelectorProps {
  accounts: Account[];
  selectedAccountId?: string;
  onSelect: (account: Account) => void;
}

export const AccountSelector: React.FC<AccountSelectorProps> = React.memo(
  ({ accounts, selectedAccountId, onSelect }) => {
  return (
    <div
      className="space-y-3"
      role="radiogroup"
      aria-label="Select bank account"
    >
      {accounts.map((acc) => {
        const isSelected = acc.id === selectedAccountId;
        const isActive = acc.status === "ACTIVE";

        return (
          <Card
            key={acc.id}
            onClick={() => isActive && onSelect(acc)}
            onKeyDown={(e) => {
              if (isActive && (e.key === "Enter" || e.key === " ")) {
                if (e.key === " ") e.preventDefault();
                onSelect(acc);
              }
            }}
            tabIndex={isActive ? 0 : -1}
            className={cn(
              "p-4 flex justify-between items-center transition-all duration-200 select-none",
              isActive
                ? "cursor-pointer hover:bg-muted/40 active:scale-[0.99]"
                : "opacity-40 cursor-not-allowed",
              isSelected &&
                isActive &&
                "ring-2 ring-primary border-transparent bg-muted/40",
            )}
            role="radio"
            aria-checked={isSelected}
            aria-disabled={!isActive}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {formatAccountType(acc.accountType)}
                </span>
                <Badge variant={isActive ? "success" : "danger"}>
                  {acc.status}
                </Badge>
              </div>
              <span className="text-sm font-mono text-muted-foreground">
                {acc.accountNumber}
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-foreground" translate="no">
                {formatCurrency(acc.availableBalance, acc.currency)}
              </div>
              <span className="text-sm text-muted-foreground">Available Balance</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
  },
);
