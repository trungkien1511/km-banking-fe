import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "outline"
    | "primary";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    // Default — neutral muted surface
    default: "bg-(--color-muted) text-(--color-foreground)",

    // Primary — amber gold (use sparingly: premium tier, key status)
    primary: "bg-(--color-primary) text-(--color-primary-fg)",

    // Status variants — semantic bg tint + matching text
    success:
      "bg-(--color-success)/15 text-(--color-success) border border-(--color-success)/20",
    warning:
      "bg-(--color-warning)/15 text-(--color-warning) border border-(--color-warning)/20",
    danger:
      "bg-(--color-destructive)/15 text-(--color-destructive) border border-(--color-destructive)/20",
    info: "bg-(--color-info)/15 text-(--color-info) border border-(--color-info)/20",

    // Outline — border only, no fill
    outline: "text-(--color-foreground) border border-(--color-border)",
  };

  return (
    <span
      className={cn(
        // Layout — 6px radius per design system badge spec
        "inline-flex items-center rounded-sm px-2.5 py-0.5",
        "text-xs font-medium",
        // Transition
        "transition-colors duration-150",
        // Focus ring — matches global ring token (amber gold)
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-(--color-ring) focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
