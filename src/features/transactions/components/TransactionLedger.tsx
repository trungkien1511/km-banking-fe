import React, { useMemo } from "react";
import { Receipt } from "@phosphor-icons/react";
import { formatDateGroup } from "@/lib/format";
import { TransactionRow } from "./TransactionRow";
import { SkeletonLedger } from "./SkeletonLedger";
import type { Transaction } from "@/features/dashboard/types/dashboard.types";

interface TransactionLedgerProps {
  transactions: Transaction[];
  onSelectTransaction: (txn: Transaction) => void;
  isLoading: boolean;
  onClearFilters?: () => void;
}

function groupByDate(transactions: Transaction[]) {
  const map = new Map<string, Transaction[]>();
  for (const txn of transactions) {
    const label = formatDateGroup(txn.createdAt);
    const list = map.get(label);
    if (list) {
      list.push(txn);
    } else {
      map.set(label, [txn]);
    }
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({
  transactions,
  onSelectTransaction,
  isLoading,
  onClearFilters,
}) => {
  const groups = useMemo(() => groupByDate(transactions), [transactions]);

  if (isLoading) {
    return <SkeletonLedger />;
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
          <Receipt size={24} aria-hidden="true" />
        </div>
        <p className="text-base font-semibold text-foreground">No transactions found</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          There are no transactions recorded for this period or matching your filters.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-fg text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div id="transaction-ledger-panel" className="space-y-4">
      {groups.map(({ label, items }) => (
        <section key={label} aria-labelledby={`date-header-${label}`}>
          <p
            id={`date-header-${label}`}
            className="px-1 mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {label}
          </p>
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            {items.map((txn) => (
              <TransactionRow
                key={txn.id}
                transaction={txn}
                onClick={() => onSelectTransaction(txn)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};