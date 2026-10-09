import api, { API_URL } from './api'

const isDemoMode = !API_URL
const STORAGE_KEY = 'tm_tasks'

// ---------------------------------------------------------------------------
// Helpers para o modo demo (localStorage como "banco de dados")
// ---------------------------------------------------------------------------
function getStoredTasks() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) return JSON.parse(raw)

  // Dados iniciais de exemplo
  const seed = [
    { id: 1, title: 'Configurar ambiente de desenvolvimento', description: 'Instalar PHP, Node.js e PostgreSQL', status: 'done',        priority: 'high',   user_id: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, title: 'Implementar autenticação JWT',           description: 'Criar endpoints de login e registro', status: 'done',        priority: 'high',   user_id: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 3, title: 'Criar CRUD de tarefas',                  description: 'Endpoints REST com validação de dados', status: 'in_progress', priority: 'high',   user_id: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 4, title: 'Desenvolver frontend React',             description: 'Interface com React + Vite',           status: 'in_progress', priority: 'medium', user_id: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 5, title: 'Escrever testes unitários',              description: 'PHPUnit e Vitest com 80% de cobertura', status: 'pending',     priority: 'medium', user_id: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 6, title: 'Configurar CI/CD GitHub Actions',        description: 'Deploy automático no GitHub Pages',    status: 'pending',     priority: 'low',    user_id: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
  return seed
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function nextId(tasks) {
  return tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1
}

// ---------------------------------------------------------------------------
// Task Service
// ---------------------------------------------------------------------------

export async function getTasks(filters = {}) {
  if (isDemoMode) {
    let tasks = getStoredTasks()
    if (filters.status)   tasks = tasks.filter((t) => t.status   === filters.status)
    if (filters.priority) tasks = tasks.filter((t) => t.priority === filters.priority)
    return tasks
  }

  const params = {}
  if (filters.status)   params.status   = filters.status
  if (filters.priority) params.priority = filters.priority

  const { data } = await api.get('/tasks', { params })
  return data.data
}

export async function createTask(taskData) {
  if (isDemoMode) {
    const tasks   = getStoredTasks()
    const newTask = {
      id:          nextId(tasks),
      title:       taskData.title,
      description: taskData.description || '',
      status:      taskData.status      || 'pending',
      priority:    taskData.priority    || 'medium',
      user_id:     1,
      created_at:  new Date().toISOString(),
      updated_at:  new Date().toISOString(),
    }
    tasks.unshift(newTask)
    saveTasks(tasks)
    return newTask
  }

  const { data } = await api.post('/tasks', taskData)
  return data.data
}

export async function updateTask(id, taskData) {
  if (isDemoMode) {
    const tasks = getStoredTasks()
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) throw new Error('Tarefa não encontrada')
    tasks[index] = { ...tasks[index], ...taskData, updated_at: new Date().toISOString() }
    saveTasks(tasks)
    return tasks[index]
  }

  const { data } = await api.put(`/tasks/${id}`, taskData)
  return data.data
}

export async function toggleTask(id) {
  if (isDemoMode) {
    const tasks = getStoredTasks()
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) throw new Error('Tarefa não encontrada')

    const nextStatus = { pending: 'in_progress', in_progress: 'done', done: 'pending' }
    tasks[index].status     = nextStatus[tasks[index].status] || 'pending'
    tasks[index].updated_at = new Date().toISOString()
    saveTasks(tasks)
    return tasks[index]
  }

  const { data } = await api.patch(`/tasks/${id}/toggle`)
  return data.data
}

export async function deleteTask(id) {
  if (isDemoMode) {
    const tasks   = getStoredTasks()
    const updated = tasks.filter((t) => t.id !== id)
    saveTasks(updated)
    return true
  }

  await api.delete(`/tasks/${id}`)
  return true
}
