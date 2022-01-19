<?php

namespace Subtitles;

class Utils
{
    static function toJson(array $data){
        return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    static function jsonResponse(array $data)
    {
        header("Content-Type:application/json");
        echo self::toJson($data);
    }

    static function getPost()
    {
        $json = file_get_contents('php://input');
        $data = json_decode($json,true);
        return $data;
    }
}