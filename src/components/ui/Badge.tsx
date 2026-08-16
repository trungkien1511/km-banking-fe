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
    default: "bg-muted text-foreground",

    // Primary — amber gold (use sparingly: premium tier, key status)
    primary: "bg-primary text-primary-fg",

    success:
      "bg-success/15 text-success border border-success/20",
    warning:
      "bg-warning/15 text-warning border border-warning/20",
    danger:
      "bg-destructive/15 text-destructive border border-destructive/20",
    info: "bg-info/15 text-info border border-info/20",

    outline: "text-foreground border border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-0.5",
        "text-xs font-medium",
        "transition-colors duration-150",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
