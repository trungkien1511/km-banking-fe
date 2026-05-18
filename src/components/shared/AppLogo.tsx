import React from 'react';
import { APP_NAME } from '@/constants/brand';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  className?: string;
  withText?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className, withText = true }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white font-bold text-lg">
        {APP_NAME.charAt(0)}
      </div>
      {withText && (
        <span className="text-lg font-bold tracking-tight text-text-primary">
          {APP_NAME}
        </span>
      )}
    </div>
  );
};
