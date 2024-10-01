<?php

interface Connectable
{
    public function connect();
}

class MysqlConnection implements Connectable
{
    public function connect()
    {
        echo "Connect to Mysql\n";
    }
}

class SqliteConnection implements Connectable
{
    public function connect()
    {
        echo "Connect to Sqlite\n";
    }
}

class PostgresConnection implements Connectable
{
    public function connect()
    {
        echo "Connect to Postgres\n";
    }
}

class ConnectionFactory
{
    public function getConnection($connection): ?Connectable
    {
        switch ($connection) {
            case 'mysql':
                return new MysqlConnection();
            case 'sqlite':
                return new SqliteConnection();
            case 'pgsql':
            case 'postgres':
                return new PostgresConnection();
            default:
                return null;
        }
    }
}

$connection = new ConnectionFactory();
$connection->getConnection('mysql')?->connect();
$connection->getConnection('postgres')?->connect();
$connection->getConnection('sqlite')?->connect();
$connection->getConnection('sqlserver')?->connect();
