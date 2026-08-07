import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {

    const baseStyles = [
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium",
      "transition-colors duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-navy-700)/40 focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "active:scale-[0.98]",
    ].join(' ');

    const variants = {
      // Navy primary - consistent with login submit + dark sidebar
      primary: "bg-(--color-navy-900) text-white hover:bg-(--color-navy-800) shadow-sm",
      secondary: "bg-(--color-elevated) text-(--color-text-primary) hover:bg-(--color-border) shadow-sm",
      outline: "border border-(--color-border) bg-transparent hover:bg-(--color-surface) text-(--color-text-primary)",
      ghost: "hover:bg-(--color-surface) text-(--color-text-primary)",
      danger: "bg-(--color-danger) text-white hover:bg-(--color-danger)/90 shadow-sm",
    };

    const sizes = {
      sm:   "h-8 px-3 text-xs",
      md:   "h-10 px-4 py-2 text-sm",
      lg:   "h-12 px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
