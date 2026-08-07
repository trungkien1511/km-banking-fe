import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { loginSchema } from "@/features/auth/schemas/login-schema";
import { useLogin } from "@/features/auth/hooks/use-login";
import type { LoginFormData } from "@/features/auth/types/login.types";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormErrorMessage } from "@/components/ui/FormErrorMessage";
import { cn } from "@/lib/utils";
import type { ApiError } from "@/services/api-client";

export const LoginForm = () => {
  const { mutate: login, isPending, error } = useLogin();

  const serverError = error
    ? ((error as unknown as ApiError).formattedMessage ?? error.message)
    : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "", rememberMe: false },
  });

  // rerender-functional-setstate / rerender-move-effect-to-event:
  // useCallback keeps onSubmit reference stable — prevents unnecessary
  // re-renders of handleSubmit wrapper on each render cycle.
  const onSubmit = useCallback(
    (data: LoginFormData) => {
      login({ identifier: data.identifier, password: data.password });
    },
    [login],
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
      aria-label="Sign in form"
    >
      {/* ── Server error banner ─────────────────────────────────────── */}
      {/* rendering-conditional-render: ternary not && */}
      {serverError ? (
        <div
          role="alert"
          className="
            animate-error-in flex items-start gap-2.5
            rounded-xl border px-4 py-3
            border-danger/25
            bg-danger/10
          "
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-danger"
            strokeWidth={2}
            aria-hidden="true"
          />
          <p className="text-sm text-danger leading-snug">{serverError}</p>
        </div>
      ) : null}

      {/* ── Identifier field ──────────────────────────────────────── */}
      <div className="space-y-1.5">
        <label
          htmlFor="identifier"
          className="block text-sm font-medium text-text-primary"
        >
          Phone number or email
        </label>
        <Input
          id="identifier"
          type="text"
          autoComplete="username"
          autoFocus
          placeholder="0912 345 678 or name@example.com"
          error={!!errors.identifier}
          disabled={isPending}
          {...register("identifier")}
        />
        {errors.identifier ? (
          <FormErrorMessage
            role="alert"
            className="animate-error-in"
            message={errors.identifier.message}
          />
        ) : null}
      </div>

      {/* ── Password field ────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text-primary"
          >
            Password
          </label>
          <a
            href="#"
            className="
              text-xs font-medium
              text-gold-600 hover:text-(--color-gold-500)
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-(--color-gold-400)/40 rounded
            "
            tabIndex={0}
          >
            Forgot password?
          </a>
        </div>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={!!errors.password}
          disabled={isPending}
          {...register("password")}
        />
        {errors.password ? (
          <FormErrorMessage
            role="alert"
            className="animate-error-in"
            message={errors.password.message}
          />
        ) : null}
      </div>

      {/* ── Remember me ──────────────────────────────────────────── */}
      <Checkbox
        id="rememberMe"
        label="Keep me signed in"
        disabled={isPending}
        {...register("rememberMe")}
      />

      {/* ── Submit ───────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "relative w-full h-11 rounded-xl font-semibold text-sm text-white",
          "flex items-center justify-center gap-2",
          // Navy — consistent with brand, readable on any bg (white text on navy)
          "bg-navy-900 hover:bg-navy-800",
          "transition-all duration-150",
          "active:scale-[0.98] active:-translate-y-px",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-navy-700 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-60",
          "shadow-[0_2px_8px_0_rgba(10,15,30,0.3)] hover:shadow-[0_4px_16px_0_rgba(10,15,30,0.4)]",
        )}
      >
        {/* rendering-conditional-render: ternary not && */}
        {isPending ? (
          <>
            <Loader2
              className="h-4 w-4 animate-spin"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <span>Sign in</span>
            <ArrowRight
              className="h-4 w-4"
              strokeWidth={2}
              aria-hidden="true"
            />
          </>
        )}
      </button>

      {/* Screen-reader live region for auth state */}
      {isPending ? (
        <div
          aria-live="polite"
          aria-label="Authenticating, please wait"
          className="sr-only"
        >
          Signing in, please wait...
        </div>
      ) : null}
    </form>
  );
};
