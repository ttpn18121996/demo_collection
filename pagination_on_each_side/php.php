<?php

class UrlWindow
{
    public function __construct(
        protected int $currentPage,
        protected int $totalPage,
        protected int $onEachSide = 3,
    ) {}

    public function get()
    {
        if ($this->totalPage <= 1) {
            return null;
        }

        if ($this->totalPage < $this->onEachSide * 2 + 8) {
            return $this->getSmallSlider();
        }

        return $this->getUrlSlider();
    }

    protected function getSmallSlider()
    {
        return [
            'first' => range(1, $this->totalPage),
            'silder' => [],
            'last' => [],
        ];
    }

    protected function getUrlSlider()
    {
        $window = $this->onEachSide + 4;
        $first = [1, 2];
        $slider = [];
        $last = [$this->totalPage - 1, $this->totalPage];

        if ($this->currentPage <= $window) {
            $first = range(1, $window + $this->onEachSide);
        } elseif ($this->currentPage >= $this->totalPage - $window) {
            $last = range($this->currentPage - $this->onEachSide, $this->totalPage);
        } else {
            $slider = range($this->currentPage - $this->onEachSide, $this->currentPage + $this->onEachSide);
        }

        return compact('first', 'slider', 'last');
    }
}

var_dump((new UrlWindow(10, 20, 3))->get());
