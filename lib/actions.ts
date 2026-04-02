"use server"

import { revalidatePath } from "next/cache"
import prisma from "./db"

export async function addTask(formData: FormData) {
    const title = formData.get("title") as string
    if (!title.trim()) return

    await prisma.task.create({
        data: {
            title,
        }
    })

    revalidatePath("/")
}

export async function updateTask(id: string, formData: FormData) {
    const title = formData.get("title") as string
    if (!title.trim()) return

    await prisma.task.update({
        where: { id },
        data: {
            title,
        }
    })

    revalidatePath("/")
}

export async function toggleTask(id: string) {
    const task = await prisma.task.findUnique({
        where: { id }
    })

    if (!task) return

    await prisma.task.update({
        where: { id },
        data: {
            completed: !task.completed
        }
    })

    revalidatePath("/")
}

export async function deleteTask(id: string) {
    await prisma.task.delete({
        where: { id }
    })

    revalidatePath("/")
}