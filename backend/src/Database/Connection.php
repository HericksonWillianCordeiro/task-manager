<?php

declare(strict_types=1);

namespace App\Database;

use PDO;
use PDOException;

/**
 * Gerencia a conexão PDO com o banco de dados (Singleton).
 */
class Connection
{
    private static ?PDO $instance = null;

    private function __construct() {}
    private function __clone() {}

    /**
     * Retorna a instância única da conexão PDO.
     *
     * @throws \RuntimeException se a conexão falhar
     */
    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            self::$instance = self::createConnection();
        }

        return self::$instance;
    }

    private static function createConnection(): PDO
    {
        $config = require __DIR__ . '/../../config/database.php';

        $driver  = $config['driver'];
        $host    = $config['host'];
        $port    = $config['port'];
        $dbname  = $config['dbname'];
        $charset = $config['charset'];

        $dsn = match ($driver) {
            'pgsql'  => "pgsql:host={$host};port={$port};dbname={$dbname}",
            'mysql'  => "mysql:host={$host};port={$port};dbname={$dbname};charset={$charset}",
            default  => throw new \InvalidArgumentException("Driver '{$driver}' não suportado."),
        };

        try {
            $pdo = new PDO(
                $dsn,
                $config['username'],
                $config['password'],
                [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]
            );

            return $pdo;
        } catch (PDOException $e) {
            throw new \RuntimeException(
                'Falha ao conectar ao banco de dados: ' . $e->getMessage(),
                (int) $e->getCode()
            );
        }
    }
}
