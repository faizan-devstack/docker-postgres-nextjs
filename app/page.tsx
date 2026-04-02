import { Card } from "@/components/ui/card"
import prisma from "@/lib/db"
import TaskForm from "./components/TaskForm"
import TaskItem from "./components/TaskItem"
import { ThemeSwitcher } from "./components/ThemeSwitcher"

export default async function Home() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="min-h-screen bg-canvas-bg">
      {/* Navbar */}
      <nav className="border-b border-canvas-border/40 bg-canvas-base sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto lg:px-0 px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-canvas-text-contrast">Task Manager</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </nav>

      <div className="py-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <p className="text-lg text-canvas-text">
              Stay organized and track your daily tasks
            </p>
          </div>

          {/* Form */}
          <div className="mb-6">
            <TaskForm />
          </div>

          {/* Tasks List */}
          <Card className="p-6">
            {tasks.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-canvas-solid text-lg">No tasks yet. Add one to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    completed={task.completed}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Stats */}
          {tasks.length > 0 && (
            <div className="mt-8 text-center text-sm text-canvas-text">
              <p>
                {tasks.filter(t => !t.completed).length} of {tasks.length} tasks remaining
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
