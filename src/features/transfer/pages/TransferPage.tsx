import React, { useState } from "react";
import { TransferWizard } from "../components/TransferWizard";
import { BetweenAccountsWizard } from "../components/BetweenAccountsWizard";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

type TabType = "transfer" | "between";

const TABS: { id: TabType; label: string }[] = [
  { id: "transfer", label: "Transfer" },
  { id: "between", label: "My Accounts" },
];

export const TransferPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("transfer");

  useDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title text-foreground mb-2">Move Money</h1>
        <p className="text-sm text-muted-foreground">
          Send money to another account or move funds between your own accounts.
        </p>
      </div>

      <div
        className="border-b border-border/60 flex gap-6"
        role="tablist"
        aria-label="Transaction Operations"
      >
        {TABS.map(({ id, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              role="tab"
              id={`tab-${id}`}
              aria-selected={isActive}
              aria-controls={`panel-${id}`}
              onClick={() => setActiveTab(id)}
              className={cn(
                "py-3 text-sm font-semibold border-b-2 transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Panels — both mounted, inactive panel is visually hidden via `hidden`.
          Mounting both avoids remounting the wizard on tab switch (preserves form state). */}
      <div className="mt-4">
        {TABS.map(({ id }) => (
          <div
            key={id}
            id={`panel-${id}`}
            role="tabpanel"
            aria-labelledby={`tab-${id}`}
            hidden={activeTab !== id}
          >
            {id === "transfer" && <TransferWizard />}
            {id === "between" && <BetweenAccountsWizard />}
          </div>
        ))}
      </div>
    </div>
  );
};
