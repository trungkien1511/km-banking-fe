import React from 'react';
import { cn } from '@/lib/utils';

// type alias — avoids @typescript-eslint/no-empty-object-type on empty interface
type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

// Skeleton — shimmer loading placeholder.
// Uses .animate-shimmer from index.css (horizontal sweep, 1.5s loop).
// Respects prefers-reduced-motion: animation collapses to static muted bg.
// Use for all async data loads expected to take > 300ms.
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        // Shape — 12px radius matches card spec; callers can override
        'rounded-lg',
        // Shimmer sweep — defined in @layer utilities in index.css
        'animate-shimmer',
        className,
      )}
      // Announce to screen readers that content is loading
      aria-hidden="true"
      {...props}
    />
  );
}
