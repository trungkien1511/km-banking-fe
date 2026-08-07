import React from 'react';
import { cn } from '@/lib/utils';

// type alias instead of empty interface — @typescript-eslint/no-empty-object-type
type CardProps        = React.HTMLAttributes<HTMLDivElement>;
type CardHeaderProps  = React.HTMLAttributes<HTMLDivElement>;
type CardTitleProps   = React.HTMLAttributes<HTMLHeadingElement>;
type CardDescProps    = React.HTMLAttributes<HTMLParagraphElement>;
type CardContentProps = React.HTMLAttributes<HTMLDivElement>;
type CardFooterProps  = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-(--color-border)',
        'bg-(--color-card) text-(--color-text-primary)',
        'shadow-(--shadow-card)',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn(
        'text-base font-semibold leading-none tracking-tight',
        'text-(--color-text-primary)',
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: CardDescProps) {
  return (
    <p className={cn('text-sm text-(--color-text-muted)', className)} {...props} />
  );
}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
  );
}
