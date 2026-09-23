import React, { useEffect, useRef } from "react";
import {
  X,
  CopySimple,
  Printer,
  CheckCircle,
  Clock,
  WarningCircle,
  ShieldCheck,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { printReceipt } from "@/features/transfer/utils/receipt-print";
import { Card } from "@/components/ui/Card";
import type { Transaction } from "@/features/dashboard/types/dashboard.types";

interface TransactionDetailDrawerProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionDetailDrawer: React.FC<TransactionDetailDrawerProps> = ({
  transaction,
  onClose,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!transaction) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [transaction, onClose]);

  if (!transaction) return null;

  const isIncoming = transaction.direction === "IN";

  const handleCopyRef = () => {
    navigator.clipboard
      .writeText(transaction.referenceNumber)
      .then(() => toast.success("Reference number copied to clipboard"))
      .catch(() => toast.error("Could not copy reference number"));
  };

  const handlePrint = () => {
    printReceipt(transaction, "transfer");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="relative z-10 w-full max-w-md bg-card border-l border-border h-full flex flex-col shadow-2xl animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 id="drawer-title" className="text-base font-semibold text-foreground">
              Transaction Details
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              KM BANK · Core Banking Services
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close transaction details"
            className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 space-y-5">
          {/* Status & Amount Card */}
          <div className="text-center py-5 bg-muted/30 rounded-2xl border border-border/80">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full mb-2.5 bg-card border border-border shadow-xs">
              {transaction.status === "COMPLETED" ? (
                <CheckCircle size={28} className="text-success" weight="fill" />
              ) : transaction.status === "PENDING" ? (
                <Clock size={28} className="text-warning" weight="fill" />
              ) : (
                <WarningCircle size={28} className="text-destructive" weight="fill" />
              )}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {transaction.status}
            </p>
            <p
              className={cn(
                "font-mono text-2xl font-bold mt-1 tabular-nums",
                isIncoming ? "text-success" : "text-destructive"
              )}
              translate="no"
            >
              {isIncoming ? "+" : "-"}
              {formatCurrency(transaction.amount, transaction.currency)}
            </p>
          </div>

          {/* Details Card */}
          <Card className="divide-y divide-border/60 text-sm">
            <div className="flex items-center justify-between p-3.5">
              <span className="text-muted-foreground">Reference No.</span>
              <div className="flex items-center gap-1.5 font-mono font-medium text-foreground">
                <span translate="no">{transaction.referenceNumber}</span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  aria-label="Copy reference number"
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <CopySimple size={15} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5">
              <span className="text-muted-foreground">Channel</span>
              <span className="font-medium text-foreground">Digital Banking / Web</span>
            </div>

            <div className="flex items-center justify-between p-3.5">
              <span className="text-muted-foreground">Transaction Type</span>
              <span className="font-medium text-foreground">{transaction.transactionType}</span>
            </div>

            <div className="flex items-center justify-between p-3.5">
              <span className="text-muted-foreground">Execution Time</span>
              <span className="font-medium text-foreground">
                {formatDateTime(transaction.createdAt)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5">
              <span className="text-muted-foreground">Transfer Fee</span>
              <span className="text-success font-semibold">
                {transaction.fee === 0 ? "0 ₫ (Free)" : formatCurrency(transaction.fee, transaction.currency)}
              </span>
            </div>

            {transaction.description && (
              <div className="p-3.5 space-y-1">
                <span className="text-muted-foreground block text-xs uppercase font-medium tracking-wide">Note</span>
                <p className="text-foreground leading-relaxed bg-muted/40 p-2.5 rounded-lg text-sm">
                  {transaction.description}
                </p>
              </div>
            )}
          </Card>

          {/* Security & Audit Verification Banner */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-success/10 border border-success/20 text-success text-xs font-medium">
            <ShieldCheck size={20} weight="fill" className="shrink-0" aria-hidden="true" />
            <span>Verified & Settled via Core Banking Ledger</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-border bg-card">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full h-11 rounded-lg bg-primary text-primary-fg font-semibold flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <Printer size={18} aria-hidden="true" />
            Print Official Receipt
          </button>
        </div>
      </div>
    </div>
  );
};