import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskCard from '../../frontend/src/components/TaskCard'

const mockTask = {
  id:          1,
  title:       'Implementar autenticação JWT',
  description: 'Criar endpoints de login e registro com tokens JWT',
  status:      'pending',
  priority:    'high',
  user_id:     1,
  created_at:  '2026-01-15T10:00:00Z',
  updated_at:  '2026-01-15T10:00:00Z',
}

describe('TaskCard', () => {
  it('renderiza o título da tarefa corretamente', () => {
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />)
    expect(screen.getByText('Implementar autenticação JWT')).toBeInTheDocument()
  })

  it('renderiza a descrição da tarefa', () => {
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />)
    expect(screen.getByText('Criar endpoints de login e registro com tokens JWT')).toBeInTheDocument()
  })

  it('exibe o badge de status correto para "pending"', () => {
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />)
    expect(screen.getByText('Pendente')).toBeInTheDocument()
  })

  it('exibe o badge de status correto para "done"', () => {
    const doneTask = { ...mockTask, status: 'done' }
    render(<TaskCard task={doneTask} onEdit={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />)
    expect(screen.getByText('Concluído')).toBeInTheDocument()
  })

  it('exibe o badge de status correto para "in_progress"', () => {
    const inProgressTask = { ...mockTask, status: 'in_progress' }
    render(<TaskCard task={inProgressTask} onEdit={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />)
    expect(screen.getByText('Em andamento')).toBeInTheDocument()
  })

  it('chama onToggle com o ID correto ao clicar em Avançar', () => {
    const onToggle = vi.fn()
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button', { name: /alternar status/i }))
    expect(onToggle).toHaveBeenCalledWith(1)
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('chama onEdit com a tarefa ao clicar no botão de editar', () => {
    const onEdit = vi.fn()
    render(<TaskCard task={mockTask} onEdit={onEdit} onDelete={vi.fn()} onToggle={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /editar tarefa/i }))
    expect(onEdit).toHaveBeenCalledWith(mockTask)
  })

  it('chama onDelete com o ID correto ao clicar em excluir', () => {
    const onDelete = vi.fn()
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={onDelete} onToggle={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /excluir tarefa/i }))
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('exibe "↩ Reabrir" quando a tarefa está concluída', () => {
    const doneTask = { ...mockTask, status: 'done' }
    render(<TaskCard task={doneTask} onEdit={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />)
    expect(screen.getByText(/reabrir/i)).toBeInTheDocument()
  })

  it('não renderiza descrição quando ela está vazia', () => {
    const noDescTask = { ...mockTask, description: '' }
    render(<TaskCard task={noDescTask} onEdit={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />)
    expect(screen.queryByText('Criar endpoints')).not.toBeInTheDocument()
  })
})
