import { AppLogo } from '../../../components/shared/AppLogo';
import { ShieldCheck } from 'lucide-react';
import { APP_NAME } from '../../../constants/brand';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  return (
    <div className="flex min-h-screen w-full bg-background selection:bg-primary/20">
      {/* Left Panel - Branding & Context */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between border-r border-border bg-surface p-12 relative overflow-hidden">
        <div className="relative z-10">
          <AppLogo />
        </div>

        <div className="flex flex-col gap-3 max-w-md relative z-10">
          <h1 className="text-2xl font-medium tracking-tight text-text-primary">
            Manage accounts, transfers, and security from one clear workspace.
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            A reliable platform for modern teams to control spending and streamline financial operations.
          </p>
        </div>

        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 max-w-sm shadow-sm transition-colors hover:border-border/80">
            <ShieldCheck className="h-5 w-5 text-text-secondary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-text-primary leading-none">Enterprise reliability</p>
              <p className="text-xs text-text-muted leading-relaxed">Additional verification may be required for sensitive actions to keep your account safe.</p>
            </div>
          </div>

          <div className="text-xs font-medium text-text-muted">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full items-center justify-center lg:w-1/2 p-6 sm:p-10 relative">
        {/* Mobile logo */}
        <div className="absolute top-8 w-full flex justify-center lg:hidden">
          <AppLogo />
        </div>

        <LoginForm />
      </div>
    </div>
  );
};
