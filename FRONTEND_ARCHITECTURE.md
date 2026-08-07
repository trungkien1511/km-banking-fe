# KM Banking Frontend — Architecture Overview

> Auto-generated từ codebase-memory MCP (2026-08-05)
> **211 nodes · 281 edges · 30 TypeScript files · 11 UI components**

---

## 1. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2.6 |
| Language | TypeScript | 6.0.2 |
| Build Tool | Vite | 8.0.12 |
| Styling | TailwindCSS (via @tailwindcss/vite) | 4.3.0 |
| Routing | React Router DOM | 7.15.1 |
| Client State | Zustand | 5.0.13 |
| Server State | TanStack React Query | 5.100.10 |
| HTTP Client | Axios | 1.16.1 |
| Forms | React Hook Form + Zod | 7.76.0 / 4.4.3 |
| Component Variants | class-variance-authority (CVA) | 0.7.1 |
| CSS Utils | clsx + tailwind-merge | 2.1.1 / 3.6.0 |
| Icons | lucide-react | 1.16.0 |
| Notifications | Sonner | 2.0.7 |
| Package Manager | pnpm | — |

---

## 2. Architecture Pattern

**Feature-based Architecture** — mỗi feature là self-contained module với api/components/hooks/pages/schemas/store/types.

```
src/
├── App.tsx                          # Root: QueryClientProvider + RouterProvider + Toaster
├── main.tsx                         # Entry: StrictMode + createRoot
├── index.css                        # Global styles (TailwindCSS)
│
├── app/                             # App shell
│   ├── router/
│   │   ├── index.tsx                # createBrowserRouter config
│   │   ├── GuestRoute.tsx           # Redirect authenticated → /dashboard
│   │   └── ProtectedRoute.tsx       # Redirect unauthenticated → /login
│   ├── layouts/                     # 🔲 Planned
│   ├── providers/                   # 🔲 Planned
│   └── store/                       # 🔲 Planned
│
├── components/                      # Shared UI components
│   ├── ui/                          # Design system primitives (CVA-based)
│   │   ├── Alert.tsx                # Alert with variants (info, success, warning, error)
│   │   ├── Badge.tsx                # Badge with variants
│   │   ├── Button.tsx               # Button with size/variant props
│   │   ├── Card.tsx                 # Card, CardHeader, CardTitle, CardDescription,
│   │   │                            #   CardContent, CardFooter
│   │   ├── Checkbox.tsx             # Checkbox with label
│   │   ├── Divider.tsx              # Horizontal/vertical divider
│   │   ├── FormErrorMessage.tsx     # Form field error display
│   │   ├── Input.tsx                # Text input with error state
│   │   ├── LoadingSpinner.tsx       # Animated spinner
│   │   ├── PasswordInput.tsx        # Password input with show/hide toggle
│   │   └── Skeleton.tsx             # Loading skeleton placeholder
│   ├── shared/
│   │   └── AppLogo.tsx              # Brand logo (SVG icon + text)
│   └── feedback/                    # 🔲 Planned
│
├── features/                        # Feature modules
│   ├── auth/                        # ✅ Implemented
│   │   ├── api/auth.api.ts          # login, me, refresh, logout
│   │   ├── components/LoginForm.tsx  # Login form with validation
│   │   ├── hooks/use-login.ts       # useMutation wrapper
│   │   ├── pages/LoginPage.tsx      # Full login page
│   │   ├── schemas/login-schema.ts  # Zod validation schema
│   │   ├── store/auth-store.ts      # Zustand: user, tokens, isAuthenticated
│   │   └── types/
│   │       ├── auth.types.ts        # AuthUser, LoginRequest/Response, AuthState
│   │       └── login.types.ts       # LoginFormData (inferred from Zod)
│   ├── accounts/                    # 🔲 Planned
│   ├── admin/                       # 🔲 Planned
│   ├── cards/                       # 🔲 Planned
│   ├── landing/                     # 🔲 Planned
│   ├── notifications/               # 🔲 Planned
│   ├── security/                    # 🔲 Planned
│   ├── settings/                    # 🔲 Planned
│   ├── transactions/                # 🔲 Planned
│   └── transfer/                    # 🔲 Planned
│
├── services/
│   └── api-client.ts                # Axios instance + interceptors
│
├── types/
│   └── api.types.ts                 # Generic ApiResponse<T>
│
├── lib/
│   └── utils.ts                     # cn() — clsx + tailwind-merge
│
├── constants/
│   └── brand.ts                     # APP_NAME, BRAND_PRIMARY, TAGLINE
│
├── hooks/                           # 🔲 Shared hooks (planned)
├── styles/                          # 🔲 Additional styles (planned)
└── assets/                          # Static assets
```

