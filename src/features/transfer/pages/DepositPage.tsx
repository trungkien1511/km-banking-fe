import React from "react";
import { DepositWizard } from "../components/DepositWizard";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

export const DepositPage: React.FC = () => {
  useDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title text-foreground mb-2">Deposit</h1>
        <p className="text-sm text-muted-foreground">
          Add funds to your own account.
        </p>
      </div>

      <DepositWizard />
    </div>
  );
};