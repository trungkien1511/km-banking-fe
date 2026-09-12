import React, { useId } from "react";
import { numberToVietnamese } from "../utils/number-to-vietnamese";
import { Input } from "@/components/ui/Input";
import { FormErrorMessage } from "@/components/ui/FormErrorMessage";

interface VndCurrencyInputProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  max?: number;
  fieldError?: string;
  disabled?: boolean;
  id?: string;
  label?: string;
}

const QUICK_CHIPS: { label: string; value: number }[] = [
  { label: "+100K", value: 100_000 },
  { label: "+500K", value: 500_000 },
  { label: "+1M", value: 1_000_000 },
  { label: "+5M", value: 5_000_000 },
  { label: "+10M", value: 10_000_000 },
];

export const VndCurrencyInput: React.FC<VndCurrencyInputProps> = ({
  value,
  onChange,
  max,
  fieldError,
  disabled,
  id: externalId,
  label = "Amount (VND)",
}) => {
  const autoId = useId();
  const inputId = externalId ?? autoId;
  const errId = `${inputId}-err`;
  const wordsId = `${inputId}-words`;

  // Format with vi-VN thousands separators directly in the field (150000 → 150.000)
  const displayValue = value !== undefined ? value.toLocaleString("vi-VN") : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw === "") {
      onChange(undefined);
      return;
    }
    const parsed = parseInt(raw, 10);
    onChange(isNaN(parsed) ? undefined : parsed);
  };

  const addAmount = (delta: number) => {
    const current = value ?? 0;
    const next =
      max !== undefined ? Math.min(current + delta, max) : current + delta;
    onChange(next);
  };

  const setMax = () => {
    if (max !== undefined) onChange(max);
  };

  const words = value ? numberToVietnamese(value) : "";

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-muted-foreground"
        >
          {label}
        </label>
        {max !== undefined && (
          <span className="text-xs text-subtle-foreground">
            Max: {max.toLocaleString("vi-VN")} ₫
          </span>
        )}
      </div>

      {/* Numeric input */}
      <Input
        id={inputId}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        placeholder="0"
        disabled={disabled}
        error={!!fieldError}
        aria-describedby={
          [fieldError ? errId : null, words ? wordsId : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
        autoComplete="off"
      />

      {/* Vietnamese words preview */}
      {words && (
        <p
          id={wordsId}
          className="text-xs text-muted-foreground italic"
          aria-live="polite"
        >
          {words}
        </p>
      )}

      {/* Quick chips */}
      <div className="flex flex-wrap gap-1.5">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            disabled={disabled}
            onClick={() => addAmount(chip.value)}
            className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none"
          >
            {chip.label}
          </button>
        ))}
        {max !== undefined && (
          <button
            type="button"
            disabled={disabled}
            onClick={setMax}
            className="text-xs px-2.5 py-1 rounded-full border border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none"
          >
            Tất cả
          </button>
        )}
      </div>

      {fieldError && <FormErrorMessage id={errId} message={fieldError} />}
    </div>
  );
};
