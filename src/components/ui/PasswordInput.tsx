import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './Input';
import type { InputProps } from './Input';
import { cn } from '@/lib/utils';

export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-11', className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2',
            'p-1 rounded-md',
            // Semantic tokens — works on both light and dark bg
            'text-(--color-text-muted)',
            'hover:text-(--color-text-primary)',
            'hover:bg-(--color-elevated)',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-(--color-accent)/30',
          )}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
