<?php

declare(strict_types=1);

namespace App\Models;

use App\Database\Connection;
use PDO;

/**
 * Model de Usuário — encapsula as operações de banco relacionadas a users.
 */
class User
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Connection::getInstance();
    }

    /**
     * Busca um usuário pelo e-mail.
     */
    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT id, name, email, password, created_at FROM users WHERE email = :email LIMIT 1'
        );
        $stmt->execute([':email' => $email]);

        $user = $stmt->fetch();
        return $user ?: null;
    }

    /**
     * Busca um usuário pelo ID.
     */
    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT id, name, email, created_at FROM users WHERE id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);

        $user = $stmt->fetch();
        return $user ?: null;
    }

    /**
     * Cria um novo usuário e retorna o ID gerado.
     *
     * @throws \RuntimeException se o e-mail já estiver em uso
     */
    public function create(string $name, string $email, string $password): int
    {
        if ($this->findByEmail($email) !== null) {
            throw new \RuntimeException('E-mail já cadastrado.');
        }

        $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

        $stmt = $this->db->prepare(
            'INSERT INTO users (name, email, password) VALUES (:name, :email, :password)'
        );
        $stmt->execute([
            ':name'     => $name,
            ':email'    => $email,
            ':password' => $hash,
        ]);

        return (int) $this->db->lastInsertId();
    }

    /**
     * Verifica se a senha fornecida é válida para o hash armazenado.
     */
    public function verifyPassword(string $plain, string $hash): bool
    {
        return password_verify($plain, $hash);
    }
}
