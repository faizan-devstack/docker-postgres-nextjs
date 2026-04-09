# Prisma ORM with Docker, PostgreSQL & Next.js — Beautiful Task Manager

A modern, fully-featured task management application demonstrating proper implementation of [Prisma ORM](https://www.prisma.io/) with a Dockerized [PostgreSQL](https://www.postgresql.org/) database in a [Next.js](https://nextjs.org) application.

**Features:**
- ✨ Beautiful, modern UI with dark/light theme switching
- 🎨 Designrift theme system with smooth transitions
- 📝 Complete CRUD operations (Create, Read, Update, Delete, Toggle)
- 🌙 Next-themes integration for persistent theme preferences
- 🎭 Smooth animations and transitions
- 📱 Fully responsive design
- ♿ Accessible components and interactions

## Tech Stack

- **Next.js 16** — App Router, Server Actions, React Compiler, React 19
- **Prisma 7** — ORM with generated client, `prisma.config.ts`, and native driver adapters
- **`@prisma/adapter-pg`** — Native PostgreSQL adapter for Prisma
- **PostgreSQL 15** — Runs in a Docker container via Docker Compose
- **TypeScript** — Fully typed throughout
- **Tailwind CSS 4** — Utility-first styling with advanced features
- **shadcn/ui** — High-quality, accessible components
- **next-themes** — Theme management and persistence
- **DM Sans** — Beautiful, modern typography
- **Lucide Icons** — Clean, consistent iconography

## Project Structure

```
├── app/
│   ├── layout.tsx                    # Root layout with theme provider & DM Sans
│   ├── page.tsx                      # Task list UI with navbar & theme switcher
│   ├── providers.tsx                 # Next-themes provider setup
│   ├── components/
│   │   ├── TaskForm.tsx             # Form component for adding tasks
│   │   ├── TaskItem.tsx             # Individual task with edit/delete modals
│   │   └── ThemeSwitcher.tsx        # Dark/light mode toggle with animations
│   ├── globals.css                  # Global styles, Designrift theme system
│   └── components/
├── components/
│   └── ui/                          # shadcn/ui component library
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       └── dialog.tsx
├── lib/
│   ├── db.ts                        # Prisma client singleton (with PrismaPg adapter)
│   ├── actions.ts                   # Server Actions: CRUD operations
│   ├── utils.ts                     # Utility functions
│   └── generated/prisma/            # Auto-generated Prisma client
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── migrations/                  # Database migration history
├── prisma.config.ts                 # Prisma configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── next.config.ts                   # Next.js configuration
└── compose.yaml                     # Docker Compose for PostgreSQL
```

## Getting Started

### Prerequisites

- **Docker** and **Docker Compose** installed
- **Node.js 18+** and **pnpm** installed

### Local Setup

#### 1. Clone and install dependencies

```bash
pnpm install
```

#### 2. Start the PostgreSQL database

```bash
docker compose up -d
```

This starts a PostgreSQL 15 instance on port `5432` with the password `password`.

#### 3. Configure the environment

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres"
```

#### 4. Run database migrations

```bash
pnpm exec prisma migrate dev
```

This applies all migrations from the `prisma/migrations` folder to set up your database schema.

#### 5. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

#### 6. (Optional) View your database

```bash
pnpm exec prisma studio
```

This opens an interactive UI to browse and manage your database at [http://localhost:5555](http://localhost:5555).

## Features

### 🎨 Beautiful UI System

This project features a comprehensive design system powered by:

- **Designrift Theme** — Carefully crafted color system with light and dark modes
  - Canvas colors for backgrounds and surfaces
  - Primary, secondary, success, warning, and alert color systems
  - Smooth transitions between themes
- **shadcn/ui Components** — High-quality, accessible component library used throughout
- **DM Sans Typography** — Modern, readable font with multiple weights
- **Refined Aesthetics** — Soft borders, removed focus rings, subtle shadows

### 🌙 Dark & Light Mode

- **Next-themes Integration** — Seamless theme switching with persistence
- **System Preference Detection** — Auto-detects and respects OS dark mode settings
- **Animated Switcher** — Beautiful Sun/Moon icon with rotation animations
- **Instant Transitions** — Smooth theme changes without page reload

### 📝 Complete CRUD Operations

- **Create** — Add new tasks with the beautiful input form
- **Read** — Display all tasks with real-time updates
- **Update** — Edit task titles with modal dialog
- **Delete** — Remove tasks with confirmation modal
- **Toggle** — Mark tasks as complete/incomplete with checkbox

All operations use Next.js Server Actions for secure, server-side database mutations with automatic cache revalidation.

### 🎭 Advanced Component Architecture

- **TaskForm** — Client component with loading states and form validation
- **TaskItem** — Feature-rich task display with inline editing and deletion
- **ThemeSwitcher** — Theme switching component with hydration safety
- **Dialog Modals** — Edit and delete confirmation dialogs for safe operations

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

### Theme System with next-themes

The project uses `next-themes` for robust theme management with multiple benefits:

```ts
// app/providers.tsx
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  )
}
```

- **Class-based theming** — Toggles the `dark` class on the html element
- **System detection** — Respects `prefers-color-scheme` media query
- **Persistent storage** — Saves user preference in localStorage
- **Hydration-safe** — Prevents flash of unstyled content

### Complete CRUD Operations via Server Actions

All database operations use Next.js Server Actions for security and performance:

```ts
// lib/actions.ts
"use server"

