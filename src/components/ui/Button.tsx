import React from 'react';
import { cn } from '@/lib/utils';
import { CircleNotch } from '@phosphor-icons/react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

// Static class maps hoisted to module scope (rerender-memo: no rebuild per render).
const baseStyles = [
  "inline-flex items-center justify-center whitespace-nowrap",
  "font-medium rounded-md",
  "transition-[background-color,border-color,color,box-shadow,transform,opacity]",
  "duration-150",
  "focus-visible:outline-none",
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",
  "disabled:pointer-events-none disabled:opacity-50",
  "active:scale-[0.97]",
  "[touch-action:manipulation]",
].join(' ');

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  // Primary — single primary CTA per screen
  primary: [
    "bg-primary text-primary-fg",
    "hover:bg-primary-hover",
    "shadow-sm",
  ].join(' '),

  secondary: [
    "bg-muted text-foreground",
    "border border-border",
    "hover:bg-surface-elevated",
  ].join(' '),

  outline: [
    "border border-border bg-transparent",
    "text-foreground",
    "hover:bg-muted",
  ].join(' '),

  ghost: [
    "bg-transparent text-muted-foreground",
    "hover:bg-muted hover:text-foreground",
  ].join(' '),

  danger: [
    "bg-destructive text-white",
    "hover:bg-destructive/90",
    "shadow-sm",
  ].join(' '),
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm:   "h-8 px-3 text-sm gap-1.5",
  md:   "h-11 px-4 py-2 text-sm gap-2",   // h-11 = 44px — min touch target
  lg:   "h-12 px-8 text-base gap-2",
  icon: "h-11 w-11",                         // 44px square — min touch target
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <CircleNotch
            size={16}
            className="animate-spin"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
