# Swafri Talent

This project is a Next.js app with Prisma (PostgreSQL), Better Auth, and UploadThing.

![Swafri Talent demo](public/demo.png)

## Test Accounts

After running `pnpm db:seed`, you can sign in with these seeded accounts:

- `superadmin@example.com` / `superadmin-password` - role: `superAdmin`
- `admin@example.com` / `admin-password` - role: `admin`
- `moderator@example.com` / `moderator-password` - role: `moderator`

These values come from `.env` (`SEED_*`) and are used by `prisma/seed.ts`.

Important notes:

- If any `SEED_*` email/password is missing, that user is skipped.
- If the user already exists, seeding does not overwrite it.
- `talent1@example.com` to `talent12@example.com` are sample `TalentProfile` records, not login users.

## Step-by-Step: Run the Project Locally

### 1) Install dependencies

```bash
pnpm install
```

### 2) Create environment file

Copy `.env.example` to `.env` in the project root and update values:

- `DATABASE_URL` (example: `postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public`)
- `BETTER_AUTH_SECRET` (use a long random secret)
- `BETTER_AUTH_URL` (example: `http://localhost:3000`)
- `UPLOADTHING_TOKEN` (required for file upload features)
- `SEED_*` values (optional, but needed for predictable test logins)

### 3) Generate Prisma client

```bash
pnpm db:generate
```

### 4) Apply schema to local database

```bash
pnpm db:push
```

### 5) Seed database (users + sample talents)

```bash
pnpm db:seed
```

### 6) Start dev server

```bash
pnpm dev
```

App runs at `http://localhost:3000`.

## Verify the App (Quick Checklist)

1. Open the app and verify public pages load.
2. Sign in as `superadmin@example.com`; verify full admin-level access.
3. Sign in as `admin@example.com`; verify admin workflows available to admin role.
4. Sign in as `moderator@example.com`; verify moderation workflows for moderator role.
5. Open the talent listing and confirm sample talents are visible.
6. If uploads are part of your test, verify upload actions with a valid `UPLOADTHING_TOKEN`.

## Useful Commands

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm start
```

## Troubleshooting

- **Prisma command fails with `DATABASE_URL` error**: verify `.env` exists and includes `DATABASE_URL`.
- **Cannot sign in with seeded accounts**: run `pnpm db:seed` again and confirm `SEED_`* values are set in `.env`.
- **Seed appears to do nothing**: existing users are not overwritten by seed logic.
- **Upload feature fails**: verify `UPLOADTHING_TOKEN` is valid.
