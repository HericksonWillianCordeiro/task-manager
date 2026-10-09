<?php

declare(strict_types=1);

return [
    'driver'   => $_ENV['DB_DRIVER']   ?? 'pgsql',
    'host'     => $_ENV['DB_HOST']     ?? 'localhost',
    'port'     => (int) ($_ENV['DB_PORT'] ?? 5432),
    'dbname'   => $_ENV['DB_NAME']     ?? 'taskmanager',
    'username' => $_ENV['DB_USER']     ?? 'postgres',
    'password' => $_ENV['DB_PASS']     ?? '',
    'charset'  => 'utf8',
];
