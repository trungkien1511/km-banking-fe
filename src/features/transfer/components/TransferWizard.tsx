import React, { useCallback, useId, useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { useAccounts } from "@/features/dashboard/store/dashboard-store";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useTransferMutation } from "../hooks/useTransferMutation";
import { StepIndicator } from "./StepIndicator";
import { AccountSelector } from "./AccountSelector";
import { RecipientInput } from "./RecipientInput";
import { RecentRecipientsList } from "./RecentRecipientsList";
import { VndCurrencyInput } from "./VndCurrencyInput";
import { TransactionReceipt } from "./TransactionReceipt";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { FormErrorMessage } from "@/components/ui/FormErrorMessage";
import { Input } from "@/components/ui/Input";
import type {
  Account,
  Transaction,
} from "@/features/dashboard/types/dashboard.types";
import type { RecipientLookup } from "../types/transfer.types";
import type { ApiError } from "@/services/api-client";

const STEPS = ["Source Account", "Transfer Details", "Confirm & Send"];

export const TransferWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);
  const [resolvedRecipient, setResolvedRecipient] =
    useState<RecipientLookup | null>(null);

  const accounts = useAccounts();
  const transferMut = useTransferMutation();
  const inputId = useId();

  const userFullName = useAuthStore((s) => s.user?.fullName);
  const defaultDescription = userFullName
    ? `${userFullName} is transferring money`
    : "";

  // All account numbers that belong to the current user — used to block self-transfers
  const ownAccountNumbers = React.useMemo(
    () => accounts.map((a) => a.accountNumber),
    [accounts],
  );

  // Auto-select the only active account — skips Step 1 for single-account users
  React.useEffect(() => {
    const active = accounts.filter((a) => a.status === "ACTIVE");
    if (active.length === 1 && selectedAccount === null) {
      setSelectedAccount(active[0]);
      setStep(2);
    }
  }, [accounts]);

  // Memoized — refine depends on selectedAccount (rerender-memo: no rebuild per render).
  const transferSchema = useMemo(
    () =>
      z
        .object({
          destinationAccountNumber: z
            .string()
            .min(1, "Please enter recipient account number"),
          amount: z
            .number({ error: "Please enter an amount" })
            .min(0.01, "Amount must be greater than 0"),
          description: z.string().optional(),
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

  type TransferForm = z.infer<typeof transferSchema>;

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
    reset: resetForm,
  } = useForm<TransferForm>({
    resolver: zodResolver(transferSchema) as Resolver<TransferForm>,
    mode: "onSubmit",
    defaultValues: {
      destinationAccountNumber: "",
      amount: undefined,
      description: defaultDescription,
    },
  });

  const handleSelectAccount = useCallback((account: Account) => {
    setSelectedAccount(account);
    setStep(2);
  }, []);

  const handleRecipientResolved = useCallback(
    (recipient: RecipientLookup | null) => {
      setResolvedRecipient(recipient);
    },
    [],
  );

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
        idempotencyKey: uuidv4(), // Generate UUID client-side for idempotency
      },
      {
        onSuccess: (data) => setCompletedTxn(data),
        onError: (err: unknown) => {
          setStep(2);
          setServerError(
            (err as ApiError | null)?.formattedMessage ||
              "Failed to execute transfer. Please try again.",
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
    setResolvedRecipient(null);
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
        <Alert
          variant="danger"
          title="Transfer Failed"
          className="mb-4 animate-error-in"
        >
          {serverError}
        </Alert>
      )}

      {step === 1 && (
        <div className="animate-fade-slide-up">
          <h3 className="text-lg font-semibold mb-3 text-foreground">
            Choose Source Account
          </h3>
          <AccountSelector
            accounts={accounts}
            selectedAccountId={selectedAccount?.id}
            onSelect={handleSelectAccount}
          />
        </div>
      )}

      {step === 2 && selectedAccount && (
        <form
          onSubmit={handleSubmit(() => {
            setServerError(null);
            setStep(3);
          })}
          className="space-y-4 animate-fade-slide-up"
        >
          <Card className="p-4 bg-muted/30 border-border/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-subtle-foreground uppercase font-semibold tracking-wide">
                Source Account
              </span>
              <div
                className="font-mono text-sm text-foreground mt-0.5"
                translate="no"
              >
                {selectedAccount.accountNumber}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Change
            </button>
          </Card>

          <RecentRecipientsList
            onSelect={(accountNumber) => {
              setValue("destinationAccountNumber", accountNumber, {
                shouldValidate: true,
              });
            }}
          />

          <RecipientInput
            value={getValues("destinationAccountNumber")}
            onChange={(val) => {
              setValue("destinationAccountNumber", val, {
                shouldValidate: true,
              });
            }}
            fieldError={errors.destinationAccountNumber?.message}
            onRecipientResolved={handleRecipientResolved}
            ownAccountNumbers={ownAccountNumbers}
            disabled={transferMut.isPending}
          />

          <VndCurrencyInput
            value={watch("amount")}
            onChange={(val) =>
              setValue("amount", val as number, { shouldValidate: true })
            }
            max={selectedAccount.availableBalance}
            fieldError={errors.amount?.message}
            disabled={transferMut.isPending}
          />

          <div className="space-y-1">
            <label
              htmlFor={`${inputId}-desc`}
              className="text-sm font-medium text-muted-foreground"
            >
              Description{" "}
            </label>
            <Input
              id={`${inputId}-desc`}
              type="text"
              placeholder="Enter transfer note"
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

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="w-1/3"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={ownAccountNumbers.includes(
                watch("destinationAccountNumber")?.trim() ?? "",
              )}
              className="w-2/3"
            >
              Continue
            </Button>
          </div>
        </form>
      )}

      {step === 3 && selectedAccount && (
        <div className="space-y-6 animate-fade-slide-up">
          <h3 className="text-lg font-semibold text-foreground">
            Review Details
          </h3>

          <Card className="p-5 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">From</span>
              <span className="font-semibold text-foreground">
                {selectedAccount.accountType === "PRIMARY"
                  ? "Primary Account"
                  : "Savings"}{" "}
                ({selectedAccount.accountNumber})
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">To</span>
              <div className="text-right">
                <span className="font-mono text-foreground">
                  {getValues("destinationAccountNumber")}
                </span>
                {resolvedRecipient && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {resolvedRecipient.accountHolderName} · KM Bank
                  </p>
                )}
              </div>
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
