import React, { useState, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { ArrowsLeftRight } from "@phosphor-icons/react";
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

  const { handleSubmit, watch, setValue, formState: { errors, isValid }, reset } =
    useForm<BetweenForm>({
      resolver: zodResolver(schema) as import("react-hook-form").Resolver<BetweenForm>,
      mode: "onChange",
    });

  const handleSwap = useCallback(() => {
    if (!fromAccount || !toAccount) return;
    setFromId(toAccount.id);
    setToId(fromAccount.id);
  }, [fromAccount, toAccount]);

  const onSubmit = (data: BetweenForm) => {
    if (!fromAccount || !toAccount || transferMut.isPending) return;
    setServerError(null);
    transferMut.mutate(
      {
        sourceAccountId: fromAccount.id,
        destinationAccountNumber: toAccount.accountNumber,
        amount: data.amount,
        description: "Internal transfer",
        idempotencyKey: uuidv4(),
      },
      {
        onSuccess: (txn) => setCompletedTxn(txn),
        onError: (err: unknown) => {
          setServerError(
            (err as ApiError | null)?.formattedMessage ||
            "Transfer failed. Please try again."
          );
        },
      }
    );
  };

  const handleReset = () => {
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

      <div className="relative flex flex-col gap-3">
        {/* From account */}
        <Card className="p-4">
          <label htmlFor="between-from" className="block text-xs text-subtle-foreground uppercase font-semibold tracking-wide mb-2">
            From
          </label>
          <select
            id="between-from"
            value={fromAccount.id}
            onChange={(e) => setFromId(e.target.value)}
            disabled={transferMut.isPending}
            className="w-full bg-transparent border-none outline-none cursor-pointer appearance-none text-sm font-semibold text-foreground disabled:opacity-40"
            aria-label="Select source account"
          >
            {activeAccounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {accountLabel(acc)}
              </option>
            ))}
          </select>
          <p className="font-mono text-sm text-muted-foreground mt-1" translate="no">
            {fromAccount.accountNumber}
          </p>
          <p className="text-xs text-muted-foreground mt-1" translate="no">
            Available: {fromAccount.availableBalance.toLocaleString("vi-VN")} ₫
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
        <Card className="p-4">
          <label htmlFor="between-to" className="block text-xs text-subtle-foreground uppercase font-semibold tracking-wide mb-2">
            To
          </label>
          <select
            id="between-to"
            value={toAccount.id}
            onChange={(e) => setToId(e.target.value)}
            disabled={transferMut.isPending}
            className="w-full bg-transparent border-none outline-none cursor-pointer appearance-none text-sm font-semibold text-foreground disabled:opacity-40"
            aria-label="Select destination account"
          >
            {activeAccounts
              .filter((acc) => acc.id !== fromAccount.id)
              .map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {accountLabel(acc)}
                </option>
              ))}
          </select>
          <p className="font-mono text-sm text-muted-foreground mt-1" translate="no">
            {toAccount.accountNumber}
          </p>
        </Card>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <span className="text-green-600 font-medium">0 ₫ (Free)</span>
          </div>
          <div className="flex justify-between">
            <span>Processing speed</span>
            <span className="text-green-600 font-medium">Instant · 24/7</span>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={transferMut.isPending}
          disabled={!isValid || transferMut.isPending}
          className="w-full"
        >
          {transferMut.isPending ? "Processing…" : "Confirm transfer"}
        </Button>
      </form>
    </div>
  );
};