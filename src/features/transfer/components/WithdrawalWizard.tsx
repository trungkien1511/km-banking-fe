import React, { useCallback, useId, useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { useAccounts } from "@/features/dashboard/store/dashboard-store";
import { useWithdrawalMutation } from "../hooks/useTransferMutation";
import { AccountSelector } from "./AccountSelector";
import { VndCurrencyInput } from "./VndCurrencyInput";
import { TransactionReceipt } from "./TransactionReceipt";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { FormErrorMessage } from "@/components/ui/FormErrorMessage";
import type {
  Account,
  Transaction,
} from "@/features/dashboard/types/dashboard.types";
import type { ApiError } from "@/services/api-client";

export const WithdrawalWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);

  const accounts = useAccounts();
  const withdrawMut = useWithdrawalMutation();
  const inputId = useId();

  // Memoized — refine depends on selectedAccount (rerender-memo: no rebuild per render).
  const withdrawSchema = useMemo(
    () =>
      z
        .object({
          amount: z.number().min(0.01, "Amount must be greater than zero"),
          description: z
            .string()
            .max(255, "Description must be 255 characters or less")
            .optional(),
        })
        .refine(
          (data) => {
            if (!selectedAccount) return true;
            return data.amount <= selectedAccount.availableBalance;
          },
          { message: "Amount exceeds available balance", path: ["amount"] },
        ),
    [selectedAccount],
  );

  type WithdrawForm = z.infer<typeof withdrawSchema>;

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
    reset: resetForm,
  } = useForm<WithdrawForm>({
    resolver: zodResolver(withdrawSchema) as Resolver<WithdrawForm>,
    mode: "onChange",
    defaultValues: { amount: undefined, description: "" },
  });

  const handleSelectAccount = useCallback(
    (acc: Account) => {
      setSelectedAccount(acc);
      trigger("amount");
    },
    [trigger],
  );

  const handleConfirm = () => {
    if (!selectedAccount || withdrawMut.isPending) return;
    setServerError(null);
    const values = getValues();
    withdrawMut.mutate(
      {
        accountId: selectedAccount.id,
        amount: Number(values.amount),
        description: values.description || undefined,
        idempotencyKey: uuidv4(), // Generate UUID client-side for idempotency
      },
      {
        onSuccess: (data) => setCompletedTxn(data),
        onError: (err: unknown) => {
          setStep(1);
          setServerError(
            (err as ApiError | null)?.formattedMessage ||
              "Failed to process withdrawal. Please try again.",
          );
        },
      },
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
        operationType="withdrawal"
        onNewTransaction={handleReset}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto py-4">
      {serverError && (
        <Alert
          variant="danger"
          title="Withdrawal Failed"
          className="mb-4 animate-error-in"
        >
          {serverError}
        </Alert>
      )}

      {step === 1 && (
        <div className="space-y-6 animate-fade-slide-up">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Select Account
            </h3>
            <AccountSelector
              accounts={accounts}
              selectedAccountId={selectedAccount?.id}
              onSelect={handleSelectAccount}
            />
          </div>

          {selectedAccount && (
            <form
              onSubmit={handleSubmit(() => {
                setServerError(null);
                setStep(2);
              })}
              className="space-y-4 pt-2"
            >
              <VndCurrencyInput
                value={watch("amount")}
                onChange={(val) => setValue("amount", val as number, { shouldValidate: true })}
                max={selectedAccount?.availableBalance}
                fieldError={errors.amount?.message}
                disabled={withdrawMut.isPending}
              />

              <div className="space-y-1">
                <label
                  htmlFor={`${inputId}-desc`}
                  className="text-sm font-medium text-muted-foreground"
                >
                  Note{" "}
                  <span className="text-subtle-foreground font-normal">
                    (Optional)
                  </span>
                </label>
                <Input
                  id={`${inputId}-desc`}
                  type="text"
                  placeholder="Enter withdrawal note"
                  error={!!errors.description}
                  aria-describedby={
                    errors.description ? `${inputId}-desc-err` : undefined
                  }
                  {...register("description")}
                />
                {errors.description && (
                  <FormErrorMessage
                    id={`${inputId}-desc-err`}
                    message={errors.description.message}
                  />
                )}
              </div>

              <Button type="submit" disabled={!isValid} className="w-full">
                Review Withdrawal
              </Button>
            </form>
          )}
        </div>
      )}

      {step === 2 && selectedAccount && (
        <div className="space-y-6 animate-fade-slide-up">
          <h3 className="text-lg font-semibold text-foreground">
            Review Withdrawal Details
          </h3>

          <Card className="p-5 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Withdraw from</span>
              <span className="font-semibold text-foreground">
                {selectedAccount.accountType === "PRIMARY"
                  ? "Primary Account"
                  : "Savings"}{" "}
                (•••• {selectedAccount.accountNumber.slice(-4)})
              </span>
            </div>

            <div className="flex justify-between text-sm border-t border-border pt-4">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-mono font-bold text-lg text-primary tabular-nums">
                {Number(getValues("amount")).toLocaleString("vi-VN")} ₫
              </span>
            </div>

            {getValues("description") && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Note</span>
                <span className="text-muted-foreground max-w-[60%] text-right">
                  {getValues("description")}
                </span>
              </div>
            )}
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              disabled={withdrawMut.isPending}
              className="w-1/3"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              isLoading={withdrawMut.isPending}
              disabled={withdrawMut.isPending}
              className="w-2/3"
            >
              {withdrawMut.isPending ? "Withdrawing…" : "Confirm Withdrawal"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
