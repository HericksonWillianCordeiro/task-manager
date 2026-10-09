<?php

declare(strict_types=1);

// -----------------------------------------------------------------------
// Carrega variáveis de ambiente do arquivo .env (se existir)
// -----------------------------------------------------------------------
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        [$key, $value] = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
}

// -----------------------------------------------------------------------
// Autoloader (Composer)
// -----------------------------------------------------------------------
require_once __DIR__ . '/vendor/autoload.php';

// -----------------------------------------------------------------------
// Headers globais — CORS e Content-Type
// -----------------------------------------------------------------------
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Pre-flight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// -----------------------------------------------------------------------
// Roteamento simples
// -----------------------------------------------------------------------
$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove prefixo /api e barra final
$uri = preg_replace('#^/api#', '', $uri);
$uri = rtrim($uri, '/');

use App\Controllers\AuthController;
use App\Controllers\TaskController;
use App\Utils\Response;

try {
    // -----------------------------------------------
    // Auth routes
    // -----------------------------------------------
    if ($uri === '/auth/register' && $method === 'POST') {
        (new AuthController())->register();
        exit;
    }

    if ($uri === '/auth/login' && $method === 'POST') {
        (new AuthController())->login();
        exit;
    }

    // -----------------------------------------------
    // Task routes
    // -----------------------------------------------
    if ($uri === '/tasks' && $method === 'GET') {
        (new TaskController())->index();
        exit;
    }

    if ($uri === '/tasks' && $method === 'POST') {
        (new TaskController())->store();
        exit;
    }

    // /tasks/{id}
    if (preg_match('#^/tasks/(\d+)$#', $uri, $m)) {
        $id = (int) $m[1];

        match ($method) {
            'GET'    => (new TaskController())->show($id),
            'PUT'    => (new TaskController())->update($id),
            'DELETE' => (new TaskController())->destroy($id),
            default  => Response::error('Método não permitido.', 405),
        };
        exit;
    }

    // /tasks/{id}/toggle
    if (preg_match('#^/tasks/(\d+)/toggle$#', $uri, $m) && $method === 'PATCH') {
        (new TaskController())->toggle((int) $m[1]);
        exit;
    }

    // -----------------------------------------------
    // 404 — rota não encontrada
    // -----------------------------------------------
    Response::notFound('Rota não encontrada.');

} catch (\Throwable $e) {
    // Erros inesperados — não expor detalhes em produção
    $debug   = ($_ENV['APP_ENV'] ?? 'production') === 'development';
    $message = $debug ? $e->getMessage() : 'Erro interno no servidor.';

    Response::error($message, 500);
}
