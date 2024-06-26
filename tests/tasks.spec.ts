import { expect, test } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helper'
import { TasksPage } from './support/pages/tasks'

import data from './fixtures/task.json'

let taskPage: TasksPage

test.beforeEach(({ page }) => {
    taskPage = new TasksPage(page)
})

test.describe('cadastro', () => {
    test('deve poder cadastrar uma nova tarefa', async ({ request }) => {
        const task = data.success as TaskModel

        await deleteTaskByHelper(request, task.name)

        await taskPage.go()
        await taskPage.create(task)
        await taskPage.shouldHaveText(task.name)
    })

    test('não deve permitir tarefas duplicas', async ({ request }) => {
        const task = data.duplicate as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        await taskPage.go()
        await taskPage.create(task)
        await taskPage.alertHaveText('Task already exists!')
    })

    test('campo obrigatório', async () => {
        const task = data.required as TaskModel

        await taskPage.go()
        await taskPage.create(task)

        const validationMessage = await taskPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        expect(validationMessage).toEqual('This is a required field')
    })
})

test.describe('atualização', () => {
    test('deve concluir uma tarefa', async ({ request }) => {
        const task = data.update as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        await taskPage.go()
        await taskPage.toggle(task.name)
        await taskPage.shouldBeDone(task.name)
    })
})

test.describe('exclusão', () => {
    test('deve excluir uma tarefa', async ({ request }) => {
        const task = data.delete as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        await taskPage.go()
        await taskPage.remove(task.name)
        await taskPage.shouldNotExist(task.name)
    })
})