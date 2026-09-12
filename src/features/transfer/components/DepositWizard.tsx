import React, { useCallback, useId, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { useAccounts } from "@/features/dashboard/store/dashboard-store";
import { useDepositMutation } from "../hooks/useTransferMutation";
import { AccountSelector } from "./AccountSelector";
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
import { VndCurrencyInput } from "./VndCurrencyInput";

// Static schema hoisted to module scope (rerender-memo: no rebuild per render).
const depositSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than zero"),
  description: z
    .string()
    .max(255, "Description must be 255 characters or less")
    .optional(),
});

export const DepositWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);

  const accounts = useAccounts();
  const depositMut = useDepositMutation();
  const inputId = useId();

  type DepositForm = z.infer<typeof depositSchema>;

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
    reset: resetForm,
  } = useForm<DepositForm>({
    resolver: zodResolver(depositSchema) as Resolver<DepositForm>,
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
    if (!selectedAccount || depositMut.isPending) return;
    setServerError(null);
    const values = getValues();
    depositMut.mutate(
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
              "Failed to process deposit. Please try again.",
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
        operationType="deposit"
        onNewTransaction={handleReset}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto py-4">
      {serverError && (
        <Alert
          variant="danger"
          title="Deposit Failed"
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
                fieldError={errors.amount?.message}
                disabled={depositMut.isPending}
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
                  placeholder="Enter deposit note"
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
                Review Deposit
              </Button>
            </form>
          )}
        </div>
      )}

      {step === 2 && selectedAccount && (
        <div className="space-y-6 animate-fade-slide-up">
          <h3 className="text-lg font-semibold text-foreground">
            Review Deposit Details
          </h3>

          <Card className="p-5 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Deposit to</span>
              <span className="font-semibold text-foreground">
                {selectedAccount.accountType === "PRIMARY"
                  ? "Primary Account"
                  : "Savings"}{" "}
                ({selectedAccount.accountNumber})
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
              disabled={depositMut.isPending}
              className="w-1/3"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              isLoading={depositMut.isPending}
              disabled={depositMut.isPending}
              className="w-2/3"
            >
              {depositMut.isPending ? "Depositing…" : "Confirm Deposit"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
