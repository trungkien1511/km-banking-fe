import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'danger' | 'success' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', title, children, ...props }, ref) => {
    
    const variants = {
      default: "bg-elevated border-border text-text-primary",
      danger: "bg-danger/10 border-danger/20 text-danger",
      success: "bg-success/10 border-success/20 text-success",
      warning: "bg-warning/10 border-warning/20 text-warning",
      info: "bg-info/10 border-info/20 text-info",
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
          "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-inherit [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&>svg~*]:pl-7",
          variants[variant],
          className
        )}
        {...props}
      >
        <Icon className="h-5 w-5" />
        {title && (
          <h5 className="mb-1 font-medium leading-none tracking-tight">
            {title}
          </h5>
        )}
        <div className="text-sm opacity-90">
          {children}
        </div>
      </div>
    );
  }
);
Alert.displayName = "Alert";