---

## 3. Routes

| Path | Guard | Component | Status |
|------|-------|-----------|--------|
| `/` | GuestRoute | LoginPage | ✅ |
| `/login` | GuestRoute | LoginPage | ✅ |
| `/dashboard` | ProtectedRoute | — | 🔲 Planned |
| `*` | — | Redirect → `/` | ✅ |

### Route Guards

```
┌─────────────────┐     isAuthenticated?      ┌──────────────┐
│   GuestRoute    │ ──── true ──────────────► │  /dashboard  │
│  (/, /login)    │ ──── false ─────────────► │   <Outlet/>  │
└─────────────────┘                           └──────────────┘

┌─────────────────┐     isAuthenticated?      ┌──────────────┐
│ ProtectedRoute  │ ──── false ─────────────► │   /login     │
│  (/dashboard)   │ ──── true ──────────────► │   <Outlet/>  │
└─────────────────┘                           └──────────────┘
```

---

## 4. API Client Architecture

### Axios Instance (`services/api-client.ts`)

```
                    ┌──────────────────────────┐
                    │   apiClient (Axios)       │
                    │   baseURL: localhost:8080 │
                    └────────┬─────────────────┘
                             │
               ┌─────────────┴──────────────┐
               │                            │
    ┌──────────▼──────────┐     ┌───────────▼──────────┐
    │  Request Interceptor │     │ Response Interceptor  │
    │                      │     │                       │
    │ • Attach Bearer      │     │ • Format error msg    │
    │   token from store   │     │   (Vietnamese i18n)   │
    │                      │     │ • Token refresh on    │
    │                      │     │   401 (with queue)    │
    │                      │     │ • Auto-logout on      │
    │                      │     │   refresh failure     │
    └──────────────────────┘     └───────────────────────┘
```

### Token Refresh Flow

1. Nhận 401 → check if not auth endpoint
2. Nếu đang refresh → queue request vào `pendingQueue`
3. Nếu chưa refresh → gọi `/api/v1/auth/refresh`
4. Success → update store, resolve pending queue, retry original
5. Failure → clear store (logout), reject pending queue

### Error Messages (Vietnamese i18n)

| Condition | Message |
|-----------|---------|
| 401 on login | Tên đăng nhập hoặc mật khẩu không chính xác |
| 500+ | Hệ thống đang bảo trì hoặc gặp sự cố |
| Network error | Lỗi kết nối mạng |
| Default | Đã xảy ra lỗi không xác định |

---

## 5. State Management

### Zustand (Client State)

```typescript
// features/auth/store/auth-store.ts
interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  setAuth(user, accessToken, refreshToken): void;
  setAccessToken(accessToken): void;
  logout(): void;
}
```

- **Pattern**: Feature-local stores (mỗi feature có store riêng)
- **Lý do chọn Zustand**: Lightweight, no boilerplate, truy cập được ngoài React (dùng trong Axios interceptors qua `useAuthStore.getState()`)

### React Query (Server State)

- `QueryClient` config: `retry: 1`, `refetchOnWindowFocus: false`
- Mutations: `useMutation` wrappers trong feature hooks
- Pattern: `features/{name}/hooks/use-{action}.ts`

---

## 6. Form Handling

### Stack: React Hook Form + Zod

```
Zod Schema (validation rules)
    │
    ▼
@hookform/resolvers (bridge)
    │
    ▼
React Hook Form (form state)
    │
    ▼
Component (UI)
```

### Login Schema Example

```typescript
// features/auth/schemas/login-schema.ts
z.object({
  identifier: z.string().trim().min(1).min(3).max(100),
  password: z.string().min(1).min(8).max(128),
  rememberMe: z.boolean().optional(),
});
```

- **Type inference**: `z.infer<typeof loginSchema>` → `LoginFormData`
- **Pattern**: Schema-first — define Zod schema → infer TypeScript type

---

## 7. Component Architecture

### UI Primitives (11 components)

