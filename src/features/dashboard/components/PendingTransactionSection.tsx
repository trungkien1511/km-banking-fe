import React from "react";
import { Link } from "react-router-dom";
import { usePendingTransactions } from "@/features/dashboard/store/dashboard-store";
import { TransactionCard } from "@/features/dashboard/components/TransactionCard";

export const PendingTransactionSection = React.memo(
  function PendingTransactionSection() {
    const pendingTransactions = usePendingTransactions();

    return pendingTransactions.length === 0 ? null : (
      <section aria-labelledby="pending-transactions-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2
            id="pending-transactions-heading"
            className="text-base font-semibold text-foreground"
          >
            Pending Transactions
          </h2>
          <Link
            to="/dashboard/pending"
            className="text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded"
          >
            View all pending
          </Link>
        </div>
        <div className="space-y-2">
          {pendingTransactions.map((txn) => (
            <TransactionCard key={txn.id} transaction={txn} />
          ))}
        </div>
      </section>
    );
  },
);
