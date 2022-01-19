<?php

spl_autoload_register(function($class){
    $namespace = 'Subtitles';
    $parts = explode("\\",$class);

    if(array_shift($parts)!== $namespace){
        return;
    }

    $path = __DIR__.DIRECTORY_SEPARATOR."src".DIRECTORY_SEPARATOR.implode(DIRECTORY_SEPARATOR,$parts).'.php';

    if(!file_exists($path)){
        throw new \Exception("$namespace class not found: $class");
    }

    require_once($path);

});
