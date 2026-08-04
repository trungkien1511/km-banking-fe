import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
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

  // Extract the server-level error message (network / 401 / 500 etc.)
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

  const onSubmit = (data: LoginFormData) => {
    login({ identifier: data.identifier, password: data.password });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
      aria-label="Sign in form"
    >
      {/* ── Server error banner ───────────────────────────────────────── */}
      {serverError && (
        <div
          role="alert"
          className="animate-error-in flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500"
            strokeWidth={2}
          />
          <p className="text-sm text-red-700 leading-snug">{serverError}</p>
        </div>
      )}

      {/* ── Identifier field ──────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <label
          htmlFor="identifier"
          className="block text-sm font-medium text-slate-700"
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
        {errors.identifier && (
          <FormErrorMessage
            role="alert"
            className="animate-error-in"
            message={errors.identifier.message}
          />
        )}
      </div>

      {/* ── Password field ────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <a
            href="#"
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-150 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded"
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
        {errors.password && (
          <FormErrorMessage
            role="alert"
            className="animate-error-in"
            message={errors.password.message}
          />
        )}
      </div>

      {/* ── Remember me ───────────────────────────────────────────────── */}
      <Checkbox
        id="rememberMe"
        label="Keep me signed in"
        disabled={isPending}
        {...register("rememberMe")}
      />

      {/* ── Submit button ─────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          // Base
          "relative w-full h-11 rounded-xl font-semibold text-sm text-white",
          "flex items-center justify-center gap-2",
          // Color
          "bg-[#1D4ED8] hover:bg-[#1E3A8A]",
          // Transitions
          "transition-all duration-150",
          // Tactile feedback — physical press simulation
          "active:scale-[0.98] active:-translate-y-px",
          // Focus
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2",
          // Disabled
          "disabled:pointer-events-none disabled:opacity-60",
          // Shadow
          "shadow-[0_2px_8px_0_rgba(29,78,216,0.25)] hover:shadow-[0_4px_16px_0_rgba(29,78,216,0.35)]"
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <span>Sign in</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" strokeWidth={2} />
          </>
        )}
      </button>

      {/* ── Loading skeleton placeholder (while submitting) ───────────── */}
      {isPending && (
        <div
          aria-live="polite"
          aria-label="Authenticating, please wait"
          className="sr-only"
        >
          Signing in, please wait...
        </div>
      )}
    </form>
  );
};
