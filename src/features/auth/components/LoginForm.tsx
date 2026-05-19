import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { isAxiosError } from 'axios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Checkbox } from '@/components/ui/Checkbox';
import { Divider } from '@/components/ui/Divider';
import { loginSchema } from '@/features/auth/schemas/login-schema';
import { useLogin } from '@/features/auth/hooks/use-login';
import type { LoginFormData } from '@/features/auth/types/login.types';

export const LoginForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setServerError(null);
    login(
      {
        identifier: data.identifier,
        password: data.password,
        rememberMe: data.rememberMe ?? false,
      },
      {
        onError: (error) => {
          if (isAxiosError(error)) {
            const message =
              error.response?.data?.message ||
              error.response?.data?.error ||
              'Incorrect username or password.';
            setServerError(message);
          } else {
            setServerError('An unexpected error occurred. Please try again.');
          }
        },
      }
    );
  };

  return (
    <div className="w-full max-w-[420px] flex flex-col">
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex flex-col space-y-1 p-6 sm:p-8 border-b border-border/50 bg-surface/50">
          <h2 className="text-[18px] font-semibold tracking-tight text-text-primary">
            Sign in to your account
          </h2>
          <p className="text-sm text-text-secondary">
            Enter your credentials to continue
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            onChange={() => { if (serverError) setServerError(null); }}
            className="space-y-5" 
            noValidate
          >
            <div className="space-y-4">
              {/* Identifier field */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary" htmlFor="identifier">
                  Username or phone number
                </label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="e.g. john_doe or 0901234567"
                  autoComplete="username"
                  aria-invalid={!!errors.identifier}
                  aria-describedby={errors.identifier ? 'identifier-error' : undefined}
                  {...register('identifier')}
                  error={!!errors.identifier}
                />
                {errors.identifier && (
                  <p id="identifier-error" className="text-sm text-danger flex items-center gap-1.5" role="alert">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text-primary" htmlFor="password">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password')}
                  error={!!errors.password}
                />
                {errors.password && (
                  <p id="password-error" className="text-sm text-danger flex items-center gap-1.5" role="alert">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Server / API error */}
            {serverError && (
              <div
                className="flex items-start gap-2.5 rounded-md border border-danger/20 bg-danger/10 px-3.5 py-3 text-sm text-danger"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            <div className="flex items-center pt-0.5">
              <Checkbox
                id="rememberMe"
                label="Remember me for 30 days"
                {...register('rememberMe')}
              />
            </div>

            <Button
              type="submit"
              className="w-full transition-all duration-200"
              isLoading={isPending || isSubmitting}
              disabled={isPending || isSubmitting}
              aria-label={isPending || isSubmitting ? 'Signing in...' : 'Sign in'}
              aria-live="polite"
            >
              {isPending || isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <Divider className="flex-1" />
            <span className="text-xs text-text-muted uppercase tracking-wider">or</span>
            <Divider className="flex-1" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-5 w-full gap-2 font-medium bg-surface hover:bg-elevated"
          >
            Continue with Single Sign-On (SSO)
          </Button>
        </div>
      </div>

      <p className="mt-7 text-center text-sm text-text-muted">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-medium text-text-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};
