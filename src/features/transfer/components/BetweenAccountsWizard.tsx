import React, { useState, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { ArrowsLeftRight, CaretDown } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAccounts } from "@/features/dashboard/store/dashboard-store";
import { useTransferMutation } from "../hooks/useTransferMutation";
import { VndCurrencyInput } from "./VndCurrencyInput";
import { TransactionReceipt } from "./TransactionReceipt";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { formatCurrency } from "@/lib/format";
import type { Account, Transaction } from "@/features/dashboard/types/dashboard.types";
import type { ApiError } from "@/services/api-client";

const ACCOUNT_TYPE_LABEL: Record<Account["accountType"], string> = {
  PRIMARY: "Primary Account",
  SAVINGS: "Savings Account",
  CHECKING: "Checking Account",
};

const accountLabel = (account: Account) =>
  `${ACCOUNT_TYPE_LABEL[account.accountType]} (${account.accountNumber})`;

type BetweenForm = { amount: number };

export const BetweenAccountsWizard: React.FC = () => {
  const accounts = useAccounts();
  const activeAccounts = useMemo(
    () => accounts.filter((a) => a.status === "ACTIVE"),
    [accounts],
  );

  const [step, setStep] = useState<1 | 2>(1);
  const [fromId, setFromId] = useState<string>("");
  const [toId, setToId] = useState<string>("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);
  const transferMut = useTransferMutation();

  // Seed defaults once accounts are loaded — first two ACTIVE accounts.
  const fromAccount: Account | undefined =
    activeAccounts.find((a) => a.id === fromId) ?? activeAccounts[0];
  const toAccount: Account | undefined =
    activeAccounts.find((a) => a.id === toId && a.id !== fromAccount?.id) ??
    activeAccounts.find((a) => a.id !== fromAccount?.id);

  // Memoized — refine depends on the selected source account's balance.
  const schema = useMemo(
    () =>
      z.object({
        amount: z
          .number({ error: "Please enter an amount" })
          .min(1, "Minimum amount is 1 ₫"),
      }).refine(
        (data) => !fromAccount || data.amount <= fromAccount.availableBalance,
        { message: "Amount exceeds available balance", path: ["amount"] },
      ),
    [fromAccount],
  );

  const { handleSubmit, watch, setValue, getValues, formState: { errors, isValid }, reset } =
    useForm<BetweenForm>({
      resolver: zodResolver(schema) as import("react-hook-form").Resolver<BetweenForm>,
      mode: "onChange",
    });

  const handleSwap = useCallback(() => {
    if (!fromAccount || !toAccount) return;
    setFromId(toAccount.id);
    setToId(fromAccount.id);
  }, [fromAccount, toAccount]);

  const handleConfirm = () => {
    if (!fromAccount || !toAccount || transferMut.isPending) return;
    setServerError(null);
    const amount = Number(getValues("amount"));
    transferMut.mutate(
      {
        sourceAccountId: fromAccount.id,
        destinationAccountNumber: toAccount.accountNumber,
        amount,
        description: "Internal transfer",
        idempotencyKey: uuidv4(),
      },
      {
        onSuccess: (txn) => setCompletedTxn(txn),
        onError: (err: unknown) => {
          setStep(1);
          setServerError(
            (err as ApiError | null)?.formattedMessage ||
            "Transfer failed. Please try again."
          );
        },
      }
    );
  };

  const handleReset = () => {
    setStep(1);
    setCompletedTxn(null);
    setServerError(null);
    reset();
  };

  if (activeAccounts.length < 2) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        You need at least 2 ACTIVE accounts to use this feature.
      </p>
    );
  }

  if (completedTxn) {
    return (
      <TransactionReceipt
        transaction={completedTxn}
        operationType="transfer"
        onNewTransaction={handleReset}
      />
    );
  }

  if (!fromAccount || !toAccount) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto py-4 space-y-6">
      {serverError && (
        <Alert variant="danger" title="Transfer Failed" className="animate-error-in">
          {serverError}
        </Alert>
      )}

      {step === 1 && (
        <form
          onSubmit={handleSubmit(() => {
            setServerError(null);
            setStep(2);
          })}
          className="space-y-6 animate-fade-slide-up"
        >
          <div className="relative flex flex-col gap-3">
            {/* From account */}
            <Card className="p-4 relative">
              <label htmlFor="between-from" className="block text-sm text-muted-foreground uppercase font-semibold tracking-wide mb-2">
                From Account
              </label>
              <div className="relative flex items-center">
                <select
                  id="between-from"
                  value={fromAccount.id}
                  onChange={(e) => setFromId(e.target.value)}
                  disabled={transferMut.isPending}
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 pr-8 text-sm font-semibold text-foreground cursor-pointer appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
                  aria-label="Select source account"
                >
                  {activeAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id} className="bg-card text-foreground">
                      {accountLabel(acc)}
                    </option>
                  ))}
                </select>
                <CaretDown size={16} className="absolute right-3 pointer-events-none text-muted-foreground" aria-hidden="true" />
              </div>
              <p className="text-sm text-muted-foreground mt-2 font-mono tabular-nums" translate="no">
                Available: {formatCurrency(fromAccount.availableBalance, fromAccount.currency)}
              </p>
            </Card>

            {/* Swap button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <button
                type="button"
                onClick={handleSwap}
                disabled={transferMut.isPending || activeAccounts.length < 2}
                className="w-9 h-9 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Swap source and destination accounts"
              >
                <ArrowsLeftRight size={16} weight="bold" aria-hidden="true" />
              </button>
            </div>

            {/* To account */}
            <Card className="p-4 relative">
              <label htmlFor="between-to" className="block text-sm text-muted-foreground uppercase font-semibold tracking-wide mb-2">
                To Account
              </label>
              <div className="relative flex items-center">
                <select
                  id="between-to"
                  value={toAccount.id}
                  onChange={(e) => setToId(e.target.value)}
                  disabled={transferMut.isPending}
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 pr-8 text-sm font-semibold text-foreground cursor-pointer appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
                  aria-label="Select destination account"
                >
                  {activeAccounts
                    .filter((acc) => acc.id !== fromAccount.id)
                    .map((acc) => (
                      <option key={acc.id} value={acc.id} className="bg-card text-foreground">
                        {accountLabel(acc)}
                      </option>
                    ))}
                </select>
                <CaretDown size={16} className="absolute right-3 pointer-events-none text-muted-foreground" aria-hidden="true" />
              </div>
            </Card>
          </div>

          <VndCurrencyInput
            value={watch("amount")}
            onChange={(val) => setValue("amount", val as number, { shouldValidate: true })}
            max={fromAccount.availableBalance}
            fieldError={errors.amount?.message}
            disabled={transferMut.isPending}
            label="Amount (VND)"
          />

          <div className="space-y-1 text-sm text-muted-foreground border-t border-border pt-4">
            <div className="flex justify-between">
              <span>Transfer fee</span>
              <span className="text-success font-medium">0 ₫ (Free)</span>
            </div>
            <div className="flex justify-between">
              <span>Processing speed</span>
              <span className="text-success font-medium">Instant · 24/7</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isValid || transferMut.isPending}
            className="w-full"
          >
            Review Transfer
          </Button>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-fade-slide-up">
          <h3 className="text-lg font-semibold text-foreground">
            Review Transfer Details
          </h3>

          <Card className="p-5 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">From</span>
              <span className="font-semibold text-foreground text-right">
                {ACCOUNT_TYPE_LABEL[fromAccount.accountType]} <br />
                <span className="font-mono text-muted-foreground" translate="no">({fromAccount.accountNumber})</span>
              </span>
            </div>

            <div className="flex justify-between text-sm border-t border-border/60 pt-3">
              <span className="text-muted-foreground">To</span>
              <span className="font-semibold text-foreground text-right">
                {ACCOUNT_TYPE_LABEL[toAccount.accountType]} <br />
                <span className="font-mono text-muted-foreground" translate="no">({toAccount.accountNumber})</span>
              </span>
            </div>

            <div className="flex justify-between text-sm border-t border-border pt-3">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-mono font-bold text-lg text-primary tabular-nums" translate="no">
                {formatCurrency(Number(getValues("amount")), "VND")}
              </span>
            </div>

            <div className="flex justify-between text-sm border-t border-border/60 pt-3">
              <span className="text-muted-foreground">Fee</span>
              <span className="text-success font-semibold">0 ₫ (Free)</span>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              disabled={transferMut.isPending}
              className="w-1/3"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              isLoading={transferMut.isPending}
              disabled={transferMut.isPending}
              className="w-2/3"
            >
              {transferMut.isPending ? "Transferring…" : "Confirm Transfer"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};