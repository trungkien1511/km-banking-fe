import React from "react";
import { Link } from "react-router-dom";
import { BookmarkSimple, CaretRight, CheckCircle, CopySimple, Printer } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Transaction } from "@/features/dashboard/types/dashboard.types";
import { useSaveBeneficiary } from "../hooks/useBeneficiaries";
import { printReceipt } from "../utils/receipt-print";

// Human-readable status labels — mirrors TransactionCard to stay consistent.
const STATUS_LABEL: Record<Transaction["status"], string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

// Badge variant per status — text + color, never color alone (WCAG 1.4.1).
const STATUS_BADGE_VARIANT: Record<
  Transaction["status"],
  React.ComponentProps<typeof Badge>["variant"]
> = {
  PENDING: "warning",
  COMPLETED: "success",
  FAILED: "danger",
  CANCELLED: "default",
};

interface TransactionReceiptProps {
  transaction: Transaction;
  operationType: "transfer" | "deposit" | "withdrawal";
  onNewTransaction: () => void;
  destinationAccountNumber?: string;
}

export const TransactionReceipt: React.FC<TransactionReceiptProps> = ({
  transaction,
  operationType,
  onNewTransaction,
  destinationAccountNumber,
}) => {
  const saveBeneficiaryMut = useSaveBeneficiary();
  const [beneficiarySaved, setBeneficiarySaved] = React.useState(false);
  const [namingBeneficiary, setNamingBeneficiary] = React.useState(false);
  const [beneficiaryName, setBeneficiaryName] = React.useState("");

  const handleSaveBeneficiary = () => {
    const displayName = beneficiaryName.trim() || destinationAccountNumber || "";
    saveBeneficiaryMut.mutate(
      { accountNumber: destinationAccountNumber || "", displayName },
      {
        onSuccess: () => {
          setBeneficiarySaved(true);
          setNamingBeneficiary(false);
          toast.success("Beneficiary saved");
        },
        onError: () => toast.error("Could not save beneficiary"),
      },
    );
  };

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
            {formatCurrency(transaction.amount, transaction.currency)}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-sm text-muted-foreground">Reference No.</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(transaction.referenceNumber).then(() => {
                toast.success("Reference number copied");
              }).catch(() => {
                toast.error("Could not copy");
              });
            }}
            className="flex items-center gap-1.5 font-mono font-medium text-foreground hover:text-primary transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            aria-label={`Copy reference number ${transaction.referenceNumber}`}
          >
            <span translate="no">{transaction.referenceNumber}</span>
            <CopySimple
              size={14}
              weight="bold"
              className="text-muted-foreground group-hover:text-primary transition-colors"
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge variant={STATUS_BADGE_VARIANT[transaction.status]}>
            {STATUS_LABEL[transaction.status]}
          </Badge>
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
            {formatDateTime(transaction.createdAt)}
          </span>
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          className="w-full justify-center"
          onClick={() => printReceipt(transaction, operationType)}
        >
          <Printer size={16} weight="bold" aria-hidden="true" />
          Print / Download receipt
        </Button>
        {operationType === "transfer" &&
          destinationAccountNumber &&
          !beneficiarySaved &&
          !namingBeneficiary && (
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => setNamingBeneficiary(true)}
            >
              <BookmarkSimple size={16} weight="bold" aria-hidden="true" />
              Save beneficiary
            </Button>
          )}
        {operationType === "transfer" &&
          destinationAccountNumber &&
          !beneficiarySaved &&
          namingBeneficiary && (
            <Card className="p-4 space-y-3 text-left">
              <label
                htmlFor="beneficiary-name"
                className="block text-sm font-medium text-muted-foreground"
              >
                Name this beneficiary
              </label>
              <Input
                id="beneficiary-name"
                type="text"
                placeholder="e.g. Mom, Company ABC"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                autoFocus
                autoComplete="off"
              />
              <p className="text-sm text-muted-foreground" translate="no">
                {destinationAccountNumber}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-1/3 justify-center"
                  onClick={() => {
                    setNamingBeneficiary(false);
                    setBeneficiaryName("");
                  }}
                  disabled={saveBeneficiaryMut.isPending}
                >
                  Cancel
                </Button>
                <Button
                  className="w-2/3 justify-center"
                  isLoading={saveBeneficiaryMut.isPending}
                  onClick={handleSaveBeneficiary}
                >
                  <BookmarkSimple size={16} weight="bold" aria-hidden="true" />
                  Save
                </Button>
              </div>
            </Card>
          )}
        {beneficiarySaved && (
          <p className="text-sm text-center text-success font-medium">
            Beneficiary saved
          </p>
        )}
        <Button onClick={onNewTransaction} className="w-full justify-center">
          New transaction
        </Button>
        <Link
          to="/dashboard"
          className="flex items-center justify-center gap-1 py-2 text-sm font-semibold text-primary hover:text-primary-hover transition-all duration-200 hover:gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          Back to Home <CaretRight size={16} weight="bold" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};
