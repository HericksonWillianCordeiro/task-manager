import styles from './TaskCard.module.css'

const STATUS_MAP = {
  pending:     { label: 'Pendente',      class: 'pending' },
  in_progress: { label: 'Em andamento',  class: 'inProgress' },
  done:        { label: 'Concluído',     class: 'done' },
}

const PRIORITY_MAP = {
  high:   { label: 'Alta',  icon: '🔴' },
  medium: { label: 'Média', icon: '🟡' },
  low:    { label: 'Baixa', icon: '🟢' },
}

export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const status   = STATUS_MAP[task.status]   || STATUS_MAP.pending
  const priority = PRIORITY_MAP[task.priority] || PRIORITY_MAP.medium

  const formattedDate = new Date(task.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <article
      className={`${styles.card} ${task.status === 'done' ? styles.done : ''}`}
      aria-label={`Tarefa: ${task.title}`}
    >
      {/* Status badge */}
      <span className={`${styles.badge} ${styles[status.class]}`}>
        {status.label}
      </span>

      {/* Título */}
      <h3 className={styles.title}>{task.title}</h3>

      {/* Descrição */}
      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      {/* Metadados */}
      <div className={styles.meta}>
        <span className={styles.priority} title={`Prioridade ${priority.label}`}>
          {priority.icon} {priority.label}
        </span>
        <span className={styles.date}>{formattedDate}</span>
      </div>

      {/* Ações */}
      <div className={styles.actions}>
        <button
          className={styles.toggleBtn}
          onClick={() => onToggle(task.id)}
          aria-label="Alternar status"
          title="Avançar status"
        >
          {task.status === 'done' ? '↩ Reabrir' : '▶ Avançar'}
        </button>

        <button
          className={styles.editBtn}
          onClick={() => onEdit(task)}
          aria-label="Editar tarefa"
        >
          ✏️
        </button>

        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(task.id)}
          aria-label="Excluir tarefa"
        >
          🗑️
        </button>
      </div>
    </article>
  )
}