export async function addTask(formData: FormData) {
  await prisma.task.create({ data: { title: formData.get("title") as string } })
  revalidatePath("/")
}

export async function updateTask(id: string, formData: FormData) {
  await prisma.task.update({
    where: { id },
    data: { title: formData.get("title") as string }
  })
  revalidatePath("/")
}

export async function toggleTask(id: string) {
  const task = await prisma.task.findUnique({ where: { id } })
  await prisma.task.update({
    where: { id },
    data: { completed: !task.completed }
  })
  revalidatePath("/")
}

export async function deleteTask(id: string) {
  await prisma.task.delete({ where: { id } })
  revalidatePath("/")
}
```

Each operation revalidates the home page to ensure data is always fresh.

### Design System with Designrift

The project includes a comprehensive design system built with custom CSS variables:

```css
/* Light theme (default) */
:root {
  --canvas-base: #fbfdfc;
  --canvas-text: #6a716e;
  --primary-solid: #12a594;
  --alert-solid: #e93d82;
  /* ...more colors */
}

/* Dark theme */
.dark {
  --canvas-base: #141716;
  --canvas-text: #99a29e;
  --primary-solid: #12a594;
  --alert-solid: #e93d82;
  /* ...more colors */
}
```

All components reference these variables, ensuring consistent styling and seamless theme switching.

### Component Library with shadcn/ui

The project uses shadcn/ui components customized with the Designrift theme:

- **Button** — Multiple variants (default, outline, ghost, destructive)
- **Input** — Soft borders, focus states, and accessibility features
- **Card** — Container components with spacing and borders
- **Checkbox** — Styled task completion toggles
- **Dialog** — Modal dialogs for editing and confirming actions

All components are built on Base UI and styled with Tailwind CSS for complete customization.

## Running the Application

```bash
# Start the dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# View database with Prisma Studio
npx prisma studio
```

## Development

### Adding New Tasks

1. Open [http://localhost:3000](http://localhost:3000)
2. Type a task title in the input field
3. Click "Add" or press Enter
4. The task appears instantly in the list

### Managing Tasks

- **Mark complete** — Click the checkbox next to a task
- **Edit** — Click "Edit" to update the task title in a modal
- **Delete** — Click "Delete" to remove the task (with confirmation)
- **Toggle theme** — Click the Sun/Moon icon in the navbar

## Performance Optimizations

- ✅ **Server Components** — Async data fetching without client-side requests
- ✅ **Server Actions** — Secure mutations with no API routes needed
- ✅ **Automatic Revalidation** — ISR via `revalidatePath` keeps data fresh
- ✅ **React Compiler** — Automatic optimization of component re-renders
- ✅ **Native Prisma Adapter** — Direct connection to PostgreSQL for lower latency

## Deployment

To deploy to production:

1. Ensure PostgreSQL is available (managed database or Docker)
2. Set `DATABASE_URL` environment variable
3. Run `prisma migrate deploy` before starting the app
4. Deploy with Vercel, Docker, or your hosting platform

Example `.env` for production:
```env
DATABASE_URL="postgresql://user:password@db.provider.com:5432/dbname"
```

## Database Schema

```prisma
model Task {
  id        String   @id @default(uuid())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

The `completed` field allows tasks to be marked as done/undone, while timestamps track creation and modification dates.
