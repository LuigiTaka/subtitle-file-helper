<?php

namespace Subtitles;

use DateTime;
use Exception;

class SrtSubtitle{

    const SRT_TIMESTAMP_FORMAT = 'H:i:s,u';
    const WATER_MARK = "\u{200E}";
    const TIMESTAMP_DELIMITER = '-->';

    protected int $order;
    /**
     * @var DateTime[]
     */
    protected array $timestamp = [ ];
    public string $text = '';

    function __construct()
    {
        
    }

    public function getOrder($watermark = false)
    {
        return $this->order;
    }

    public function setOrder(int $order)
    {
        if($order < 1){ 
            throw new Exception("Ordem menor que um.");
        }

        $this->order = $order;
    }

    public function setLegendStartTime(\DateTime $date)
    {
        $this->timestamp[0] = $date;
    }

    public function setLegendEndTime(\DateTime $date)
    {
        $this->timestamp[1] = $date;
    }

    public function getInterval(){ 
        return $this->timestamp; 
    }

    public function getIntervalDuration()
    {
        $d1 = $this->timestamp[1];
        $d2 = $this->timestamp[0];
        return ;
    }

    protected function formatSubtitleInterval()
    {
        return array_map(function($d){
            $formated = $d->format(self::SRT_TIMESTAMP_FORMAT);
            $len = strlen($formated);
            if( $len > 12 ){ 
                $formated = substr($formated,0,12 );
            }
            return $formated;
        },$this->timestamp);
    }

    public function __toString(){ 
        $dates = $this->formatSubtitleInterval();
        $timer = implode(' '.self::TIMESTAMP_DELIMITER.' ',$dates);
        $lines = [ 
            self::WATER_MARK.$this->order,
            $timer,
            $this->text
        ];
        return implode(PHP_EOL,$lines).PHP_EOL;
    }

    
    public function toArray()
    {
        $timestamp = array_combine(['start','end'],$this->formatSubtitleInterval());
        return [
            'order'=>$this->getOrder(),
            'timestamp' => $timestamp,
            'text' => $this->text,   
        ];
    }
}