import React from 'react';
import { APP_NAME } from '@/constants/brand';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  className?: string;
  withText?: boolean;
  /** 'light' = renders on dark background (white text, glass icon)
   *  'dark'  = renders on light background (dark text, solid icon)
   */
  variant?: 'dark' | 'light';
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className,
  withText = true,
  variant = 'dark',
}) => {
  const isLight = variant === 'light';

  return (
    <div className={cn('flex items-center gap-3 select-none', className)}>
      {/* Icon mark */}
      <div
        className={cn(
          'relative flex h-9 w-9 items-center justify-center rounded-xl font-bold transition-transform duration-150 hover:scale-[1.03]',
          isLight
            // Dark panel: amber-gold tinted mark (design primary)
            ? 'bg-(--color-primary)/10 text-(--color-primary) border border-(--color-primary)/20 shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-primary)_15%,transparent)]'
            // Light panel: solid foreground (near-navy) with background icon
            : 'bg-(--color-foreground) text-(--color-background) shadow-md shadow-(--color-foreground)/10'
        )}
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 6L7.5 8.5V13.5L12 16L16.5 13.5V8.5L12 6Z"
            fill="currentColor"
            fillOpacity="0.35"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col">
          <span
            className={cn(
              'text-lg font-bold tracking-tight leading-none',
              // foreground adapts: light on dark shell, dark on light-context
              'text-(--color-foreground)'
            )}
          >
            {APP_NAME}
          </span>
          <span
            className={cn(
              'text-[10px] tracking-widest uppercase font-mono mt-0.5',
              'text-(--color-muted-foreground)'
            )}
          >
            Digital Banking
          </span>
        </div>
      )}
    </div>
  );
};
