# vk-tooling — Backoffice métier personnel

Monorepo pnpm. Backoffice multi-outils : gestion clients, génération de devis, suivi de projets (Trello-like), enquêtes de satisfaction.

## Structure

```
apps/
  web/   — React 19 frontend
  api/   — NestJS 11 backend
docker-compose.yml   — service postgres uniquement (web non dockerisé en dev)
pnpm-workspace.yaml
```

## Commandes racine

```bash
pnpm dev          # frontend :5173 (ou :5174 si port occupé)
pnpm dev:api      # backend :3000
pnpm build        # build frontend
pnpm build:api    # build backend
pnpm studio       # Prisma Studio :5555
docker compose up -d postgres
```

---

## apps/api — NestJS + Prisma + PostgreSQL

**Stack :** NestJS 11, TypeScript 5.7, Prisma 7, PostgreSQL 17 (Docker), bcrypt, @nestjs/jwt, cookie-parser

**Config importante :**
- `tsconfig.json` : `emitDecoratorMetadata: true`, `experimentalDecorators: true`, `module: commonjs`. Pas de `baseUrl`.
- `prisma.config.ts` : charge `dotenv/config` + définit `datasource.url`. Requis car Prisma v7 a supprimé `url` du `schema.prisma`.
- `src/main.ts` : charge `dotenv/config` en premier import (NestJS ne charge pas `.env` automatiquement), puis `cookie-parser` (syntaxe `import X = require(...)` pour éviter le warning CJS), puis CORS.
- `.env` : `DATABASE_URL` + `JWT_SECRET`

**Auth :**
- JWT en httpOnly cookie (`access_token`, 1h) + refresh token opaque en DB (`refresh_token`, 24h)
- `JwtAuthGuard` enregistré comme `APP_GUARD` global dans `AppModule` → toutes les routes sont protégées par défaut
- `@Public()` pour bypasser la guard (login, refresh, POST /users)
- `@CurrentUser()` pour récupérer le payload JWT depuis `request.user`
- Pas de Passport — guard custom uniquement

**Modules :**
- `PrismaModule` — global, exporte `PrismaService`. Le service passe `PrismaPg` adapter au constructeur (requis par Prisma v7).
- `AuthModule` — exporte `JwtModule` + `JwtAuthGuard`
- `UsersModule` — exporte `UsersService`. `POST /users` est `@Public()` pour la création initiale.

**Prisma schema :**
```
User         — id, email (unique), name?, password (hashé bcrypt), timestamps
RefreshToken — id, token (unique), userId (→ User cascade), expiresAt, createdAt
```

**Migrations :** `pnpm --filter @vk/api exec prisma migrate dev --name <nom>`
**Regénérer le client :** `pnpm --filter @vk/api exec prisma generate`

**Gotchas :**
- `bcrypt` est un module natif → déclaré dans `pnpm.onlyBuiltDependencies` (racine `package.json`)
- `dotenv` doit être en `dependencies` (pas dev) car utilisé au runtime
- `import X = require('...')` pour les modules CJS sans type declarations propres (cookie-parser, etc.)

---

## apps/web — React 19 + MUI + Vite

**Stack :** React 19.2, TypeScript 6.0, Vite 8, react-router-dom 7, MUI 6, @react-pdf/renderer 4

**Config importante :**
- `tsconfig.app.json` : `verbatimModuleSyntax: true` → imports de types avec `import type`. Pas de `baseUrl` (déprécié en TS 6).
- Alias `@/*` → `src/*` (via `paths` dans tsconfig + `resolve.alias` dans vite.config.ts)
- `@react-pdf/renderer` pre-bundlé via `optimizeDeps.include` pour éviter conflits CJS/ESM

**Auth flow :**
- `AuthProvider` wrappé autour de `RouterProvider` dans `App.tsx`
- `useAuth()` expose `user`, `loading`, `login()`, `logout()`
- Au montage : `GET /auth/me` avec `credentials: 'include'` pour restaurer la session
- `ProtectedRoute` dans le router : spinner si `loading`, redirect `/login` si `!user`
- Toutes les requêtes API utilisent `credentials: 'include'` (cookies httpOnly)

**Structure src/ :**
```
App.tsx                        # ThemeProvider + AuthProvider + RouterProvider
context/AuthContext.tsx        # état auth global
router/index.tsx               # createBrowserRouter, ProtectedRoute, routes
layouts/
  AppShell.tsx                 # Sidebar + Topbar + Outlet
  components/
    Sidebar.tsx                # drawer permanent 240px
    Topbar.tsx                 # titre dynamique + bouton déconnexion
pages/
  dashboard/index.tsx
  clients/index.tsx
  devis/index.tsx
  projets/index.tsx
  enquetes/index.tsx
  login/index.tsx              # hors AppShell, hors ProtectedRoute
  not-found/index.tsx          # hors AppShell, hors ProtectedRoute
pdf/templates/DevisTemplate.tsx
theme/theme.ts
```

**Thème néo-brutaliste :**
- `borderRadius: 0`, ombres `4px 4px 0px #000`, palette noir/blanc/jaune `#FFE500`
- Police : Space Grotesk (Google Fonts dans `index.html`)
- Grid MUI : utiliser `@mui/material/Grid2` (pas `Grid`), prop `size`
- Zéro import MUI dans `pdf/templates/` — react-pdf render hors DOM

**Convention pages :** `pages/<section>/index.tsx`

---

## Roadmap features

### Clients
- Formulaire prise de contact
- Questionnaire préliminaire business
- Liste avec recherche/filtres (`@mui/x-data-grid`)
- Fiche client détaillée

### Devis
- Formulaire création (lignes, quantités, TVA)
- Liste avec statuts (brouillon, envoyé, accepté, refusé)
- PDF via `DevisTemplate` + `PDFDownloadLink`
- Numérotation automatique

### Projets
- Board Trello-like (Backlog / En cours / Review / Terminé)
- Drag-and-drop : `@dnd-kit/core` (pas react-beautiful-dnd, déprécié)
- Cartes tâches : assignation, deadline, priorité

### Enquêtes
- Constructeur de formulaire
- Lien public partageable (route hors shell/auth)
- Visualisation résultats (`recharts` ou `@mui/x-charts`)
