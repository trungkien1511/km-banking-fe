import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base layout
          "flex h-11 w-full rounded-xl border bg-white px-3.5 py-2.5",
          // Typography
          "text-[14px] text-slate-900 placeholder:text-slate-400",
          // Border — default, hover, focus
          "border-slate-200 hover:border-slate-300 transition-all duration-150",
          // Focus ring using box-shadow for clean appearance
          "focus-visible:outline-none focus-visible:border-[#0A0F1E] focus-visible:ring-2 focus-visible:ring-[#0A0F1E]/[0.08] focus-visible:ring-offset-0",
          // Disabled
          "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-55",
          // Error state
          error && "border-red-400 hover:border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/10",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
