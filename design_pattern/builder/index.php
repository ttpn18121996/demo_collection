<?php

class QueryBuilder
{
    protected string $table = '';
    protected array $columns = ['*'];
    protected array $conditions = [];

    public function select(array $columns)
    {
        $this->columns = $columns;

        return $this;
    }

    public function table(string $table)
    {
        $this->table = $table;

        return $this;
    }

    public function where($column, $operator, $value)
    {
        $this->conditions[] = [$column, $operator, $value];

        return $this;
    }

    public function get()
    {
        $select = implode(', ', $this->columns);
        $query = "SELECT {$select} FROM {$this->table}";

        if (! empty($this->conditions)) {
            $query .= ' WHERE ';
            foreach ($this->conditions as $condition) {
                $query .= "{$condition[0]} {$condition[1]} '{$condition[2]}'" . ' AND ';
            }

            $query = rtrim($query, ' AND');
        }

        echo $query."\n";
    }
}

$db = new QueryBuilder();
$db->table('users')
    ->where('email', 'like', '%gmail%')
    ->select(['id', 'name', 'email'])
    ->where('name', '=', 'nam')
    ->get();
