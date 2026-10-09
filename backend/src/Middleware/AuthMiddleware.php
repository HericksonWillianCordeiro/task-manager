<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Utils\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;

/**
 * Middleware de autenticação JWT.
 *
 * Extrai e valida o token Bearer do header Authorization.
 * Retorna o payload decodificado ou aborta com 401.
 */
class AuthMiddleware
{
    private string $secret;

    public function __construct()
    {
        $this->secret = $_ENV['JWT_SECRET'] ?? 'change_this_secret_in_production';
    }

    /**
     * Valida o token JWT e retorna o payload.
     *
     * @return object Payload decodificado
     */
    public function handle(): object
    {
        $token = $this->extractToken();

        if ($token === null) {
            Response::unauthorized('Token de autenticação não fornecido.');
        }

        try {
            $payload = JWT::decode($token, new Key($this->secret, 'HS256'));
            return $payload;
        } catch (ExpiredException) {
            Response::unauthorized('Token expirado. Faça login novamente.');
        } catch (SignatureInvalidException) {
            Response::unauthorized('Token inválido.');
        } catch (\Exception) {
            Response::unauthorized('Falha na autenticação.');
        }
    }

    /**
     * Gera um novo token JWT para o usuário.
     */
    public function generateToken(int $userId, string $name, string $email): string
    {
        $payload = [
            'iss'   => 'task-manager-api',
            'iat'   => time(),
            'exp'   => time() + (60 * 60 * 24), // 24 horas
            'sub'   => $userId,
            'name'  => $name,
            'email' => $email,
        ];

        return JWT::encode($payload, $this->secret, 'HS256');
    }

    /**
     * Extrai o token do header Authorization: Bearer <token>
     */
    private function extractToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION']
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
            ?? '';

        if (preg_match('/^Bearer\s+(.+)$/i', $header, $matches)) {
            return $matches[1];
        }

        return null;
    }
}