| Component | Variants | Key Props |
|-----------|----------|-----------|
| **Alert** | info, success, warning, error | `variant`, `title`, `icon` |
| **Badge** | default, success, warning, error | `variant` |
| **Button** | default, outline, ghost, danger | `variant`, `size`, `isLoading` |
| **Card** | — | Compound: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| **Checkbox** | — | `label`, `error` |
| **Divider** | horizontal, vertical | `orientation`, `label` |
| **FormErrorMessage** | — | `message` |
| **Input** | — | `label`, `error`, `icon` |
| **LoadingSpinner** | — | `size` |
| **PasswordInput** | — | `label`, `error` (toggle show/hide) |
| **Skeleton** | — | `className` |

### Design System Pattern

- **CVA** (class-variance-authority): Type-safe variant definitions
- **cn()**: `clsx` + `tailwind-merge` cho conflict-free class merging
- `cn()` là function được gọi nhiều nhất (18 callers)

---

## 8. Hotspot Analysis

Các function/component được import/sử dụng nhiều nhất:

| Name | Fan-in | File |
|------|--------|------|
| `cn()` | 18 | `lib/utils.ts` |
| `useAuthStore` | 4 | `features/auth/store/auth-store.ts` |
| `apiClient` | 1 | `services/api-client.ts` |
| `LoginForm` | 1 | `features/auth/components/LoginForm.tsx` |
| `LoginPage` | 1 | `features/auth/pages/LoginPage.tsx` |
| `useLogin` | 1 | `features/auth/hooks/use-login.ts` |

---

## 9. Cluster Analysis (Community Detection)

MCP phát hiện 5 clusters:

| Cluster | Cohesion | Top Members | Chức năng |
|---------|----------|-------------|-----------|
| UI Components | 0.83 | `cn`, `Badge`, `Card`, `CardHeader` | Design system |
| Login Flow | 0.60 | `LoginForm`, `LoginPage`, `AppLogo`, `useLogin` | Auth UI |
| Auth Store | 1.00 | `setAuth`, `onSuccess` | State mutation |
| Auth API | 1.00 | `onSubmit`, `login` | API calls |
| Token Refresh | 1.00 | `processPendingQueue`, `resolve` | Interceptor logic |

---

## 10. Dependency Graph

```
features/ ──calls──► components/ ──calls──► lib/
    │                                        ▲
    └────────────────calls───────────────────┘

features/ ──imports──► services/api-client
features/ ──imports──► types/api.types
```

### Layer Architecture

| Layer | Package | Role |
|-------|---------|------|
| **Entry** | `features/` | Feature pages, entry points |
| **Internal** | `app/`, `components/` | Routing, UI components |
| **Core** | `lib/` | Utilities (highest fan-in) |

---

## 11. Configuration

### Vite (`vite.config.ts`)
- **Plugins**: `@vitejs/plugin-react`, `@tailwindcss/vite`
- **Alias**: `@` → `./src`

### TypeScript
- `tsconfig.app.json`: strict mode, paths alias `@/*`
- `tsconfig.node.json`: for Vite config

### Brand Constants
```typescript
APP_NAME = 'KM BANK'
BRAND_PRIMARY = '#0F172A'  // Slate 900
TAGLINE = 'Modern banking, built for clarity.'
```

---

## 12. Feature Module Convention

Mỗi feature module tuân theo structure:

```
features/{name}/
├── api/           # API functions (authApi.login, authApi.me, ...)
├── components/    # Feature-specific React components
├── hooks/         # Custom hooks (useMutation/useQuery wrappers)
├── pages/         # Page components (rendered by router)
├── schemas/       # Zod validation schemas
├── store/         # Zustand stores (feature-local state)
└── types/         # TypeScript interfaces/types
```

---

## 13. Current Implementation Status

| Feature | Status | Files |
|---------|--------|-------|
| **Auth (Login)** | ✅ Implemented | 8 files |
| **UI Component Library** | ✅ Implemented | 11 components |
| **API Client + Token Refresh** | ✅ Implemented | 1 file |
| **Route Guards** | ✅ Implemented | 3 files |
| **Accounts** | 🔲 Planned | — |
| **Admin** | 🔲 Planned | — |
| **Cards** | 🔲 Planned | — |
| **Landing** | 🔲 Planned | — |
| **Notifications** | 🔲 Planned | — |
| **Security** | 🔲 Planned | — |
| **Settings** | 🔲 Planned | — |
| **Transactions** | 🔲 Planned | — |
| **Transfer** | 🔲 Planned | — |
