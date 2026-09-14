import React from "react";
import { Link } from "react-router-dom";
import { useAccounts } from "@/features/dashboard/store/dashboard-store";
import { AccountCard } from "@/features/dashboard/components/AccountCard";

export const AccountsSection = React.memo(function AccountsSection() {
  const accounts = useAccounts();

  return (
    <section aria-labelledby="accounts-heading">
      <div className="mb-3 flex items-center justify-between">
        <h2
          id="accounts-heading"
          className="text-sm font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Accounts
        </h2>
        <Link
          to="/accounts"
          className="
            text-sm font-medium text-muted-foreground
            underline underline-offset-2 decoration-foreground/20
            hover:decoration-foreground/60 hover:text-foreground
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-ring/40 rounded
          "
        >
          View all
        </Link>
      </div>

      {accounts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">No accounts yet.</p>
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
