import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useTasks } from '../../frontend/src/hooks/useTasks'
import * as taskService from '../../frontend/src/services/taskService'

// Mock do serviço de tarefas
vi.mock('../../frontend/src/services/taskService')

const mockTasks = [
  { id: 1, title: 'Tarefa A', description: '', status: 'pending',     priority: 'high',   user_id: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, title: 'Tarefa B', description: '', status: 'in_progress', priority: 'medium', user_id: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 3, title: 'Tarefa C', description: '', status: 'done',        priority: 'low',    user_id: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

describe('useTasks', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    taskService.getTasks.mockResolvedValue(mockTasks)
  })

  it('carrega as tarefas na montagem do componente', async () => {
    const { result } = renderHook(() => useTasks())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.tasks).toHaveLength(3)
    expect(result.current.error).toBeNull()
  })

  it('inicia com loading true', () => {
    const { result } = renderHook(() => useTasks())
    expect(result.current.loading).toBe(true)
  })

  it('adiciona uma nova tarefa via addTask', async () => {
    const newTask = { id: 4, title: 'Tarefa D', description: '', status: 'pending', priority: 'medium', user_id: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    taskService.createTask.mockResolvedValue(newTask)

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.addTask({ title: 'Tarefa D', description: '', status: 'pending', priority: 'medium' })
    })

    expect(result.current.tasks).toHaveLength(4)
    expect(result.current.tasks[0].title).toBe('Tarefa D')
  })

  it('remove uma tarefa via remove', async () => {
    taskService.deleteTask.mockResolvedValue(true)

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.remove(1)
    })

    expect(result.current.tasks).toHaveLength(2)
    expect(result.current.tasks.find((t) => t.id === 1)).toBeUndefined()
  })

  it('atualiza uma tarefa via editTask', async () => {
    const updatedTask = { ...mockTasks[0], title: 'Tarefa A Atualizada' }
    taskService.updateTask.mockResolvedValue(updatedTask)

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.editTask(1, { title: 'Tarefa A Atualizada' })
    })

    expect(result.current.tasks[0].title).toBe('Tarefa A Atualizada')
  })

  it('alterna o status de uma tarefa via toggle', async () => {
    const toggled = { ...mockTasks[0], status: 'in_progress' }
    taskService.toggleTask.mockResolvedValue(toggled)

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.toggle(1)
    })

    const task = result.current.tasks.find((t) => t.id === 1)
    expect(task.status).toBe('in_progress')
  })

  it('define error quando getTasks falha', async () => {
    taskService.getTasks.mockRejectedValue({ response: { data: { message: 'Erro de rede' } } })

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Erro de rede')
    expect(result.current.tasks).toHaveLength(0)
  })
})
