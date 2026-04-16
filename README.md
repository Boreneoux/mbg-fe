# MalesBeliGrocery — Frontend

Online grocery store built with **Next.js 16 App Router**, **TailwindCSS v4**, and **shadcn/ui**.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Backend API running (see backend repo)

### Install & run

```bash
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

### Other commands

```bash
npm run build   # production build
npm run start   # serve production build
npm run lint    # run ESLint
```

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | TailwindCSS v4 + shadcn/ui |
| HTTP client | Axios |
| Global state | Zustand |
| Forms | React Hook Form + Zod |
| Animation | lottie-react (available, not yet wired) |
| Font | Geist (via `next/font`) |

---

## Folder Structure

```
src/
├── app/                        # Next.js App Router — pages & layouts
│   ├── layout.tsx              # Root layout — providers only (ThemeProvider, AuthProvider, etc.)
│   ├── globals.css             # Global styles & CSS custom properties
│   │
│   ├── (main)/                 # Route group — user-facing pages (has Navbar + Footer)
│   │   ├── layout.tsx          # Injects Navbar and Footer
│   │   ├── page.tsx            # Homepage
│   │   ├── auth/               # Auth pages (login, register, verify, etc.)
│   │   ├── products/           # Product listing & detail
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── account/            # User account (profile, addresses, orders)
│   │   ├── reset-password/
│   │   └── setup-password/
│   │
│   ├── admin/                  # Admin auth — no Navbar, no Footer
│   │   ├── layout.tsx          # Minimal layout (renders children only)
│   │   └── login/              # /admin/login — corporate-style login page
│   │
│   └── dashboard/              # Admin content — no Navbar, no Footer
│       ├── layout.tsx          # Sidebar layout (DashboardSidebar + main)
│       ├── page.tsx
│       ├── orders/
│       ├── inventory/
│       ├── stock-mutations/
│       ├── discounts/
│       ├── products/
│       ├── categories/
│       ├── vouchers/
│       ├── stores/
│       └── users/
│
├── features/                   # Vertical feature slices
│   ├── auth/
│   │   ├── api/                # API call functions (no try/catch — handled in hooks)
│   │   ├── hooks/              # Form hooks (useFormLogin, useFormAdminLogin, useLogout, …)
│   │   ├── components/         # LoginFormCard, AdminLoginFormCard, etc.
│   │   ├── schemas/            # Zod validation schemas
│   │   └── types.ts            # Feature-scoped TypeScript types (AuthUser, UserRole)
│   ├── home/
│   │   └── components/         # Homepage section components (HeroSection, etc.)
│   ├── products/
│   ├── cart/
│   │   ├── api/                # API service functions (no try/catch)
│   │   ├── hooks/              # useCart — cart management hook
│   │   ├── components/         # CartItemCard, OrderSummary, EmptyCart, etc.
│   │   ├── services/           # cart.service.ts — API calls
│   │   └── types.ts            # Cart types (CartItem, Cart)
│   ├── orders/
│   ├── stores/
│   ├── user/
│   └── dashboard/
│       └── components/         # DashboardSidebar, SuperAdminMenu, StoreAdminMenu
│
├── components/                 # Shared UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ui/                     # shadcn/ui primitives (Button, Input, Card, Avatar, …)
│
├── stores/                     # Zustand stores
│   └── useAuthStore.ts         # Holds authenticated user state
│
├── hooks/                      # Shared custom hooks
│   └── useDebounce.ts          # Delays a value update (use for search inputs)
│
├── providers/
│   └── AuthProvider.tsx        # Hydrates auth store from session on mount
│
├── types/
│   ├── api.ts                  # Shared API response shapes
│   └── global.d.ts             # Global type augmentations
│
├── utils/
│   └── axiosInstance.ts        # Pre-configured Axios instance (base URL, cookies)
│
├── lib/
│   └── utils.ts                # `cn()` helper — merges Tailwind class names
│
└── proxy.ts                    # Route-guard logic — Next.js proxy convention (replaces middleware.ts)
```

---

## Architecture & Data Flow

### 1. Rendering model

Pages under `src/app/` are **Server Components** by default.  
Components that need browser APIs, hooks, or event handlers must declare `'use client'` at the top.

```
page.tsx (Server Component)
  └── SomeFeatureSection.tsx (Server Component)
        └── SomeInteractiveWidget.tsx  ('use client')
```

### 2. Feature slice convention

Every feature lives in `src/features/<name>/` and owns its full vertical:

```
features/auth/
  api/login.api.ts        ← calls the backend, throws on error (no try/catch)
  hooks/useFormLogin.ts   ← react-hook-form + Zod + calls the API, catches errors
  schemas/login.schema.ts ← Zod schema shared between hook and form
  types.ts                ← TypeScript types for this feature
