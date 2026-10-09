<?php

declare(strict_types=1);

namespace App\Models;

use App\Database\Connection;
use PDO;

/**
 * Model de Tarefa — encapsula as operações de banco relacionadas a tasks.
 */
class Task
{
    private PDO $db;

    public const STATUSES   = ['pending', 'in_progress', 'done'];
    public const PRIORITIES = ['low', 'medium', 'high'];

    public function __construct()
    {
        $this->db = Connection::getInstance();
    }

    /**
     * Retorna todas as tarefas de um usuário, com filtros opcionais.
     *
     * @return array<int, array<string, mixed>>
     */
    public function findAllByUser(
        int $userId,
        ?string $status   = null,
        ?string $priority = null
    ): array {
        $sql    = 'SELECT * FROM tasks WHERE user_id = :user_id';
        $params = [':user_id' => $userId];

        if ($status !== null && in_array($status, self::STATUSES, true)) {
            $sql           .= ' AND status = :status';
            $params[':status'] = $status;
        }

        if ($priority !== null && in_array($priority, self::PRIORITIES, true)) {
            $sql              .= ' AND priority = :priority';
            $params[':priority'] = $priority;
        }

        $sql .= ' ORDER BY created_at DESC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll();
    }

    /**
     * Busca uma tarefa específica do usuário pelo ID.
     */
    public function findByIdAndUser(int $id, int $userId): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM tasks WHERE id = :id AND user_id = :user_id LIMIT 1'
        );
        $stmt->execute([':id' => $id, ':user_id' => $userId]);

        $task = $stmt->fetch();
        return $task ?: null;
    }

    /**
     * Cria uma nova tarefa e retorna o ID gerado.
     */
    public function create(
        int $userId,
        string $title,
        string $description,
        string $status,
        string $priority
    ): int {
        $stmt = $this->db->prepare(
            'INSERT INTO tasks (user_id, title, description, status, priority)
             VALUES (:user_id, :title, :description, :status, :priority)'
        );
        $stmt->execute([
            ':user_id'     => $userId,
            ':title'       => $title,
            ':description' => $description,
            ':status'      => $status,
            ':priority'    => $priority,
        ]);

        return (int) $this->db->lastInsertId();
    }

    /**
     * Atualiza os dados de uma tarefa. Retorna true se alterou algum registro.
     */
    public function update(
        int $id,
        int $userId,
        string $title,
        string $description,
        string $status,
        string $priority
    ): bool {
        $stmt = $this->db->prepare(
            'UPDATE tasks
             SET title = :title,
                 description = :description,
                 status = :status,
                 priority = :priority
             WHERE id = :id AND user_id = :user_id'
        );
        $stmt->execute([
            ':title'       => $title,
            ':description' => $description,
            ':status'      => $status,
            ':priority'    => $priority,
            ':id'          => $id,
            ':user_id'     => $userId,
        ]);

        return $stmt->rowCount() > 0;
    }

    /**
     * Alterna o status de uma tarefa entre pending → in_progress → done → pending.
     */
    public function toggleStatus(int $id, int $userId): ?array
    {
        $task = $this->findByIdAndUser($id, $userId);
        if ($task === null) {
            return null;
        }

        $nextStatus = match ($task['status']) {
            'pending'     => 'in_progress',
            'in_progress' => 'done',
            'done'        => 'pending',
            default       => 'pending',
        };

        $stmt = $this->db->prepare(
            'UPDATE tasks SET status = :status WHERE id = :id AND user_id = :user_id'
        );
        $stmt->execute([
            ':status'  => $nextStatus,
            ':id'      => $id,
            ':user_id' => $userId,
        ]);

        return $this->findByIdAndUser($id, $userId);
    }

    /**
     * Remove uma tarefa. Retorna true se deletou algum registro.
     */
    public function delete(int $id, int $userId): bool
    {
        $stmt = $this->db->prepare(
            'DELETE FROM tasks WHERE id = :id AND user_id = :user_id'
        );
        $stmt->execute([':id' => $id, ':user_id' => $userId]);

        return $stmt->rowCount() > 0;
    }
}
