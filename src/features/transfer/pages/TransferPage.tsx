import React, { Activity, useState } from "react";
import { TransferWizard } from "../components/TransferWizard";
import { DepositWizard } from "../components/DepositWizard";
import { WithdrawalWizard } from "../components/WithdrawalWizard";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

type TabType = "transfer" | "deposit" | "withdrawal";

export const TransferPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("transfer");

  useDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title text-foreground mb-2">Move Money</h1>
        <p className="text-sm text-muted-foreground">
          Transfer funds to another account or run mock deposits & withdrawals
          for testing.
        </p>
      </div>

      <div
        className="border-b border-border/60 flex gap-6"
        role="tablist"
        aria-label="Transaction Operations"
      >
        {(["transfer", "deposit", "withdrawal"] as TabType[]).map((tab) => {
          const isActive = activeTab === tab;
          const label =
            tab === "transfer"
              ? "Internal Transfer"
              : tab === "deposit"
                ? "Mock Deposit"
                : "Mock Withdrawal";

          return (
            <button
              key={tab}
              role="tab"
              id={`tab-${tab}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "py-3 text-sm font-semibold border-b-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
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

      <div className="mt-4">
        {(["transfer", "deposit", "withdrawal"] as TabType[]).map((tab) => (
          <Activity
            key={tab}
            mode={activeTab === tab ? "visible" : "hidden"}
            name={`wizard-panel-${tab}`}
          >
            <div
              id={`panel-${tab}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab}`}
            >
              {tab === "transfer" && <TransferWizard />}
              {tab === "deposit" && <DepositWizard />}
              {tab === "withdrawal" && <WithdrawalWizard />}
            </div>
          </Activity>
        ))}
      </div>
    </div>
  );
};
