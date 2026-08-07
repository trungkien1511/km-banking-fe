import React from 'react';
import { Link } from 'react-router-dom';
import { useAccounts } from '@/features/dashboard/store/dashboard-store';
import { AccountCard } from '@/features/dashboard/components/AccountCard';

export const AccountsSection = React.memo(function AccountsSection() {
  const accounts = useAccounts();

  return (
    <section aria-labelledby="accounts-heading">
      <div className="mb-3 flex items-center justify-between">
        <h2
          id="accounts-heading"
          className="text-xs font-semibold uppercase tracking-widest text-(--color-text-muted)"
        >
          Accounts
        </h2>
        <Link
          to="/accounts"
          className="
            text-xs font-medium text-(--color-text-muted)
            hover:text-(--color-text-secondary)
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-white/20 rounded
          "
        >
          View all
        </Link>
      </div>

      {accounts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/[0.08] px-4 py-10 text-center">
          <p className="text-sm text-(--color-text-muted)">No accounts yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      )}
    </section>
  );
});
