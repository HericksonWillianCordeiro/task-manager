import styles from './FilterBar.module.css'

const STATUS_OPTIONS = [
  { value: '',            label: 'Todos os status' },
  { value: 'pending',     label: '⏳ Pendente' },
  { value: 'in_progress', label: '🔄 Em andamento' },
  { value: 'done',        label: '✅ Concluído' },
]

const PRIORITY_OPTIONS = [
  { value: '',       label: 'Todas as prioridades' },
  { value: 'high',   label: '🔴 Alta' },
  { value: 'medium', label: '🟡 Média' },
  { value: 'low',    label: '🟢 Baixa' },
]

export default function FilterBar({ filters, onChange, total }) {
  return (
    <div className={styles.bar}>
      <span className={styles.count}>
        {total} tarefa{total !== 1 ? 's' : ''}
      </span>

      <div className={styles.selects}>
        <select
          value={filters.status ?? ''}
          onChange={(e) => onChange({ ...filters, status: e.target.value || null })}
          className={styles.select}
          aria-label="Filtrar por status"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          value={filters.priority ?? ''}
          onChange={(e) => onChange({ ...filters, priority: e.target.value || null })}
          className={styles.select}
          aria-label="Filtrar por prioridade"
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
