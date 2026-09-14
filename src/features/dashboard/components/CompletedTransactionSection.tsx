import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useRecentTransactions } from "@/features/dashboard/store/dashboard-store";
import { TransactionCard } from "@/features/dashboard/components/TransactionCard";
import { formatDateGroup } from "@/lib/format";
import type { Transaction } from "@/features/dashboard/types/dashboard.types";

/** Groups an array of transactions by their date label (e.g. "Today"). */
function groupByDate(
  transactions: Transaction[],
): Array<{ label: string; items: Transaction[] }> {
  const map = new Map<string, Transaction[]>();

  for (const txn of transactions) {
    const label = formatDateGroup(txn.createdAt);
    const existing = map.get(label);
    if (existing) {
      existing.push(txn);
    } else {
      map.set(label, [txn]);
    }
  }

  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

export const CompletedTransactionSection = React.memo(
  function CompletedTransactionSection() {
    const transactions = useRecentTransactions();
    const groups = useMemo(() => groupByDate(transactions), [transactions]);

    return (
      <section aria-labelledby="recent-transactions-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2
            id="recent-transactions-heading"
            className="text-sm font-semibold uppercase tracking-widest text-muted-foreground"
          >
            Recent Transactions
          </h2>
          <Link
            to="/transactions"
            className="
              text-sm font-medium text-muted-foreground
              underline underline-offset-2 decoration-foreground/20
              hover:decoration-foreground/60 hover:text-foreground
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring/40 rounded
            "
          >
            View History
          </Link>
        </div>

        {groups.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No transactions yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map(({ label, items }) => (
              <div key={label}>
                {/* Date group header — smaller/lighter than section heading */}
                <p className="mb-1.5 px-1 text-sm font-medium text-muted-foreground">
                  {label}
                </p>
                <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
                  {items.map((txn) => (
                    <TransactionCard key={txn.id} transaction={txn} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  },
);