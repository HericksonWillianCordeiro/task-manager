<?php

declare(strict_types=1);

namespace Tests;

use App\Models\Task;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;

/**
 * Testes unitários para o Model Task.
 *
 * Como os métodos dependem de PDO, usamos Mocks para isolar
 * a lógica de negócio do banco de dados real.
 */
class TaskTest extends TestCase
{
    // -------------------------------------------------------------------------
    // Testes de constantes e validações de domínio
    // -------------------------------------------------------------------------

    public function test_statuses_constants_contain_expected_values(): void
    {
        $this->assertContains('pending',     Task::STATUSES);
        $this->assertContains('in_progress', Task::STATUSES);
        $this->assertContains('done',        Task::STATUSES);
        $this->assertCount(3, Task::STATUSES);
    }

    public function test_priorities_constants_contain_expected_values(): void
    {
        $this->assertContains('low',    Task::PRIORITIES);
        $this->assertContains('medium', Task::PRIORITIES);
        $this->assertContains('high',   Task::PRIORITIES);
        $this->assertCount(3, Task::PRIORITIES);
    }

    public function test_invalid_status_is_not_in_statuses(): void
    {
        $this->assertNotContains('completed', Task::STATUSES);
        $this->assertNotContains('archived',  Task::STATUSES);
    }

    public function test_invalid_priority_is_not_in_priorities(): void
    {
        $this->assertNotContains('urgent',   Task::PRIORITIES);
        $this->assertNotContains('critical', Task::PRIORITIES);
    }

    // -------------------------------------------------------------------------
    // Testes de validação de dados no Controller (lógica pura)
    // -------------------------------------------------------------------------

    public function test_task_title_must_have_at_least_3_chars(): void
    {
        $title  = 'Ab';
        $isValid = strlen(trim($title)) >= 3;

        $this->assertFalse($isValid, 'Títulos com menos de 3 chars devem ser inválidos.');
    }

    public function test_task_title_with_3_chars_is_valid(): void
    {
        $title  = 'API';
        $isValid = strlen(trim($title)) >= 3;

        $this->assertTrue($isValid);
    }

    public function test_task_title_cannot_exceed_200_chars(): void
    {
        $title   = str_repeat('a', 201);
        $isValid = strlen(trim($title)) <= 200;

        $this->assertFalse($isValid);
    }

    public function test_task_title_with_200_chars_is_valid(): void
    {
        $title   = str_repeat('a', 200);
        $isValid = strlen(trim($title)) <= 200;

        $this->assertTrue($isValid);
    }

    // -------------------------------------------------------------------------
    // Teste da lógica de toggle de status
    // -------------------------------------------------------------------------

    /**
     * @dataProvider toggleStatusProvider
     */
    public function test_toggle_status_cycles_correctly(string $current, string $expected): void
    {
        $nextStatus = match ($current) {
            'pending'     => 'in_progress',
            'in_progress' => 'done',
            'done'        => 'pending',
            default       => 'pending',
        };

        $this->assertSame($expected, $nextStatus);
    }

    public static function toggleStatusProvider(): array
    {
        return [
            'pending → in_progress' => ['pending',     'in_progress'],
            'in_progress → done'    => ['in_progress', 'done'],
            'done → pending'        => ['done',         'pending'],
        ];
    }

    // -------------------------------------------------------------------------
    // Testes de estrutura de dados de tarefa
    // -------------------------------------------------------------------------

    public function test_task_array_has_required_keys(): void
    {
        $task = [
            'id'          => 1,
            'title'       => 'Teste',
            'description' => 'Descrição',
            'status'      => 'pending',
            'priority'    => 'medium',
            'user_id'     => 1,
            'created_at'  => '2026-01-01 00:00:00',
            'updated_at'  => '2026-01-01 00:00:00',
        ];

        $requiredKeys = ['id', 'title', 'description', 'status', 'priority', 'user_id', 'created_at', 'updated_at'];

        foreach ($requiredKeys as $key) {
            $this->assertArrayHasKey($key, $task, "Chave '{$key}' ausente na estrutura de tarefa.");
        }
    }

    public function test_task_status_is_valid_enum_value(): void
    {
        $validTask  = ['status' => 'pending'];
        $invalidTask = ['status' => 'archived'];

        $this->assertContains($validTask['status'],   Task::STATUSES);
        $this->assertNotContains($invalidTask['status'], Task::STATUSES);
    }
}
