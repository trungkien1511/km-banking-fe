import React, { useEffect, useId, useRef, useState } from "react";
import { CheckCircle, Warning, SpinnerGap, XCircle } from "@phosphor-icons/react";
import { transferApi } from "../api/transfer.api";
import type { RecipientLookup } from "../types/transfer.types";
import { Input } from "@/components/ui/Input";
import { FormErrorMessage } from "@/components/ui/FormErrorMessage";

type LookupState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "found"; recipient: RecipientLookup }
  | { phase: "not_found" }
  | { phase: "error"; message: string };

interface RecipientInputProps {
  /** Controlled value from react-hook-form */
  value: string;
  onChange: (value: string) => void;
  /** Validation error from react-hook-form */
  fieldError?: string;
  /** Called whenever recipient lookup resolves — null means cleared/not found */
  onRecipientResolved: (recipient: RecipientLookup | null) => void;
  disabled?: boolean;
}

const DEBOUNCE_MS = 500;
/** Minimum length before we fire a lookup — avoids spurious requests */
const MIN_LOOKUP_LENGTH = 5;

/**
 * Account number input with debounced real-time recipient verification.
 *
 * States:
 * - idle: no input yet
 * - loading: debounce fired, waiting for API response
 * - found (ACTIVE): green verified badge with masked name
 * - found (FROZEN/INACTIVE): yellow warning with name + status
 * - not_found: account does not exist
 * - error: network or unexpected error
 */
export const RecipientInput: React.FC<RecipientInputProps> = ({
  value,
  onChange,
  fieldError,
  onRecipientResolved,
  disabled,
}) => {
  const [lookup, setLookup] = useState<LookupState>({ phase: "idle" });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputId = useId();

  useEffect(() => {
    // Clear any pending debounce when value changes
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Reset to idle if input is cleared or too short
    if (!value || value.trim().length < MIN_LOOKUP_LENGTH) {
      setLookup({ phase: "idle" });
      onRecipientResolved(null);
      return;
    }

    setLookup({ phase: "loading" });

    debounceRef.current = setTimeout(async () => {
      try {
        const recipient = await transferApi.lookupRecipient(value.trim());
        setLookup({ phase: "found", recipient });
        onRecipientResolved(recipient);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
          setLookup({ phase: "not_found" });
          onRecipientResolved(null);
        } else {
          setLookup({ phase: "error", message: "Unable to verify account. Please check the number." });
          onRecipientResolved(null);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // onRecipientResolved is stable (useCallback or inline) — intentionally not in deps
    // to avoid infinite loops if caller doesn't memoize it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const isNonActive =
    lookup.phase === "found" && lookup.recipient.status !== "ACTIVE";

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
          error={!!fieldError}
          disabled={disabled}
          aria-describedby={
            [
              fieldError ? `${inputId}-field-err` : null,
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

        {/* Right-side status icon inside the input */}
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
          {lookup.phase === "not_found" && (
            <XCircle
              size={16}
              weight="fill"
              className="text-destructive"
              aria-hidden="true"
            />
          )}
        </span>
      </div>

      {/* react-hook-form validation error */}
      {fieldError && (
        <FormErrorMessage id={`${inputId}-field-err`} message={fieldError} />
      )}

      {/* Verified recipient badge */}
      {lookup.phase === "found" && !isNonActive && (
        <p
          id={`${inputId}-verified`}
          className="flex items-center gap-1 text-xs text-green-600 font-medium"
          aria-live="polite"
        >
          <CheckCircle size={13} weight="fill" aria-hidden="true" />
          {lookup.recipient.accountHolderName} · KM Bank
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

      {/* Not found message */}
      {lookup.phase === "not_found" && (
        <p
          id={`${inputId}-not-found`}
          className="text-xs text-destructive"
          aria-live="polite"
        >
          Account not found
        </p>
      )}

      {/* Network/unexpected error */}
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
