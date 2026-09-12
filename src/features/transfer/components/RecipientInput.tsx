import React, { useEffect, useId, useRef, useState } from "react";
import {
  CheckCircle,
  Warning,
  SpinnerGap,
  XCircle,
} from "@phosphor-icons/react";
import { transferApi } from "../api/transfer.api";
import type { RecipientLookup } from "../types/transfer.types";
import { Input } from "@/components/ui/Input";
import { FormErrorMessage } from "@/components/ui/FormErrorMessage";

type LookupState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "found"; recipient:Recipient Account Number
 RecipientLookup }
  | { phase: "self" } // typed their own account number
  | { phase: "not_found" }
  | { phase: "error"; message: string };

interface RecipientInputProps {
  /** Controlled value from react-hook-form */
  value: string;
  onChange: (value: string) => void;
  /** Validation error from react-hook-form */
  fieldError?: string;
  /** Called whenever recipient lookup resolves — null means cleared/not found/self */
  onRecipientResolved: (recipient: RecipientLookup | null) => void;
  /** Account numbers that belong to the current user — used for self-account detection */
  ownAccountNumbers?: string[];
  disabled?: boolean;
}

const DEBOUNCE_MS = 500;
const MIN_LOOKUP_LENGTH = 5;

export const RecipientInput: React.FC<RecipientInputProps> = ({
  value,
  onChange,
  fieldError,
  onRecipientResolved,
  ownAccountNumbers = [],
  disabled,
}) => {
  const [lookup, setLookup] = useState<LookupState>({ phase: "idle" });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputId = useId();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = value.trim();

    if (!trimmed || trimmed.length < MIN_LOOKUP_LENGTH) {
      setLookup({ phase: "idle" });
      onRecipientResolved(null);
      return;
    }

    // Self-account check — instant, no API call needed
    if (ownAccountNumbers.includes(trimmed)) {
      setLookup({ phase: "self" });
      onRecipientResolved(null);
      return;
    }

    setLookup({ phase: "loading" });

    debounceRef.current = setTimeout(async () => {
      try {
        const recipient = await transferApi.lookupRecipient(trimmed);
        setLookup({ phase: "found", recipient });
        onRecipientResolved(recipient);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response
          ?.status;
        if (status === 404) {
          setLookup({ phase: "not_found" });
          onRecipientResolved(null);
        } else {
          setLookup({
            phase: "error",
            message: "Unable to verify account. Please check the number.",
          });
          onRecipientResolved(null);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, ownAccountNumbers]);

  const isSelf = lookup.phase === "self";
  const isNonActive =
    lookup.phase === "found" && lookup.recipient.status !== "ACTIVE";

  // Any state that should block the Continue button — parent reads fieldError,
  // but we also need to signal "self" so the form stays invalid.
  // We do this by treating "self" the same as fieldError for the error border.
  const hasError = !!fieldError || isSelf;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-muted-foreground"
      >
        Recipient Account Number
      </label>

      <div className="relative">
        <Input
          id={inputId}
          type="text"
          placeholder="Enter recipient account number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          error={hasError}
          disabled={disabled}
          aria-describedby={
            [
              fieldError ? `${inputId}-field-err` : null,
              isSelf ? `${inputId}-self-err` : null,
              lookup.phase === "not_found" ? `${inputId}-not-found` : null,
              lookup.phase === "error" ? `${inputId}-lookup-err` : null,
              isNonActive ? `${inputId}-non-active` : null,
            ]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className="pr-9"
          autoComplete="off"
        />

        {/* Right-side status icon */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          {lookup.phase === "loading" && (
            <SpinnerGap
              size={16}
              weight="bold"
              className="animate-spin text-muted-foreground"
              aria-hidden="true"
            />
          )}
          {lookup.phase === "found" && !isNonActive && (
            <CheckCircle
              size={16}
              weight="fill"
              className="text-green-500"
              aria-hidden="true"
            />
          )}
          {isNonActive && (
            <Warning
              size={16}
              weight="fill"
              className="text-yellow-500"
              aria-hidden="true"
            />
          )}
          {(lookup.phase === "not_found" || isSelf) && (
            <XCircle
              size={16}
              weight="fill"
              className="text-destructive"
              aria-hidden="true"
            />
          )}
        </span>
      </div>

      {/* react-hook-form field error */}
      {fieldError && (
        <FormErrorMessage id={`${inputId}-field-err`} message={fieldError} />
      )}

      {/* Self-account error — shown inline, blocks progression */}
      {isSelf && (
        <p
          id={`${inputId}-self-err`}
          className="text-xs text-destructive font-medium"
          aria-live="polite"
        >
          Cannot transfer to your own account
        </p>
      )}

      {/* Verified recipient — full name, no masking */}
      {lookup.phase === "found" && !isNonActive && (
        <p
          id={`${inputId}-verified`}
          className="flex items-center gap-1 text-xs text-green-600 font-normal"
          aria-live="polite"
        >
          <CheckCircle size={13} weight="fill" aria-hidden="true" />
          {lookup.recipient.accountHolderName}
        </p>
      )}

      {/* Non-ACTIVE account warning */}
      {isNonActive && (
        <p
          id={`${inputId}-non-active`}
          className="flex items-center gap-1 text-xs text-yellow-600 font-medium"
          aria-live="polite"
        >
          <Warning size={13} weight="fill" aria-hidden="true" />
          {lookup.recipient.accountHolderName} · Account is{" "}
          {lookup.recipient.status.toLowerCase()} — transfers may fail
        </p>
      )}

      {/* Not found */}
      {lookup.phase === "not_found" && (
        <p
          id={`${inputId}-not-found`}
          className="text-xs text-destructive"
          aria-live="polite"
        >
          Account not found
        </p>
      )}

      {/* Network / unexpected error */}
      {lookup.phase === "error" && (
        <p
          id={`${inputId}-lookup-err`}
          className="text-xs text-muted-foreground"
          aria-live="polite"
        >
          {lookup.message}
        </p>
      )}
    </div>
  );
};
