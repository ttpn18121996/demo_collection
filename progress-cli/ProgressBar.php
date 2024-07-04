<?php

class ProgressBar
{
    public float|int|null $current = 0;

    public ?int $startTime = null;

    public function __construct(
        private int $total = 0,
        private int $size = 30,
    ) {}

    public function setTotal(int $total): void
    {
        $this->total = $total;
    }
    
    public function getTotal(): int
    {
        return $this->total;
    }

    public function showProgress(float|int $current)
    {
        if ($this->total < $current) {
            return null;
        }

        if (is_null($this->startTime)) {
            $this->startTime = time();
        }
        
        $now = time();

        $perc = (float) ($current / $this->total);

        $bar = floor($perc * $this->size);

        $statusBar = "\r[";
        $statusBar .= str_repeat('=', $bar);

        if ($bar < $this->size) {
            $statusBar .= '>';
            $statusBar .= str_repeat('-', $this->size - $bar);
        } else {
            $statusBar .= '=';
        }

        $disp = number_format($perc * 100, 0);

        $statusBar .= "] {$disp}% {$current}/{$this->total}";

        $rate = ($now - $this->startTime) / $current;
        $left = $this->total - $current;
        $eta = round($rate * $left, 2);

        $elapsed = $now - $this->startTime;

        $statusBar .= ' remaining: '.number_format($eta).' sec. elapsed: '.number_format($elapsed).' sec.';

        echo $statusBar;

        flush();

        if ($current == $this->total) {
            echo PHP_EOL;
        }
    }
}
