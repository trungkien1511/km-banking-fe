import React from 'react';
import { cn } from '@/lib/utils';

// type alias instead of empty interface — @typescript-eslint/no-empty-object-type
type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

// rendering-hoist-jsx: base class string is static — defined outside component
// so it's not re-created on every render.
const BASE_CLASS =
  'animate-pulse rounded-xl bg-(--color-elevated)';

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(BASE_CLASS, className)}
      {...props}
    />
  );
}
