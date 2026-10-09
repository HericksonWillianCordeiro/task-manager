import { useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import Header from '../components/Header'
import FilterBar from '../components/FilterBar'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import styles from './DashboardPage.module.css'

export default function DashboardPage({ theme, onToggleTheme }) {
  const [filters, setFilters]       = useState({})
  const [editingTask, setEditingTask] = useState(undefined) // undefined = fechado, null = novo, object = editando
  const { tasks, loading, error, addTask, editTask, toggle, remove } = useTasks(filters)

  async function handleSave(formData) {
    if (editingTask) {
      await editTask(editingTask.id, formData)
    } else {
      await addTask(formData)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return
    await remove(id)
  }

  // Estatísticas rápidas
  const stats = {
    total:      tasks.length,
    pending:    tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    done:       tasks.filter((t) => t.status === 'done').length,
  }

  return (
    <div className={styles.layout}>
      <Header theme={theme} onToggleTheme={onToggleTheme} />

      <main className={styles.main}>
        <div className={styles.container}>

          {/* Estatísticas */}
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <span className={styles.statNum}>{stats.total}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
            <div className={`${styles.statCard} ${styles.statPending}`}>
              <span className={styles.statNum}>{stats.pending}</span>
              <span className={styles.statLabel}>Pendentes</span>
            </div>
            <div className={`${styles.statCard} ${styles.statProgress}`}>
              <span className={styles.statNum}>{stats.inProgress}</span>
              <span className={styles.statLabel}>Em andamento</span>
            </div>
            <div className={`${styles.statCard} ${styles.statDone}`}>
              <span className={styles.statNum}>{stats.done}</span>
              <span className={styles.statLabel}>Concluídas</span>
            </div>
          </div>

          {/* Barra de filtros + botão novo */}
          <div className={styles.toolbar}>
            <FilterBar filters={filters} onChange={setFilters} total={tasks.length} />
            <button
              className={styles.newBtn}
              onClick={() => setEditingTask(null)}
              aria-label="Nova tarefa"
            >
              + Nova Tarefa
            </button>
          </div>

          {/* Estados */}
          {loading && (
            <div className={styles.center}>
              <div className={styles.spinner} aria-label="Carregando..." />
            </div>
          )}

          {error && (
            <div className={styles.errorBox} role="alert">
              ⚠️ {error}
            </div>
          )}

          {!loading && !error && tasks.length === 0 && (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>📋</span>
              <p>Nenhuma tarefa encontrada.</p>
              <button className={styles.newBtn} onClick={() => setEditingTask(null)}>
                Criar primeira tarefa
              </button>
            </div>
          )}

          {/* Grid de tarefas */}
          {!loading && tasks.length > 0 && (
            <div className={styles.grid}>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={setEditingTask}
                  onDelete={handleDelete}
                  onToggle={toggle}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal de criação/edição */}
      {editingTask !== undefined && (
        <TaskForm
          task={editingTask}
          onSave={handleSave}
          onClose={() => setEditingTask(undefined)}
        />
      )}
    </div>
  )
}
