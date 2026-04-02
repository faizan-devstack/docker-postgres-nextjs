"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        disabled
        className="opacity-50"
      >
        <Sun className="size-4" />
      </Button>
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="relative w-4 h-4">
        <Sun
          className={`absolute size-4 transition-all duration-300 ${
            isDark
              ? "rotate-90 opacity-0"
              : "rotate-0 opacity-100"
          }`}
        />
        <Moon
          className={`absolute size-4 transition-all duration-300 ${
            isDark
              ? "rotate-0 opacity-100"
              : "-rotate-90 opacity-0"
          }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
