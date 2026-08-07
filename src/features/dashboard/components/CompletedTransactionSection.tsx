import React from 'react';
import { Link } from 'react-router-dom';
import { useRecentTransactions } from '@/features/dashboard/store/dashboard-store';
import { TransactionCard } from '@/features/dashboard/components/TransactionCard';

export const CompletedTransactionSection = React.memo(
  function CompletedTransactionSection() {
    const transactions = useRecentTransactions();

    return (
      <section aria-labelledby="recent-transactions-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2
            id="recent-transactions-heading"
            className="text-xs font-semibold uppercase tracking-widest text-(--color-text-muted)"
          >
            Recent transactions
          </h2>
          <Link
            to="/dashboard/history"
            className="
              text-xs font-medium text-(--color-text-muted)
              hover:text-(--color-text-secondary)
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-white/20 rounded
            "
          >
            View history
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/[0.08] px-4 py-10 text-center">
            <p className="text-sm text-(--color-text-muted)">No transactions yet.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.06] bg-(--color-card) overflow-hidden">
            {transactions.map((txn) => (
              <TransactionCard key={txn.id} transaction={txn} />
            ))}
          </div>
        )}
      </section>
    );
  },
);
