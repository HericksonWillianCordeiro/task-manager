<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Middleware\AuthMiddleware;
use App\Models\Task;
use App\Utils\Response;

/**
 * Controlador de Tarefas — CRUD completo com autenticação JWT.
 */
class TaskController
{
    private Task           $taskModel;
    private AuthMiddleware $auth;

    public function __construct()
    {
        $this->taskModel = new Task();
        $this->auth      = new AuthMiddleware();
    }

    /**
     * GET /api/tasks
     * Query params opcionais: ?status=pending&priority=high
     */
    public function index(): void
    {
        $payload = $this->auth->handle();
        $userId  = (int) $payload->sub;

        $status   = $_GET['status']   ?? null;
        $priority = $_GET['priority'] ?? null;

        $tasks = $this->taskModel->findAllByUser($userId, $status, $priority);

        Response::success($tasks, 'Tarefas carregadas com sucesso.');
    }

    /**
     * POST /api/tasks
     * Body: { title, description, status, priority }
     */
    public function store(): void
    {
        $payload = $this->auth->handle();
        $userId  = (int) $payload->sub;

        $body   = $this->parseBody();
        $errors = $this->validateTaskData($body);

        if (!empty($errors)) {
            Response::validationError($errors);
        }

        $taskId = $this->taskModel->create(
            $userId,
            trim($body['title']),
            trim($body['description'] ?? ''),
            $body['status']   ?? 'pending',
            $body['priority'] ?? 'medium'
        );

        $task = $this->taskModel->findByIdAndUser($taskId, $userId);

        Response::success($task, 'Tarefa criada com sucesso.', 201);
    }

    /**
     * GET /api/tasks/{id}
     */
    public function show(int $id): void
    {
        $payload = $this->auth->handle();
        $userId  = (int) $payload->sub;

        $task = $this->taskModel->findByIdAndUser($id, $userId);

        if ($task === null) {
            Response::notFound('Tarefa não encontrada.');
        }

        Response::success($task);
    }

    /**
     * PUT /api/tasks/{id}
     * Body: { title, description, status, priority }
     */
    public function update(int $id): void
    {
        $payload = $this->auth->handle();
        $userId  = (int) $payload->sub;

        $existing = $this->taskModel->findByIdAndUser($id, $userId);
        if ($existing === null) {
            Response::notFound('Tarefa não encontrada.');
        }

        $body   = $this->parseBody();
        $errors = $this->validateTaskData($body);

        if (!empty($errors)) {
            Response::validationError($errors);
        }

        $this->taskModel->update(
            $id,
            $userId,
            trim($body['title']),
            trim($body['description'] ?? ''),
            $body['status']   ?? $existing['status'],
            $body['priority'] ?? $existing['priority']
        );

        $task = $this->taskModel->findByIdAndUser($id, $userId);

        Response::success($task, 'Tarefa atualizada com sucesso.');
    }

    /**
     * PATCH /api/tasks/{id}/toggle
     * Alterna o status: pending → in_progress → done → pending
     */
    public function toggle(int $id): void
    {
        $payload = $this->auth->handle();
        $userId  = (int) $payload->sub;

        $task = $this->taskModel->toggleStatus($id, $userId);

        if ($task === null) {
            Response::notFound('Tarefa não encontrada.');
        }

        Response::success($task, 'Status atualizado com sucesso.');
    }

    /**
     * DELETE /api/tasks/{id}
     */
    public function destroy(int $id): void
    {
        $payload = $this->auth->handle();
        $userId  = (int) $payload->sub;

        $deleted = $this->taskModel->delete($id, $userId);

        if (!$deleted) {
            Response::notFound('Tarefa não encontrada.');
        }

        Response::success(null, 'Tarefa removida com sucesso.');
    }

    // -------------------------------------------------------------------------
    // Helpers privados
    // -------------------------------------------------------------------------

    private function parseBody(): array
    {
        $raw = file_get_contents('php://input');
        return json_decode($raw ?: '{}', true) ?? [];
    }

    private function validateTaskData(array $data): array
    {
        $errors = [];

        if (empty($data['title']) || strlen(trim($data['title'])) < 3) {
            $errors['title'] = 'Título deve ter pelo menos 3 caracteres.';
        }

        if (strlen(trim($data['title'] ?? '')) > 200) {
            $errors['title'] = 'Título deve ter no máximo 200 caracteres.';
        }

        if (
            isset($data['status']) &&
            !in_array($data['status'], Task::STATUSES, true)
        ) {
            $errors['status'] = 'Status inválido. Use: pending, in_progress ou done.';
        }

        if (
            isset($data['priority']) &&
            !in_array($data['priority'], Task::PRIORITIES, true)
        ) {
            $errors['priority'] = 'Prioridade inválida. Use: low, medium ou high.';
        }

        return $errors;
    }
}
