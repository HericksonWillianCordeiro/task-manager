import { useState, useCallback, useEffect } from 'react'
import {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
} from '../services/taskService'

/**
 * Hook customizado para gerenciar o estado das tarefas.
 * Encapsula todas as operações CRUD e o estado de loading/error.
 */
export function useTasks(filters = {}) {
  const [tasks, setTasks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getTasks(filters)
      setTasks(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar tarefas.')
    } finally {
      setLoading(false)
    }
  }, [filters.status, filters.priority]) // eslint-disable-line

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTask = useCallback(async (taskData) => {
    const newTask = await createTask(taskData)
    setTasks((prev) => [newTask, ...prev])
    return newTask
  }, [])

  const editTask = useCallback(async (id, taskData) => {
    const updated = await updateTask(id, taskData)
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    return updated
  }, [])

  const toggle = useCallback(async (id) => {
    const updated = await toggleTask(id)
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    return updated
  }, [])

  const remove = useCallback(async (id) => {
    await deleteTask(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { tasks, loading, error, refetch: fetchTasks, addTask, editTask, toggle, remove }
}
