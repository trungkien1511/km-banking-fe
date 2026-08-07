import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: "bg-(--color-elevated) text-(--color-text-primary)",
    success: "bg-(--color-success)/10 text-(--color-success) border border-(--color-success)/20",
    warning: "bg-(--color-warning)/10 text-(--color-warning) border border-(--color-warning)/20",
    danger:  "bg-(--color-danger)/10  text-(--color-danger)  border border-(--color-danger)/20",
    info:    "bg-(--color-info)/10    text-(--color-info)    border border-(--color-info)/20",
    outline: "text-(--color-text-primary) border border-(--color-border)",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-(--color-navy-700)/40 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
