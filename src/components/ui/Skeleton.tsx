import React from 'react';
import { cn } from '@/lib/utils';

// type alias — avoids @typescript-eslint/no-empty-object-type on empty interface
type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

// Skeleton — shimmer loading placeholder (.animate-shimmer from index.css).
// Respects prefers-reduced-motion; use for async loads expected to take > 300ms.
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg',
        'animate-shimmer',
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
