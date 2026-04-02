"use server"

import { revalidatePath } from "next/cache"
import prisma from "./db"

export async function addTask(formData: FormData) {
    await prisma.task.create({
        data: {
            title: formData.get("title") as string,
        }
    })

    revalidatePath("/") // revalidate the home page to show the new task
}