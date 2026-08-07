import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base layout
          "flex h-11 w-full rounded-xl px-3.5 py-2.5",
          // Colors — semantic tokens, work in both light-context and dark shell
          "bg-(--color-surface) border border-border",
          "text-[14px] text-text-primary",
          "placeholder:text-text-muted",
          // Hover + focus
          "hover:border-text-muted/40",
          "transition-all duration-150",
          "focus-visible:outline-none",
          "focus-visible:border-(--color-accent)",
          "focus-visible:ring-2 focus-visible:ring-(--color-accent)/15",
          "focus-visible:ring-offset-0",
          // Disabled
          "disabled:cursor-not-allowed disabled:bg-elevated disabled:opacity-55",
          // Error state
          error && [
            "border-danger/60",
            "hover:border-danger/60",
            "focus-visible:border-danger",
            "focus-visible:ring-danger/15",
          ],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
