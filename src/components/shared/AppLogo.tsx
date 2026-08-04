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
            // Dark panel: glass-frosted background with gold-tinted glow
            ? 'bg-[#E9C46A]/10 text-[#E9C46A] border border-[#E9C46A]/20 shadow-[inset_0_1px_0_rgba(233,196,106,0.15)]'
            // Light panel: solid navy with white icon
            : 'bg-[#0A0F1E] text-white shadow-md shadow-slate-900/10'
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
              isLight ? 'text-white' : 'text-slate-900'
            )}
          >
            {APP_NAME}
          </span>
          <span
            className={cn(
              'text-[10px] tracking-widest uppercase font-mono mt-0.5',
              isLight ? 'text-slate-500' : 'text-slate-400'
            )}
          >
            Digital Banking
          </span>
        </div>
      )}
    </div>
  );
};
