import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Task Manager - Next.js, Prisma & PostgreSQL",
  description: "Beautiful Todo Application with Next.js 16, Prisma ORM, and PostgreSQL in Docker. Modern UI with dark/light theme switching.",
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-16x16.png",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    title: "Task Manager",
    description: "Modern task management app built with Next.js, Prisma, and PostgreSQL",
    url: "https://taskmanager.example.com",
    siteName: "Task Manager",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Task Manager - Built with Next.js, Prisma, and PostgreSQL",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Task Manager",
    description: "Modern task management app with Next.js, Prisma & PostgreSQL",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-canvas-base" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
