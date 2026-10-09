<?php

declare(strict_types=1);

namespace App\Utils;

/**
 * Helper para enviar respostas HTTP em JSON de forma padronizada.
 */
class Response
{
    /**
     * Envia uma resposta de sucesso.
     *
     * @param mixed $data
     */
    public static function success(mixed $data = null, string $message = 'OK', int $statusCode = 200): void
    {
        self::send([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $statusCode);
    }

    /**
     * Envia uma resposta de erro.
     */
    public static function error(string $message, int $statusCode = 400, mixed $errors = null): void
    {
        $body = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $body['errors'] = $errors;
        }

        self::send($body, $statusCode);
    }

    /**
     * Envia resposta 401 Unauthorized.
     */
    public static function unauthorized(string $message = 'Não autorizado'): void
    {
        self::error($message, 401);
    }

    /**
     * Envia resposta 404 Not Found.
     */
    public static function notFound(string $message = 'Recurso não encontrado'): void
    {
        self::error($message, 404);
    }

    /**
     * Envia resposta 422 Unprocessable Entity (validação).
     */
    public static function validationError(array $errors): void
    {
        self::error('Erro de validação', 422, $errors);
    }

    /**
     * Serializa e envia o corpo da resposta como JSON.
     */
    private static function send(array $body, int $statusCode): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');

        echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}
