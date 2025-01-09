<?php

interface Observer {
    public function update(string $username, string $password);
}

abstract class Observable
{
    public function observe(Observer $observer)
    {
        $this->observers[] = $observer;

        return $this;
    }

    public function deObserve(Observer $observer)
    {
        $this->observers = array_filter($this->observers, function ($item) use ($observer) {;
            return $observer !== $item;
        });

        return $this;
    }
}

class LoginService extends Observable
{
    protected $observers = [];
    protected string $username;
    protected string $password;

    public function __invoke(string $username, string $password)
    {
        $this->username = $username;
        $this->password = $password;
        $this->notify();
    }

    public function notify()
    {
        foreach ($this->observers as $observer) {
            $observer->update($this->username, $this->password);
        }
    }
}



class LoginObserver implements Observer
{
    protected string $username;
    protected string $password;

    public function update(string $username, string $password)
    {
        $this->username = $username;
        $this->password = $password;
        $this->sendMessage();
    }

    protected function sendMessage()
    {
        echo "LoginObserver: {$this->username} logged in successfully" . PHP_EOL;
    }
}

class HistoryObserver implements Observer
{
    protected string $username;
    protected string $password;

    public function update(string $username, string $password)
    {
        $this->username = $username;
        $this->password = $password;
        $this->saveHistory();
    }

    protected function saveHistory()
    {
        echo "HistoryObserver: A user has logged in.\nUsername: {$this->username}\nPassword: {$this->password}" . PHP_EOL;
    }
}

$loginService = new LoginService();
$loginObserver = new LoginObserver();
$historyObserver = new HistoryObserver();
$loginService->observe($loginObserver)->observe($historyObserver);
$loginService("namttp", "hello123");
$loginService->deObserve($loginObserver);
$loginService("admin", "12345678");

