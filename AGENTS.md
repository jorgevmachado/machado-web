<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
Esta versão tem breaking changes — APIs, convenções e estrutura podem diferir do padrão. Consulte sempre a doc em `node_modules/next/dist/docs/`.
<!-- END:nextjs-agent-rules -->

# machado-web

## Package Identity
Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS v4 · ESLint 9.
Frontend com design system (`app/ds/`), utilitários de auth/HTTP (`app/shared/`), helpers (`app/utils/`).

## Setup & Run
```bash
yarn install
yarn dev
yarn build
yarn lint
yarn test
yarn test:coverage
yarn test:visual
```

Playwright usa `E2E_PORT` quando definido; o padrão local é `3003`:

```bash
E2E_PORT=3010 yarn test:visual
```

## Patterns & Conventions
- Prefira Server Components; só use `"use client"` quando necessário
- DS: cada componente em pasta própria, barrel em `index.ts`
- Use imports absolutos `@/`
- SCSS só onde já existe (ex: `app/ds/modal/Modal.scss`)
- Hooks: exporte como `export function useX`
- Services: herde de `BaseServiceAbstract`
- Tipos sempre explícitos, sem `any`
- Env vars client: `NEXT_PUBLIC_`; server: nunca use esse prefixo

## Key Files
- Layout raiz: `app/layout.tsx`
- DS barrel: `app/ds/index.ts`
- Auth session: `app/shared/lib/auth/session/session.ts`
- HTTP client: `app/shared/services/http/http.ts`

## JIT Index Hints
```bash
find app/ds -name "*.tsx" ! -name "*.spec.tsx"
find app -name "*.spec.tsx" -o -name "*.spec.ts"
rg -n '"use client"' app/
rg -n "export (const|function) use" app/
```

## Common Gotchas
- Env vars: `NEXT_PUBLIC_` para client, nunca para server
- `cookies()` é async no Next.js 16
- Sempre importe `"server-only"` em código server-only

## Pre-PR Checks

```bash
yarn lint && yarn build && yarn test
```

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
