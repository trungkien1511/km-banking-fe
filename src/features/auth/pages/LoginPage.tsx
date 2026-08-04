import { LoginForm } from "../components/LoginForm";
import { AppLogo } from "@/components/shared/AppLogo";
import { ShieldCheck, Zap, Globe } from "lucide-react";

const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    label: "Bank-grade encryption",
    sub: "256-bit SSL protection",
  },
  {
    icon: Zap,
    label: "Instant transfers",
    sub: "Real-time settlement",
  },
  {
    icon: Globe,
    label: "24/7 availability",
    sub: "Always-on infrastructure",
  },
] as const;

export const LoginPage = () => {
  return (
    <main
      className="min-h-[100dvh] w-full grid lg:grid-cols-2"
      aria-label="Sign in to KM BANK"
    >
      {/* ── LEFT: Dark brand panel (desktop only) ─────────────────────── */}
      <section
        className="
          hidden lg:flex flex-col justify-between
          relative overflow-hidden
          bg-[#080D1A] text-white
          px-14 py-12
        "
        aria-hidden="true"
      >
        {/* Background image with dark overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url('/login-banner.jpg')" }}
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080D1A]/60 via-[#080D1A]/40 to-[#080D1A]/80" />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content — relative so it sits above the overlays */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top: logo */}
          <AppLogo variant="light" />

          {/* Center: main brand statement */}
          <div className="animate-fade-slide-up animation-delay-100">
            <p className="text-xs font-mono tracking-[0.18em] uppercase text-[#E9C46A] mb-4 select-none">
              Secure Digital Banking
            </p>
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] text-white max-w-sm">
              Modern banking,
              <br />
              built for{" "}
              <span className="text-[#E9C46A]">clarity.</span>
            </h1>
            <p className="mt-5 text-[15px] text-slate-400 leading-relaxed max-w-xs">
              Manage your accounts, track every transaction, and move money
              with confidence.
            </p>
          </div>

          {/* Bottom: trust badges */}
          <div className="animate-fade-slide-up animation-delay-300 space-y-3">
            <p className="text-[11px] font-mono tracking-widest uppercase text-slate-600 mb-4 select-none">
              Why customers trust us
            </p>
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 group">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-colors group-hover:bg-white/10">
                  <Icon className="w-4 h-4 text-[#E9C46A]" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200 leading-none">
                    {label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RIGHT: Form panel ─────────────────────────────────────────── */}
      <section
        className="
          flex flex-col justify-center items-center
          min-h-[100dvh] lg:min-h-0
          bg-[#F8FAFC]
          px-6 py-12 sm:px-10
        "
      >
        {/* Mobile-only logo */}
        <div className="lg:hidden mb-10 self-start">
          <AppLogo variant="dark" />
        </div>

        <div className="w-full max-w-sm animate-fade-slide-up">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Sign in to access your account
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Footer note */}
          <p className="mt-8 text-center text-[11px] text-slate-400 leading-relaxed">
            Protected by 256-bit TLS encryption.
            <br />
            <span className="text-slate-300">
              &copy; {new Date().getFullYear()} KM BANK. All rights reserved.
            </span>
          </p>
        </div>
      </section>
    </main>
  );
};
