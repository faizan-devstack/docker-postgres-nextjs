"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { addTask } from "@/lib/actions"

export default function TaskForm() {
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    try {
      await addTask(formData)
      // Reset the form
      const form = document.querySelector("form") as HTMLFormElement
      if (form) form.reset()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="p-6">
      <form
        action={handleSubmit}
        className="flex gap-3"
      >
        <Input
          type="text"
          name="title"
          placeholder="What needs to be done today?"
          disabled={isPending}
          required
        />
        <Button
          type="submit"
          disabled={isPending}
          className="whitespace-nowrap"
        >
          {isPending ? "Adding..." : "Add"}
        </Button>
      </form>
    </Card>
  )
}
