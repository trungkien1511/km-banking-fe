import React from "react";
import { WarningCircle, CheckCircle, Info, Warning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "danger" | "success" | "warning" | "info";
  title?: string;
  children: React.ReactNode;
}

// Static maps hoisted to module scope (rerender-memo: no rebuild per render).
const variants: Record<NonNullable<AlertProps["variant"]>, string> = {
  default:
    "bg-surface-elevated border-border      text-foreground",
  danger:
    "bg-destructive/10  border-destructive/25  text-destructive",
  success:
    "bg-success/10 border-success/25          text-success",
  warning:
    "bg-warning/10 border-warning/25          text-warning",
  info: "bg-info/10    border-info/25             text-info",
};

const icons: Record<
  NonNullable<AlertProps["variant"]>,
  React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>
> = {
  default: Info,
  danger: WarningCircle,
  success: CheckCircle,
  warning: Warning,
  info: Info,
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", title, children, ...props }, ref) => {
    const Icon = icons[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-xl border p-4",
          "[&>svg]:absolute [&>svg]:text-inherit [&>svg]:left-4 [&>svg]:top-4",
          "[&>svg+div]:-translate-y-0.75 [&>svg~*]:pl-7",
          variants[variant],
          className,
        )}
        {...props}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
        {title && (
          <h5 className="mb-1 font-semibold leading-none tracking-tight">
            {title}
          </h5>
        )}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    );
  },
);
Alert.displayName = "Alert";
