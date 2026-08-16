import React from 'react';
import { CircleNotch } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps extends React.HTMLAttributes<SVGElement> {
  size?: 'sm' | 'md' | 'lg';
}

// Static map hoisted to module scope (rerender-memo: no rebuild per render).
const sizeClasses: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = 'md',
  ...props
}) => {
  return (
    <CircleNotch
      className={cn(
        "animate-spin text-primary",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
};
