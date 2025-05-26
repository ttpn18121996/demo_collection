<?php

class Command
{
    private array $arguments = [];

    private array $options = [];

    private static array $shortKeys = [];

    public function __construct(array $argv, int $argc)
    {
        $this->setOptions($argv, $argc);
        $this->setArguments($argv, $argc);
    }

    public function setOptions(array $argv, int $argc)
    {
        $i = 0;
        while ($i < $argc) {
            if (str_starts_with($argv[$i], '--')) {
                $keyAndValue = explode('=', $argv[$i]);
                $optionKey = substr($keyAndValue[0], 2);
                $this->options[$optionKey] = count($keyAndValue) == 2 ? $keyAndValue[1] : $argv[++$i];
            } elseif (str_starts_with($argv[$i], '-')) {
                $optionKey = substr($argv[$i], 1);

                if (static::$shortKeys[$optionKey]) {
                    $optionKey = static::$shortKeys[$optionKey];
                }

                $this->options[$optionKey] = $argv[++$i];
            }
            $i++;
        }
    }

    public function getOptions(?string $key = null, $default = null)
    {
        if (is_null($key)) {
            return $this->options;
        }

        return $this->options[$key] ?? $default;
    }

    public function setArguments(array $argv, int $argc)
    {
        for ($i = 0; $i <$argc; $i++) {
            if (str_starts_with($argv[$i], '-')) {
                continue;
            }
            $this->arguments[] = $argv[$i];
        }
    }

    public function getArguments()
    {
        return $this->arguments;
    }

    public static function defineShortKey($option, $key)
    {
        static::$shortKeys[$key] = $option;
    }
}
