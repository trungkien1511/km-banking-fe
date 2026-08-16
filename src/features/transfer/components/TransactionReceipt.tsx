import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, CaretRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Transaction } from "@/features/dashboard/types/dashboard.types";

interface TransactionReceiptProps {
  transaction: Transaction;
  operationType: "transfer" | "deposit" | "withdrawal";
  onNewTransaction: () => void;
}

export const TransactionReceipt: React.FC<TransactionReceiptProps> = ({
  transaction,
  operationType,
  onNewTransaction,
}) => {
  return (
    <div className="animate-fade-slide-up text-center max-w-md mx-auto py-6">
      <div className="flex justify-center mb-4">
        <CheckCircle
          size={64}
          className="text-success drop-shadow-[0_0_12px_rgba(63,185,80,0.2)]"
          weight="fill"
          aria-hidden="true"
        />
      </div>

      <h2 className="text-2xl font-bold mb-1 text-foreground">
        {operationType === "transfer" ? "Transfer Successful" : operationType === "deposit" ? "Deposit Successful" : "Withdrawal Successful"}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Your transaction has been processed and logged in the system.
      </p>

      <Card className="p-5 mb-8 text-left space-y-4">
        <div className="flex justify-between border-b border-border/60 pb-3">
          <span className="text-sm text-muted-foreground">Amount</span>
          <span className="font-bold text-lg text-foreground font-mono tabular-nums" translate="no">
            {transaction.amount.toLocaleString("vi-VN")} {transaction.currency}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-sm text-muted-foreground">Reference No.</span>
          <span className="font-mono font-medium text-foreground" translate="no">
            {transaction.referenceNumber}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-sm text-muted-foreground">Status</span>
          <span className="font-semibold text-success">
            {transaction.status}
          </span>
        </div>

        {transaction.description && (
          <div className="flex justify-between text-sm">
            <span className="text-sm text-muted-foreground">Description</span>
            <span className="text-muted-foreground">
              {transaction.description}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-sm text-muted-foreground">Completed At</span>
          <span className="text-muted-foreground">
            {new Date(transaction.createdAt).toLocaleString("vi-VN")}
          </span>
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        <Button onClick={onNewTransaction} className="w-full justify-center">
          New Transaction
        </Button>
        <Link
          to="/dashboard"
          className="flex items-center justify-center gap-1 py-2 text-sm font-semibold text-primary hover:text-primary-hover transition-all duration-200 hover:gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          Go to Dashboard <CaretRight size={16} weight="bold" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};
