# vk-tooling

Backoffice métier personnel — gestion clients, devis, projets, enquêtes de satisfaction.

## Stack

| | Technologie |
|---|---|
| Frontend | React 19, TypeScript 6, Vite 8, MUI 6 |
| Backend | NestJS 11, TypeScript 5.7 |
| Base de données | PostgreSQL 17 (Docker) |
| ORM | Prisma 7 |
| Auth | JWT (httpOnly cookies) + refresh tokens |

## Démarrage

**Prérequis :** Node 20+, pnpm 9+, Docker

```bash
pnpm install
pnpm dev:all
```

Ça lance en une commande : Postgres, l'API (:3000), le frontend (:5173) et Prisma Studio (:5555).

**Premier lancement uniquement — migration de la base :**

```bash
pnpm --filter @vk/api exec prisma migrate dev
```

**Créer le premier utilisateur :**

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"toi@example.com","password":"monmdp1","name":"Ton Nom"}'
```

## Scripts

| Commande | Description |
|---|---|
| `pnpm dev:all` | Tout démarrer (postgres + api + web + studio) |
| `pnpm dev` | Frontend uniquement |
| `pnpm dev:api` | API uniquement |
| `pnpm studio` | Prisma Studio |
| `pnpm build` | Build frontend |
| `pnpm build:api` | Build API |
| `pnpm lint` | Lint tous les packages |

## Variables d'environnement

Fichier `apps/api/.env` (non commité) :

```env
DATABASE_URL="postgresql://vk:vk_password@localhost:5432/vk_tooling"
JWT_SECRET="change-me-in-production"
```
