<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure may all differ
from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before
writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# machado-web

## Package Identity
Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS v4 · ESLint 9.
Frontend with a built-in design system (`app/ds/`), shared auth/HTTP utilities (`app/shared/`),
and utility helpers (`app/utils/`).

## Setup & Run
```bash
yarn install        # install dependencies
yarn dev        # start dev server
yarn build      # production build
yarn lint       # ESLint check
```

## Patterns & Conventions

**Components**
- DO: Prefer Server Components — no `"use client"` unless the component needs state or effects
- DO: Use `React.memo` to wrap pure presentational components — see `app/ds/button/Button.tsx`
- DO: Use `"use client"` for hooks like `useAlert`, `useLoading`, `useBreadcrumb`
- DON'T: Use class components — all components are functional

**Design System (`app/ds/`)**
- Each DS component lives in its own folder: `ComponentName/ComponentName.tsx` + `types.ts` + `index.ts`
- Spec files colocated: `ComponentName.spec.tsx`
- DO: Copy folder structure from `app/ds/button/` when adding a new DS component
- DO: Contexts + Providers + hooks colocated — see `app/ds/alert/` (AlertContext, AlertProvider, useAlert)
- DON'T: Import internal DS files directly — always use the `index.ts` barrel

**Styling**
- Use Tailwind for all new styling; SCSS only where it already exists (e.g., `app/ds/modal/Modal.scss`)
- Build tone/appearance maps with `Record<Appearance, Record<Tone, string>>` — see `app/ds/button/Button.tsx`
- Use `joinClass()` from `app/utils/join-class/joinClass.ts` to merge class strings

**Imports**
- Use `@/` absolute imports — e.g., `import { joinClass } from '@/app/utils'`
- DON'T: Use relative `../../../` paths
- Barrel pattern: re-export from `index.ts` in every folder

**Auth**
- Server-only session: `app/shared/lib/auth/session/session.ts` (`getServerSession`, `setAuthCookie`)
- Client token validation: `app/shared/lib/auth/token/token.ts`
- Auth cookie name and TTL: `app/shared/lib/auth/constants.ts`
- Server-only code must import `'server-only'` at the top

**HTTP / Services**
- Base HTTP client: `app/shared/services/http/http.ts`
- Extend `BaseServiceAbstract` for domain services — see `app/shared/services/service/service.ts`
- Pass `token` to constructor for authenticated requests

**TypeScript**
- Strict mode — no `any`; use explicit types for all props and returns
- Types/interfaces colocated in `types.ts` next to implementation

## Key Files
- Root layout: `app/layout.tsx`
- Global styles: `app/globals.css`
- DS barrel: `app/ds/index.ts`
- Shared barrel: `app/shared/index.ts`
- Utils barrel: `app/utils/index.ts`
- Tailwind utilities: `app/utils/tailwind/tailwind.ts`
- Join class: `app/utils/join-class/joinClass.ts`
- HTTP client: `app/shared/services/http/http.ts`
- Auth session (server): `app/shared/lib/auth/session/session.ts`
- Auth server actions: `app/shared/lib/auth/server.ts`

## JIT Index Hints
```bash
# Find a DS component
find app/ds -name "*.tsx" ! -name "*.spec.tsx"

# Find all spec/test files
find app -name "*.spec.tsx" -o -name "*.spec.ts"

# Find "use client" components
rg -n '"use client"' app/

# Find exported hooks
rg -n "export (const|function) use" app/

# Find Tailwind class maps
rg -n "Record<" app/ds/
```

## Common Gotchas
- Client-side env vars must use `NEXT_PUBLIC_` prefix; server-only vars must NOT
- `cookies()` from `next/headers` is async in Next.js 16 — always `await cookies()`
- `"server-only"` import prevents accidental server code leaking to client bundles
- Modal still uses SCSS (`app/ds/modal/Modal.scss`) — migrate with care

## Pre-PR Checks
```bash
yarn lint && yarn build
```
