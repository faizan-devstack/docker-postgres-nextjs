import { addTask } from "@/lib/actions";
import prisma from "@/lib/db";

type Task = {
  id: string | number;
  title: string;
}

export default async function Home() {
  const tasks = await prisma.task.findMany()

  return (
    <div className="min-h-screen flex flex-col gap-12 items-center justify-center">
      <h1 className="text-5xl font-semibold text-center">
        All tasks:
      </h1>

      <div className="">
        {tasks.map((task: Task) => (
          <div
            key={task.id}
            className="text-xl px-3 py-1 rounded"
          >
            {task.title}
          </div>
        ))}
      </div>

      <form action={addTask} className="flex gap-2">
        <input
          type="text"
          name="title"
          className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-0"
        />
        <button
          type="submit"
          className="px-6 py-2 rounded transition-colors font-medium bg-blue-600 hover:bg-blue-500"
        >
          Add task
        </button>
      </form>
    </div>
  );
}
