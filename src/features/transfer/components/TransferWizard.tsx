import React, { useId, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAccounts } from "@/features/dashboard/store/dashboard-store";
import { useTransferMutation } from "../hooks/useTransferMutation";
import { StepIndicator } from "./StepIndicator";
import { AccountSelector } from "./AccountSelector";
import { TransactionReceipt } from "./TransactionReceipt";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { FormErrorMessage } from "@/components/ui/FormErrorMessage";
import type { Account, Transaction } from "@/features/dashboard/types/dashboard.types";
import type { ApiError } from "@/services/api-client";

const STEPS = ["Source Account", "Transfer Details", "Confirm & Review"];

export const TransferWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);

  const accounts = useAccounts();
  const transferMut = useTransferMutation();
  const inputId = useId();

  const transferSchema = z.object({
    destinationAccountNumber: z.string().min(1, "Destination account number is required"),
    amount: z.coerce.number().min(0.01, "Amount must be greater than zero"),
    description: z.string().max(255, "Description must be 255 characters or less").optional(),
  }).refine(
    (data) => {
      if (!selectedAccount) return true;
      return data.amount <= selectedAccount.availableBalance;
    },
    { message: "Amount exceeds available balance", path: ["amount"] }
  );

  type TransferForm = z.infer<typeof transferSchema>;

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isValid },
    reset: resetForm,
  } = useForm<TransferForm>({
    resolver: zodResolver(transferSchema) as Resolver<TransferForm>,
    mode: "onChange",
    defaultValues: {
      destinationAccountNumber: "",
      amount: undefined,
      description: "",
    },
  });

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
    setStep(2);
    trigger("amount");
  };

  const handleConfirm = () => {
    if (!selectedAccount || transferMut.isPending) return;
    setServerError(null);

    const values = getValues();
    transferMut.mutate(
      {
        sourceAccountId: selectedAccount.id,
        destinationAccountNumber: values.destinationAccountNumber,
        amount: Number(values.amount),
        description: values.description || undefined,
      },
      {
        onSuccess: (data) => setCompletedTxn(data),
        onError: (err: unknown) => {
          setStep(2);
          setServerError(
            (err as ApiError | null)?.formattedMessage ||
            "Failed to execute transfer. Please try again."
          );
        },
      }
    );
  };

  const handleReset = () => {
    setStep(1);
    setSelectedAccount(null);
    setCompletedTxn(null);
    setServerError(null);
    resetForm();
  };

  if (completedTxn) {
    return (
      <TransactionReceipt
        transaction={completedTxn}
        operationType="transfer"
        onNewTransaction={handleReset}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto py-4">
      <StepIndicator currentStep={step} totalSteps={3} labels={STEPS} />

      {serverError && (
        <Alert variant="danger" title="Transfer Failed" className="mb-4 animate-error-in">
          {serverError}
        </Alert>
      )}

      {/* ── Step 1: Source Account ── */}
      {step === 1 && (
        <div className="animate-fade-slide-up">
          <h3 className="text-lg font-semibold mb-3 text-(--color-foreground)">
            Choose Source Account
          </h3>
          <AccountSelector
            accounts={accounts}
            selectedAccountId={selectedAccount?.id}
            onSelect={handleSelectAccount}
          />
        </div>
      )}

      {/* ── Step 2: Transfer Details ── */}
      {step === 2 && selectedAccount && (
        <form
          onSubmit={handleSubmit(() => { setServerError(null); setStep(3); })}
          className="space-y-4 animate-fade-slide-up"
        >
          {/* Source account summary */}
          <Card className="p-4 bg-(--color-muted)/30 border-(--color-border)/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-(--color-subtle-foreground) uppercase font-semibold tracking-wide">
                Source Account
              </span>
              <div className="font-mono text-sm text-(--color-foreground) mt-0.5">
                •••• {selectedAccount.accountNumber.slice(-4)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-(--color-primary) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring) rounded"
            >
              Change
            </button>
          </Card>

          {/* Recipient */}
          <div className="space-y-1">
            <label
              htmlFor={`${inputId}-dest`}
              className="text-sm font-medium text-(--color-muted-foreground)"
            >
              Recipient Account Number
            </label>
            <Input
              id={`${inputId}-dest`}
              type="text"
              placeholder="Enter recipient account number"
              error={!!errors.destinationAccountNumber}
              aria-describedby={errors.destinationAccountNumber ? `${inputId}-dest-err` : undefined}
              {...register("destinationAccountNumber")}
            />
            {errors.destinationAccountNumber && (
              <FormErrorMessage
                id={`${inputId}-dest-err`}
                message={errors.destinationAccountNumber.message}
              />
            )}
          </div>

          {/* Amount — font-mono + tabular-nums for financial input */}
          <div className="space-y-1">
            <div className="flex justify-between items-baseline">
              <label
                htmlFor={`${inputId}-amount`}
                className="text-sm font-medium text-(--color-muted-foreground)"
              >
                Amount (VND)
              </label>
              <span className="text-xs text-(--color-subtle-foreground)">
                Max: {selectedAccount.availableBalance.toLocaleString("vi-VN")} ₫
              </span>
            </div>
            <Input
              id={`${inputId}-amount`}
              type="number"
              step="1"
              placeholder="0"
              inputMode="numeric"
              className="font-mono tabular-nums"
              error={!!errors.amount}
              aria-describedby={errors.amount ? `${inputId}-amount-err` : undefined}
              {...register("amount")}
            />
            {errors.amount && (
              <FormErrorMessage
                id={`${inputId}-amount-err`}
                message={errors.amount.message}
              />
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label
              htmlFor={`${inputId}-desc`}
              className="text-sm font-medium text-(--color-muted-foreground)"
            >
              Description <span className="text-(--color-subtle-foreground) font-normal">(Optional)</span>
            </label>
            <Input
              id={`${inputId}-desc`}
              type="text"
              placeholder="Enter transfer note"
              error={!!errors.description}
              aria-describedby={errors.description ? `${inputId}-desc-err` : undefined}
              {...register("description")}
            />
            {errors.description && (
              <FormErrorMessage
                id={`${inputId}-desc-err`}
                message={errors.description.message}
              />
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="w-1/3"
            >
              Back
            </Button>
            <Button type="submit" disabled={!isValid} className="w-2/3">
              Continue
            </Button>
          </div>
        </form>
      )}

      {/* ── Step 3: Confirm & Review ── */}
      {step === 3 && selectedAccount && (
        <div className="space-y-6 animate-fade-slide-up">
          <h3 className="text-lg font-semibold text-(--color-foreground)">
            Review Details
          </h3>

          <Card className="p-5 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-(--color-muted-foreground)">From</span>
              <span className="font-semibold text-(--color-foreground)">
                {selectedAccount.accountType === "PRIMARY" ? "Primary Account" : "Savings"}
                {" "}(•••• {selectedAccount.accountNumber.slice(-4)})
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-(--color-muted-foreground)">To</span>
              <span className="font-mono text-(--color-foreground)">
                {getValues("destinationAccountNumber")}
              </span>
            </div>

            <div className="flex justify-between text-sm border-t border-(--color-border) pt-4">
              <span className="text-(--color-muted-foreground)">Amount</span>
              {/* Amount in confirm summary — font-mono tabular-nums per design system */}
              <span className="font-mono font-bold text-lg text-(--color-primary) tabular-nums">
                {Number(getValues("amount")).toLocaleString("vi-VN")} ₫
              </span>
            </div>

            {getValues("description") && (
              <div className="flex justify-between text-sm">
                <span className="text-(--color-muted-foreground)">Note</span>
                <span className="text-(--color-muted-foreground) max-w-[60%] text-right">
                  {getValues("description")}
                </span>
              </div>
            )}
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(2)}
              disabled={transferMut.isPending}
              className="w-1/3"
            >
              Back
            </Button>
            {/* isLoading prop — Button renders spinner + disables internally */}
            <Button
              type="button"
              onClick={handleConfirm}
              isLoading={transferMut.isPending}
              disabled={transferMut.isPending}
              className="w-2/3"
            >
              {transferMut.isPending ? "Confirming…" : "Confirm Transfer"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
