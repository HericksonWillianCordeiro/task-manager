import { useState, useEffect } from 'react'
import styles from './TaskForm.module.css'

const EMPTY = { title: '', description: '', status: 'pending', priority: 'medium' }

export default function TaskForm({ task, onSave, onClose }) {
  const [form, setForm]     = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // Preenche o formulário quando editando uma tarefa existente
  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title       || '',
        description: task.description || '',
        status:      task.status      || 'pending',
        priority:    task.priority    || 'medium',
      })
    } else {
      setForm(EMPTY)
    }
    setErrors({})
  }, [task])

  function validate() {
    const errs = {}
    if (!form.title.trim() || form.title.trim().length < 3) {
      errs.title = 'Título deve ter pelo menos 3 caracteres.'
    }
    if (form.title.trim().length > 200) {
      errs.title = 'Título deve ter no máximo 200 caracteres.'
    }
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setSaving(true)
    try {
      await onSave({ ...form, title: form.title.trim(), description: form.description.trim() })
      onClose()
    } catch (err) {
      setErrors({ general: err.message || 'Erro ao salvar tarefa.' })
    } finally {
      setSaving(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Formulário de tarefa">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <p className={styles.errorMsg} role="alert">{errors.general}</p>
          )}

          {/* Título */}
          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>Título *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              placeholder="Ex: Implementar autenticação JWT"
              maxLength={200}
              autoFocus
            />
            {errors.title && <span className={styles.fieldError}>{errors.title}</span>}
          </div>

          {/* Descrição */}
          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>Descrição</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Descreva os detalhes da tarefa..."
              rows={3}
            />
          </div>

          {/* Status e Prioridade lado a lado */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="status" className={styles.label}>Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange} className={styles.select}>
                <option value="pending">⏳ Pendente</option>
                <option value="in_progress">🔄 Em andamento</option>
                <option value="done">✅ Concluído</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="priority" className={styles.label}>Prioridade</label>
              <select id="priority" name="priority" value={form.priority} onChange={handleChange} className={styles.select}>
                <option value="high">🔴 Alta</option>
                <option value="medium">🟡 Média</option>
                <option value="low">🟢 Baixa</option>
              </select>
            </div>
          </div>

          {/* Botões */}
          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Salvando...' : task ? 'Salvar alterações' : 'Criar tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
