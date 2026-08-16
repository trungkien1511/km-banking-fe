import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "@phosphor-icons/react";

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const defaultId = React.useId();
    const checkboxId = id || defaultId;

    return (
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={cn(
              // Shape — 6px radius matches badge spec
              "peer h-4 w-4 shrink-0 appearance-none rounded-sm",
              // Colors — semantic tokens, correct on white + dark shells
              "border border-(--color-border) bg-(--color-card)",
              // Focus ring — amber gold per design system
              "ring-offset-(--color-background) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring) focus-visible:ring-offset-2",
              // Checked — amber gold fill
              "checked:bg-(--color-primary) checked:border-(--color-primary)",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
            {...props}
          />
          <Check
            size={12}
            weight="bold"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-(--color-primary-fg) opacity-0 peer-checked:opacity-100 transition-opacity"
          />
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium leading-none text-(--color-foreground) peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";
