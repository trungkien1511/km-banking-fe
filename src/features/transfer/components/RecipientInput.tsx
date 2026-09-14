import React, { useEffect, useId, useRef, useState } from "react";
import { AddressBook, Warning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { transferApi } from "../api/transfer.api";
import type { RecipientLookup } from "../types/transfer.types";
import { Input } from "@/components/ui/Input";
import { FormErrorMessage } from "@/components/ui/FormErrorMessage";
import { RecipientPickerPopup } from "./RecipientPickerPopup";

type LookupState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "found"; recipient: RecipientLookup }
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
  // Async-only outcome — set exclusively inside the debounce callback,
  // never synchronously in an effect. Idle/loading/self are derived at render.
  type LookupOutcome =
    | { phase: "found"; recipient: RecipientLookup }
    | { phase: "not_found" }
    | { phase: "error"; message: string };

  const [outcome, setOutcome] = useState<LookupOutcome | null>(null);
  const [outcomeValue, setOutcomeValue] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputId = useId();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const trimmed = value.trim();
  const isSelf = ownAccountNumbers.includes(trimmed);
  const isShort = !trimmed || trimmed.length < MIN_LOOKUP_LENGTH;

  // Derived lookup phase computed during render (no effect setState needed)
  const lookup: LookupState = isShort
    ? { phase: "idle" }
    : isSelf
      ? { phase: "self" }
      : outcome && outcomeValue === trimmed
        ? outcome
        : { phase: "loading" };

  // Close popup on outside click — Escape is handled inside RecipientPickerPopup
  React.useEffect(() => {
    if (!pickerOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [pickerOpen]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (isShort || isSelf) {
      onRecipientResolved(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const recipient = await transferApi.lookupRecipient(trimmed);
        setOutcome({ phase: "found", recipient });
        setOutcomeValue(trimmed);
        onRecipientResolved(recipient);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response
          ?.status;
        if (status === 404) {
          setOutcome({ phase: "not_found" });
          setOutcomeValue(trimmed);
          onRecipientResolved(null);
        } else {
          setOutcome({
            phase: "error",
            message: "Unable to verify account. Please check the number.",
          });
          setOutcomeValue(trimmed);
          onRecipientResolved(null);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, ownAccountNumbers]);

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

      <div className="relative" ref={wrapperRef}>
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
          className="pr-14"
          autoComplete="off"
        />

        {/* Picker trigger — opens Saved/Recent popup */}
        <button
          type="button"
          onClick={() => setPickerOpen((prev) => !prev)}
          aria-label="Choose from saved or recent recipients"
          aria-haspopup="dialog"
          aria-expanded={pickerOpen}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            pickerOpen
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground hover:bg-muted",
          )}
        >
          <AddressBook size={18} weight="regular" aria-hidden="true" />
        </button>

        {pickerOpen && (
          <RecipientPickerPopup
            onSelect={(accountNumber) => {
              onChange(accountNumber);
              setPickerOpen(false);
            }}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </div>

      {/* react-hook-form field error */}
      {fieldError && (
        <FormErrorMessage id={`${inputId}-field-err`} message={fieldError} />
      )}

      {/* Self-account error — shown inline, blocks progression */}
      {isSelf && (
        <p
          id={`${inputId}-self-err`}
          className="text-sm text-destructive font-medium"
          aria-live="polite"
        >
          Cannot transfer to your own account
        </p>
      )}

      {/* Verified recipient — read-only Account Name field, only when STK is valid */}
      {lookup.phase === "found" && !isNonActive && (
        <div className="space-y-1.5">
          <label
            htmlFor={`${inputId}-account-name`}
            className="text-sm font-medium text-muted-foreground"
          >
            Account Name
          </label>
          {/*
           * read-only field: no overlay — the input signals lock via bg-muted,
           * cursor-default, select-all, and aria-readonly. The opaque span that
           * was here before obscured the text on the dark shell.
           */}
          <Input
            id={`${inputId}-account-name`}
            type="text"
            value={lookup.recipient.accountHolderName}
            readOnly
            aria-readonly="true"
            autoComplete="off"
            className="bg-muted text-foreground cursor-default select-all"
          />
        </div>
      )}

      {/* Non-ACTIVE account warning */}
      {isNonActive && (
        <p
          id={`${inputId}-non-active`}
          className="flex items-center gap-1 text-sm text-warning font-medium"
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
          className="text-sm text-destructive"
          aria-live="polite"
        >
          Account not found
        </p>
      )}

      {/* Network / unexpected error */}
      {lookup.phase === "error" && (
        <p
          id={`${inputId}-lookup-err`}
          className="text-sm text-muted-foreground"
          aria-live="polite"
        >
          {lookup.message}
        </p>
      )}
    </div>
  );
};
