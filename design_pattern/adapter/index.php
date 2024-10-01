<?php

class PostgresConnection
{
    public function connectDatabase()
    {
        echo "Connect to Postgres\n";
    }
}

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

class PostgresConnectionAdapter implements Connectable
{
    public function __construct(
        protected PostgresConnection $postgres
    ) {}

    public function connect()
    {
        $this->postgres->connectDatabase();
    }
}

class Database
{
    public function __construct(
        protected Connectable $connection
    ) {}

    public function connect()
    {
        $this->connection->connect();
    }
}

$mysql = new MysqlConnection();
$db = new Database($mysql);
$db->connect();

$sqlite = new SqliteConnection();
$db = new Database($sqlite);
$db->connect();

$postgres = new PostgresConnectionAdapter(new PostgresConnection());
$db = new Database($postgres);
$db->connect();
