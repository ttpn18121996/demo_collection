<?php

class Arr
{
    public static function get($target, $key = null, $default = null)
    {
        if (is_null($key)) {
            return $target;
        }

        $key = is_string($key) ? explode('.', $key) : $key;

        while (! is_null($segment = array_shift($key))) {
            if ($segment === '*') {
                if (! is_array($target)) {
                    return is_callable($target) ? $target() : $target;
                }

                $result = [];

                foreach ($target as $item) {
                    $result[] = Arr::get($item, $key);
                }

                return in_array('*', $key) ? Arr::collapse($result) : $result;
            }

            if (is_array($target) && isset($target[$segment])) {
                $target = $target[$segment];
            } elseif (is_object($target) && isset($target->{$segment})) {
                $target = $target->{$segment};
            } else {
                return is_callable($default) ? $default() : $default;
            }
        }

        return $target;
    }
}

class View
{
    private string $layout = '';
    private array $sections = [];

    public function xmlParser(SimpleXMLElement $xml, array $collection = []): array
    {
        $nodes = $xml->children();
        $attributes = $xml->attributes();

        if (0 !== count($attributes)) {
            foreach ($attributes as $attrName => $attrValue) {
                $collection['@attributes'][$attrName] = strval($attrValue);
            }
        }

        if (0 === $nodes->count()) {
            $collection['@value'] = strval($xml);
            return $collection;
        }

        foreach ($nodes as $nodeName => $nodeValue) {
            if (count($nodeValue->xpath('../' . $nodeName)) < 2) {
                $collection[$nodeName] = $this->xmlParser($nodeValue);
                continue;
            }

            $collection[$nodeName][] = $this->xmlParser($nodeValue);
        }

        return $collection;
    }

    public function xmlToArray(SimpleXMLElement $xml): array
    {
        return [
            $xml->getName() => $this->xmlParser($xml),
        ];
    }

    public function arrayToXml(array $arr, string $parentTag = '')
    {
        $result = '';

        if (($text = Arr::get($arr, '@value'))) {
            $tagName = Arr::get($arr, '@attributes.name');

            return is_null($tagName) ? $text : "<{$tagName}>{$text}</{$tagName}>";
        }

        foreach ($arr as $tagName => $content) {
            $attributes = Arr::get($content, '@attributes', []);
            $value = Arr::get($content, '@value');
            unset($content['@value'], $content['@attributes']);
            $result .= is_numeric($tagName) ? '': '<'.$tagName;
            if (count($attributes)) {
                $result .= ' '.implode(' ', array_map(function ($value, $key) {
                    return $key.'="'.$value.'"';
                }, $attributes, array_keys($attributes)));
            }
            $result .= is_numeric($tagName) ? '': '>';
            if ($value) {
                $result .= $value;
            } else {
                $result .= $this->arrayToXml($content, $tagName);
            }
            if (is_numeric($tagName)) {
                $result .= '</'.$parentTag.'>';
                if ($tagName < count($arr) - 1) {
                    $result .= '<'.$parentTag.'>';
                }
            } else {
                $result .= '</'.$tagName.'>';
            }
        }

        return $result;
    }

    public function make($view, $data = [])
    {
        extract($data, EXTR_OVERWRITE);
        ob_start();
        require __DIR__.'/'.$view.'.view.php';

        $viewContent = ob_get_clean();
        $xml = @simplexml_load_string($viewContent);

        if (!$xml) {
            return $viewContent;
        }

        $viewStruct = $this->xmlToArray($xml);

        if (($layoutName = Arr::get($viewStruct, 'layout.@attributes.name'))) {
            $this->layout = $layoutName;

            if ($children = Arr::get($viewStruct, 'layout.section')) {
                foreach ($children as $key => $section) {
                    if (is_numeric($key)) {
                        if ($sectionName = Arr::get($section, '@attributes.name')) {
                            unset($section['@attributes']);
                            $this->sections[$sectionName] = $this->arrayToXml($section);
                        } else {
                            $this->sections[] = $section;
                        }
                    } else {
                        if ($key == '@attributes') {
                            $sectionName = Arr::get($section, 'name');
                            unset($children['@attributes']);
                            $this->sections[$sectionName] = $this->arrayToXml($children);
                            break;
                        }
                    }
                }
            }
        } else {
            return $viewContent;
        }

        include __DIR__.'/'.str_replace('.', DIRECTORY_SEPARATOR, $this->layout).'.view.php';
    }

    public function render($key, $data = [])
    {
        extract($data, EXTR_OVERWRITE);

        return Arr::get($this->sections, $key, '');
    }

    public function include($view, $data = [])
    {
        extract($data, EXTR_OVERWRITE);
        include __DIR__.'/'.str_replace('.', DIRECTORY_SEPARATOR, $view).'.view.php';
    }
}

class HomeController
{
    public function index()
    {
        $view = new View();

        return $view->make('home', ['message' => 'This is message']);
    }
}

$homeController = new HomeController();
echo $homeController->index();
