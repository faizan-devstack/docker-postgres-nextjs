"use server"

import prisma from "./db"

export async function addTask(formData: FormData) {
    await prisma.task.create({
        data: {
            title: formData.get("title") as string,
        }
    })
}