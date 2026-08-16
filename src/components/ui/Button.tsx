import React from 'react';
import { cn } from '@/lib/utils';
import { CircleNotch } from '@phosphor-icons/react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {

    const baseStyles = [
      // Layout
      "inline-flex items-center justify-center whitespace-nowrap",
      "font-medium rounded-md",                          // 8px radius per design system
      // Transition — uses motion tokens; fast for hover, instant for press
      "transition-[background-color,border-color,color,box-shadow,transform,opacity]",
      "duration-150",
      // Focus ring — 2px amber gold, offset by background color
      "focus-visible:outline-none",
      "focus-visible:ring-2 focus-visible:ring-(--color-ring) focus-visible:ring-offset-2",
      "focus-visible:ring-offset-(--color-background)",
      // Disabled
      "disabled:pointer-events-none disabled:opacity-50",
      // Press feedback — scale down on active (no layout shift)
      "active:scale-[0.97]",
      "[touch-action:manipulation]",
    ].join(' ');

    const variants = {
      // ── Primary: amber gold — single primary CTA per screen
      // --color-primary (#D4A017), text --color-primary-fg (#0A0F1E)
      primary: [
        "bg-(--color-primary) text-(--color-primary-fg)",
        "hover:bg-(--color-primary-hover)",
        "shadow-sm",
      ].join(' '),

      // ── Secondary: muted surface with foreground text
      secondary: [
        "bg-(--color-muted) text-(--color-foreground)",
        "border border-(--color-border)",
        "hover:bg-(--color-surface-elevated)",
      ].join(' '),

      // ── Outline: transparent + border, no fill
      outline: [
        "border border-(--color-border) bg-transparent",
        "text-(--color-foreground)",
        "hover:bg-(--color-muted)",
      ].join(' '),

      // ── Ghost: no border, no fill — sidebar actions, icon buttons
      ghost: [
        "bg-transparent text-(--color-muted-foreground)",
        "hover:bg-(--color-muted) hover:text-(--color-foreground)",
      ].join(' '),

      // ── Danger: solid red — destructive actions (delete, block)
      danger: [
        "bg-(--color-destructive) text-white",
        "hover:bg-(--color-destructive)/90",
        "shadow-sm",
      ].join(' '),
    };

    const sizes = {
      sm:   "h-8 px-3 text-xs gap-1.5",
      md:   "h-11 px-4 py-2 text-sm gap-2",   // h-11 = 44px — min touch target
      lg:   "h-12 px-8 text-base gap-2",
      icon: "h-11 w-11",                         // 44px square — min touch target
    };

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
