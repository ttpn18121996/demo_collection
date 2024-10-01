<?php

class Route
{
    public function __construct(
        public string $method,
        public string $uri,
        public array $action,
    ) {}

    public function execute()
    {
        if (count($this->action) == 0) {
            throw new Exception('Action invalid');
        }

        echo 'Controller: '.$this->action[0]."\n";
        echo 'Method: '.($this->action[1] ?? 'index')."\n";
    }
}

class Router
{
    protected array $routes = [];

    public function addRoute(Route $route)
    {
        $this->routes[] = $route;

        return $this;
    }

    public function dispatch($method, $uri)
    {
        foreach ($this->routes as $route) {
            if ($route->method == $method && $route->uri == $uri) {
                $route->execute();
                break;
            }
        }
    }
}

// without facade
$router = new Router();
$route = new Route('get', '/without-facade', ['WithoutFacadeController', 'index']);
$router->addRoute($route);
$router->dispatch('get', '/without-facade');

class RouteFacade
{
    private static $instance;
    public $router;

    private function __construct()
    {
        $this->router = new Router();
    }

    public static function getInstance()
    {
        return static::$instance ?? (static::$instance = new static());
    }

    public static function addRoute($method, $uri, $action)
    {
        static::getInstance()->router->addRoute(new Route($method, $uri, $action));
    }

    public static function dispatch($method, $uri)
    {
        static::getInstance()->router->dispatch($method, $uri);
    }
}

// with facade
RouteFacade::addRoute('get', '/with-facade', ['WithFacadeController', 'index']);
RouteFacade::dispatch('get', '/with-facade');
