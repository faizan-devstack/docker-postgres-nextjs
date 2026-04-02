# Prisma ORM with Docker, PostgreSQL & Next.js

Proper implementation of [Prisma ORM](https://www.prisma.io/) with a Dockerized [PostgreSQL](https://www.postgresql.org/) database in a [Next.js](https://nextjs.org) application. This project demonstrates the correct setup using Prisma's native driver adapter (`@prisma/adapter-pg`) for an optimized connection to PostgreSQL.

The app itself is a simple task manager — you can add tasks and they persist to the database, with the UI instantly updating via `revalidatePath`.

## Tech Stack

- **Next.js 16** — App Router, Server Actions, React Compiler, React 19
- **Prisma 7** — ORM with generated client, `prisma.config.ts`, and native driver adapters
- **`@prisma/adapter-pg`** — Native PostgreSQL adapter for Prisma (replaces the default connector)
- **PostgreSQL 15** — Runs in a Docker container via Docker Compose
- **TypeScript** — Fully typed throughout
- **Tailwind CSS 4** — Utility-first styling with dark theme

## Project Structure

```
├── app/
│   ├── layout.tsx        # Root layout with Geist font + dark theme
│   └── page.tsx          # Task list UI (Server Component + form)
├── lib/
│   ├── db.ts             # Prisma client singleton (with PrismaPg adapter)
│   ├── actions.ts        # Server Action: addTask + revalidatePath
│   └── generated/prisma/ # Auto-generated Prisma client output
├── prisma/
│   └── schema.prisma     # Database schema
├── prisma.config.ts      # Prisma configuration file
├── next.config.ts        # Next.js config (React Compiler enabled)
└── compose.yaml          # Docker Compose for PostgreSQL
```

## Getting Started

### 1. Start the PostgreSQL database

```bash
docker compose up -d
```

This starts a PostgreSQL 15 instance on port `5432` with the password `password`.

### 2. Configure the environment

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres"
```

### 3. Install dependencies

```bash
pnpm install
```

### 4. Push the schema to the database

```bash
npx prisma db push
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Key Implementation Details

### Native Driver Adapter

Instead of Prisma's default connector, this project uses `@prisma/adapter-pg` for a direct, optimized connection to PostgreSQL:

```ts
// lib/db.ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;
```

### Prisma Config File

The `prisma.config.ts` file is used instead of env-only configuration, providing explicit control over schema path, migrations directory, and datasource URL:

```ts
// prisma.config.ts
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env["DATABASE_URL"] },
});
```

### Server Component Data Fetching

The home page is an async Server Component that queries the database directly — no API route needed:

```ts
// app/page.tsx
export default async function Home() {
  const tasks = await prisma.task.findMany();
  // ...render tasks + form
}
```

### Server Actions with Cache Revalidation

After mutating the database, `revalidatePath` invalidates the cached page so the new task appears immediately without a full reload:

```ts
// lib/actions.ts
"use server";
import { revalidatePath } from "next/cache";
import prisma from "./db";

export async function addTask(formData: FormData) {
  await prisma.task.create({
    data: { title: formData.get("title") as string },
  });
  revalidatePath("/");
}
```

### React Compiler

The React Compiler is enabled in `next.config.ts`, allowing React to automatically optimize re-renders without manual `useMemo` / `useCallback`:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  reactCompiler: true,
};
```

## Database Schema

```prisma
model Task {
  id        String   @id @default(uuid())
  title     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
