import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-canvas-border/40 bg-canvas-bg-subtle px-2.5 py-1 text-base text-canvas-text placeholder:text-canvas-solid/60 transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-canvas-text-contrast focus-visible:border-canvas-border/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-canvas-bg disabled:opacity-50 aria-invalid:border-alert/40 md:text-sm shadow-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
