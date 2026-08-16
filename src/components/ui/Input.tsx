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
          // h-11 = 44px min touch target
          "flex h-11 w-full rounded-md px-3.5 py-2.5",
          // Semantic tokens — correct in both .light-context and dark shell
          "bg-muted border border-border",
          "text-sm text-foreground",
          "placeholder:text-subtle-foreground",
          "hover:border-muted-foreground/40",
          "transition-[border-color,box-shadow] duration-150",
          "focus-visible:outline-none",
          "focus-visible:border-ring",
          "focus-visible:ring-2 focus-visible:ring-ring/20",
          "focus-visible:ring-offset-0",
          "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50",
          error && [
            "border-destructive/60",
            "hover:border-destructive/60",
            "focus-visible:border-destructive",
            "focus-visible:ring-destructive/20",
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
