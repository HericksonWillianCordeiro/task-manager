<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Middleware\AuthMiddleware;
use App\Models\User;
use App\Utils\Response;

/**
 * Controlador de autenticação — registro e login de usuários.
 */
class AuthController
{
    private User           $userModel;
    private AuthMiddleware $auth;

    public function __construct()
    {
        $this->userModel = new User();
        $this->auth      = new AuthMiddleware();
    }

    /**
     * POST /api/auth/register
     * Body: { name, email, password }
     */
    public function register(): void
    {
        $body = $this->parseBody();

        $errors = $this->validateRegister($body);
        if (!empty($errors)) {
            Response::validationError($errors);
        }

        try {
            $userId = $this->userModel->create(
                trim($body['name']),
                strtolower(trim($body['email'])),
                $body['password']
            );

            $user  = $this->userModel->findById($userId);
            $token = $this->auth->generateToken($userId, $user['name'], $user['email']);

            Response::success(
                ['token' => $token, 'user' => $this->sanitizeUser($user)],
                'Cadastro realizado com sucesso.',
                201
            );
        } catch (\RuntimeException $e) {
            Response::error($e->getMessage(), 409);
        }
    }

    /**
     * POST /api/auth/login
     * Body: { email, password }
     */
    public function login(): void
    {
        $body = $this->parseBody();

        $errors = $this->validateLogin($body);
        if (!empty($errors)) {
            Response::validationError($errors);
        }

        $user = $this->userModel->findByEmail(strtolower(trim($body['email'])));

        if ($user === null || !$this->userModel->verifyPassword($body['password'], $user['password'])) {
            Response::error('E-mail ou senha incorretos.', 401);
        }

        $token = $this->auth->generateToken(
            (int) $user['id'],
            $user['name'],
            $user['email']
        );

        Response::success(
            ['token' => $token, 'user' => $this->sanitizeUser($user)],
            'Login realizado com sucesso.'
        );
    }

    // -------------------------------------------------------------------------
    // Helpers privados
    // -------------------------------------------------------------------------

    private function parseBody(): array
    {
        $raw = file_get_contents('php://input');
        return json_decode($raw ?: '{}', true) ?? [];
    }

    private function validateRegister(array $data): array
    {
        $errors = [];

        if (empty($data['name']) || strlen(trim($data['name'])) < 2) {
            $errors['name'] = 'Nome deve ter pelo menos 2 caracteres.';
        }

        if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'E-mail inválido.';
        }

        if (empty($data['password']) || strlen($data['password']) < 6) {
            $errors['password'] = 'Senha deve ter pelo menos 6 caracteres.';
        }

        return $errors;
    }

    private function validateLogin(array $data): array
    {
        $errors = [];

        if (empty($data['email'])) {
            $errors['email'] = 'E-mail é obrigatório.';
        }

        if (empty($data['password'])) {
            $errors['password'] = 'Senha é obrigatória.';
        }

        return $errors;
    }

    private function sanitizeUser(array $user): array
    {
        unset($user['password']);
        return $user;
    }
}
