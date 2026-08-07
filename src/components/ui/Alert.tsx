import React from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "danger" | "success" | "warning" | "info";
  title?: string;
  children: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", title, children, ...props }, ref) => {
    const variants = {
      default:
        "bg-(--color-elevated)  border-(--color-border)              text-(--color-text-primary)",
      danger:
        "bg-(--color-danger)/10  border-(--color-danger)/25           text-(--color-danger)",
      success:
        "bg-(--color-success)/10 border-(--color-success)/25          text-(--color-success)",
      warning:
        "bg-(--color-warning)/10 border-(--color-warning)/25          text-(--color-warning)",
      info: "bg-(--color-info)/10    border-(--color-info)/25             text-(--color-info)",
    };

    const icons = {
      default: Info,
      danger: AlertCircle,
      success: CheckCircle2,
      warning: AlertTriangle,
      info: Info,
    };

    const Icon = icons[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          // rounded-xl consistent with the rest of the system
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
