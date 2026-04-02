"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { deleteTask, toggleTask, updateTask } from "@/lib/actions"

interface TaskItemProps {
  id: string
  title: string
  completed: boolean
}

export default function TaskItem({ id, title, completed }: TaskItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editTitle, setEditTitle] = useState(title)

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("title", editTitle)
    await updateTask(id, formData)
    setIsEditOpen(false)
  }

  const handleDelete = async () => {
    await deleteTask(id)
    setIsDeleteOpen(false)
  }

  const handleToggle = async () => {
    await toggleTask(id)
  }

  return (
    <>
      <div className="flex items-center gap-3 p-4 border border-canvas-border/40 rounded-lg hover:bg-canvas-bg-active transition-all shadow-sm hover:shadow-md">
        <Checkbox
          checked={completed}
          onCheckedChange={handleToggle}
          aria-label="Toggle task completion"
        />
        <span
          className={`flex-1 text-base transition-all ${
            completed ? "line-through text-canvas-solid" : "text-canvas-text-contrast"
          }`}
        >
          {title}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditOpen(true)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the task title and click save.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Enter task title"
              autoFocus
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
