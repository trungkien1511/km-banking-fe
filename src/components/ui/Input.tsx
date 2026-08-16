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
          // Layout — h-11 = 44px min touch target
          "flex h-11 w-full rounded-md px-3.5 py-2.5",
          // Colors — semantic tokens; work in both .light-context and dark shell
          "bg-(--color-muted) border border-(--color-border)",
          "text-sm text-(--color-foreground)",
          "placeholder:text-(--color-subtle-foreground)",
          // Hover
          "hover:border-(--color-muted-foreground)/40",
          // Transition
          "transition-[border-color,box-shadow] duration-150",
          // Focus ring — 2px amber gold ring per design system
          "focus-visible:outline-none",
          "focus-visible:border-(--color-ring)",
          "focus-visible:ring-2 focus-visible:ring-(--color-ring)/20",
          "focus-visible:ring-offset-0",
          // Disabled
          "disabled:cursor-not-allowed disabled:bg-(--color-muted) disabled:opacity-50",
          // Error state
          error && [
            "border-(--color-destructive)/60",
            "hover:border-(--color-destructive)/60",
            "focus-visible:border-(--color-destructive)",
            "focus-visible:ring-(--color-destructive)/20",
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