```

**Rule:** API functions never catch errors. Hooks do — using `axios.isAxiosError()` narrowing.

### 3. Auth flow

```
Browser request
  └── proxy.ts  (Next.js proxy convention — runs on every request)
        ├── Reads `access_token` cookie
        ├── Decodes JWT payload (client-side safe — no secret needed)
        ├── Checks expiry
        └── Redirects based on role:
              • /auth/*      → redirect to / (user) or /dashboard (admin) if already logged in
              • /admin/*     → redirect to /dashboard (admin) or / (user) if already logged in
              • /account/*   → redirect to /auth/login if not logged in; /dashboard if admin
              • /dashboard/* → redirect to /admin/login if not logged in
                               redirect to / if role is 'user'
```

Roles: `user` | `store_admin` | `super_admin`

**Two separate login entry points:**
- `/auth/login` — customer-facing, colorful brand UI
- `/admin/login` — admin portal, clean corporate UI (no Navbar/Footer)

On the client side, `AuthProvider` calls the session endpoint on mount and hydrates `useAuthStore` so components can read `user` synchronously.

### 4. API calls

All requests go through `src/utils/axiosInstance.ts` which sets:
- `baseURL` pointing to the backend
- `withCredentials: true` so cookies (auth token) are sent automatically

### 5. Form handling

1. Define a **Zod schema** in `features/<name>/schemas/`
2. Infer the form type with `z.infer<typeof schema>`
3. Wire up with `useForm` + `zodResolver` inside a hook in `features/<name>/hooks/`
4. The page/component only imports the hook — keeps forms thin

### 6. Global state

Only minimal shared state lives in Zustand stores:

| Store | What it holds |
|---|---|
| `useAuthStore` | `user` object or `null`, `setUser()` |
| `useCartStore` | cart data, isLoading, error state, cart management actions |

Feature-local state stays inside components or hooks — no global store needed.

### 7. Cart feature architecture

The cart feature demonstrates a complete, reusable component pattern:

```
features/cart/
  ├── types.ts                  # CartItem, Cart types from backend
  ├── services/
  │   └── cart.service.ts       # Axios calls (getCart, addItem, updateItem, deleteItem)
  ├── hooks/
  │   └── useCart.ts            # Cart state + error handling (uses useCartStore)
  └── components/
      ├── CartItemCard.tsx      # Single cart item display + quantity/delete controls
      ├── CartItemSkeleton.tsx  # Loading skeleton matching CartItemCard
      ├── QuantityControl.tsx   # Reusable ±/quantity widget
      ├── OrderSummary.tsx      # Sticky summary panel (subtotal, delivery, total)
      ├── EmptyCart.tsx         # Empty state UI
      └── index.ts              # Component barrel export
```

**Pattern highlights:**
- **Service layer** (`cart.service.ts`) makes API calls without error handling
- **Hook layer** (`useCart.ts`) manages state via `useCartStore`, catches errors, provides UI feedback
- **Component layer** — reusable, composable UI components with simple props
- **Page** (`src/app/cart/page.tsx`) orchestrates: fetches data → renders components

**Component reusability:**
- `CartItemCard` reusable in checkout preview, order history
- `OrderSummary` reusable in checkout, order confirmation
- `QuantityControl` reusable in product detail pages
- `EmptyCart` reusable for empty state across the app

This pattern applies to all features — separate concerns into service → hook → component layers.

---

## Route Map

### User-facing — `(main)` group (with Navbar + Footer)

| Path | Access | Description |
|---|---|---|
| `/` | Public | Homepage |
| `/products` | Public | Product listing |
| `/products/[slug]` | Public | Product detail |
| `/auth/login` | Guest only | Customer login |
| `/auth/register` | Guest only | Register |
| `/auth/verify-email` | Guest only | Email verification |
| `/auth/forgot-password` | Guest only | Request password reset |
| `/auth/reset-password/[token]` | Guest only | Set new password |
| `/auth/complete-profile` | Exempt | Complete social-login profile |
| `/auth/callback` | Exempt | OAuth callback handler |
| `/cart` | User only | Shopping cart |
| `/checkout` | User only | Checkout |
| `/account/profile` | User only | Profile settings |
| `/account/addresses` | User only | Saved addresses |
| `/account/orders` | User only | Order history |
| `/account/orders/[id]` | User only | Order detail |

### Admin auth — `admin/` (no Navbar, no Footer)

| Path | Access | Description |
|---|---|---|
| `/admin/login` | Guest only | Admin portal login |

### Admin content — `dashboard/` (sidebar layout, no Navbar, no Footer)

| Path | Access | Description |
|---|---|---|
| `/dashboard` | Admin only | Dashboard overview |
| `/dashboard/orders` | Admin only | Order management |
| `/dashboard/inventory` | Store admin | Inventory |
| `/dashboard/stock-mutations` | Store admin | Stock mutations |
| `/dashboard/discounts` | Store admin | Discounts |
| `/dashboard/products` | Super admin | Product management |
| `/dashboard/categories` | Super admin | Category management |
| `/dashboard/vouchers` | Super admin | Vouchers |
| `/dashboard/stores` | Super admin | Store management |
| `/dashboard/users` | Super admin | User management |

---

## Key Conventions

- **Imports** use the `@/` path alias (e.g. `@/components/ui/button`)
- **No `any`** — use proper types or `unknown` with narrowing
- **API functions** live in `features/<name>/api/` and do not catch errors
- **Hooks** catch errors with `axios.isAxiosError()` and surface them to the UI
- **shadcn/ui** components live in `src/components/ui/` — add new ones with `npx shadcn add <component>`
- **Shared hooks** (not feature-specific) live in `src/hooks/`
- **Mobile-first** responsive design — start with small screen, add `md:` / `lg:` breakpoints
