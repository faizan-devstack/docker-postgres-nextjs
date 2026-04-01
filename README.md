# Prisma ORM with Docker, PostgreSQL & Next.js

Proper implementation of [Prisma ORM](https://www.prisma.io/) with a Dockerized [PostgreSQL](https://www.postgresql.org/) database in a [Next.js](https://nextjs.org) application. This project demonstrates the correct setup using Prisma's native driver adapter (`@prisma/adapter-pg`) for an optimized connection to PostgreSQL.

## Tech Stack

- **Next.js 16** — App Router, Server Actions, React 19
- **Prisma 7** — ORM with generated client, `prisma.config.ts`, and native driver adapters
- **`@prisma/adapter-pg`** — Native PostgreSQL adapter for Prisma (replaces the default connector)
- **PostgreSQL 15** — Runs in a Docker container via Docker Compose
- **TypeScript** — Fully typed throughout
- **Tailwind CSS 4** — Utility-first styling

## Project Structure

```
├── app/                  # Next.js App Router
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── db.ts             # Prisma client singleton (with PrismaPg adapter)
│   ├── actions.ts        # Next.js Server Actions
│   └── generated/prisma/ # Auto-generated Prisma client output
├── prisma/
│   └── schema.prisma     # Database schema
├── prisma.config.ts      # Prisma configuration file
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

### Server Actions

Database mutations are handled via Next.js Server Actions, keeping database logic on the server:

```ts
// lib/actions.ts
"use server";
import prisma from "./db";

export async function addTask(formData: FormData) {
  await prisma.task.create({
    data: { title: formData.get("title") as string },
  });
}
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
