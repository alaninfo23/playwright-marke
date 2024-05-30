import { APIRequestContext, expect } from "@playwright/test"
import { TaskModel } from "../fixtures/task.model"

require('dotenv').config()

const BASE_API = process.env.BASE_API

export const deleteTaskByHelper = async (request: APIRequestContext, taskName: string) => {
    await request.delete(`${BASE_API}/helper/tasks/${taskName}`)
}

export const postTask = async (request: APIRequestContext, task: TaskModel) => {
    const newTask = await request.post(`${BASE_API}/tasks`, { data: task })
    expect(newTask.ok()).toBeTruthy()
}
