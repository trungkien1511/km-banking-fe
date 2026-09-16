import React from "react";
import { useAccounts } from "@/features/dashboard/store/dashboard-store";
import { AccountCard } from "@/features/dashboard/components/AccountCard";
import { SectionHeader } from "@/components/shared/SectionHeader";

export const AccountsSection = React.memo(function AccountsSection() {
  const accounts = useAccounts();

  return (
    <section aria-labelledby="accounts-heading">
      <SectionHeader
        headingId="accounts-heading"
        title="Accounts"
        linkTo="/accounts"
        linkLabel="View all"
      />

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
