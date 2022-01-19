<?php
namespace Subtitles;

use Subtitles\SrtSubtitle;

class SrtFileBuilder
{

    protected $queue;

    function __construct()
    {
        
    }

    public function add(SrtSubtitle $subtitle) : SrtFileBuilder
    {
        $this->queue[] = $subtitle;
        return $this;
    }

    public function getQueue()
    {
        return $this->queue;
    }

    public function getFile()
    {
        $lines = $this->queue;
        
        usort($lines,function($a,$b){
            return $a->getOrder() > $b->getOrder();
        });
        $lines = array_map(function ($a){
            return (String)$a;
        },$lines);

        return implode(PHP_EOL,$lines);
    }
}