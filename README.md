# PariConnect

PariConnect is a local-first elder-care connection platform connecting adults living abroad with their parents in India. The project provides:

- A **child dashboard** for monitoring wellbeing, scheduling caregiver visits, managing subscriptions, and reviewing reports.
- A **parent mobile app** focused on single-tap check-ins, SOS alerts, and offline-friendly voice note uploads with Tamil/English support.
- A **caregiver portal** for verified visits with photo/geo proof and consent tracking.
- An **admin console** for operations, quality, finance, and community management.

The repository is organised as a TypeScript-first monorepo powered by pnpm workspaces.

## Project structure

```text
apps/
  web/        # Next.js dashboard (child + caregiver)
  admin/      # Next.js admin console
  mobile/     # Expo React Native app for parents
packages/
  api/        # Express REST API
  db/         # Prisma schema, migrations, seed scripts
  ui/         # Shared React component library
  types/      # Shared TypeScript contracts
infra/
  docker-compose.yml, nginx config, local seeds
```

## Getting started

1. **Install dependencies**

   ```bash
   corepack enable pnpm
   pnpm install
   ```

2. **Copy environment variables**

   ```bash
   cp .env.example .env
   ```

3. **Run database migrations and seed data**

   ```bash
   pnpm db:migrate
   pnpm seed
   ```

4. **Start the stack**

   ```bash
   pnpm dev
   ```

   - API: http://localhost:4000
   - Web dashboard: http://localhost:3000
   - Caregiver portal: http://localhost:3000/care
   - Admin console: http://localhost:3100

5. **Mobile app**

   ```bash
   pnpm mobile
   ```

   Use the Expo Go app or emulator to load the project.

## Dockerised development

A `docker-compose.yml` file under `infra/` provisions PostgreSQL, Redis, MinIO, the API, web clients, and supporting services.

```bash
cd infra
docker compose up --build
```

Seed data includes:

- 1 child user linked to a Tamil-speaking parent
- 1 caregiver with approved KYC and mixed visit history
- 3 subscription plans (`basic`, `standard`, `premium`)

Nginx is exposed on http://localhost:8080 and proxies `/api`, `/admin`, and `/` to the respective services.

## Testing

The API ships with Jest-based integration tests for check-ins, alerts, visits, and access control.

```bash
pnpm test
```

## Contributing

All code is written in TypeScript. Shared UI components follow the PariConnect design language (Saffron, Teal, Ivory, Charcoal). Ensure new features include documentation and, where applicable, e2e test coverage.

## License

MIT
