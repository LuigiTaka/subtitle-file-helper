<?php

namespace Subtitles;

use DateTime;
use Exception;

class SrtParser
{
    protected function createSrtInterval(string $date)
    {
        $date = trim($date);
        return DateTime::createFromFormat(SrtSubtitle::SRT_TIMESTAMP_FORMAT,$date);
    }

    protected function removeWatermark($string){
        $othermark = "\u{FEFF}";
        return preg_replace("/(".SrtSubtitle::WATER_MARK."|".$othermark.")/",'',$string);
    }

    function parse(string $filepath){
        if(!file_exists($filepath)){
            throw new Exception("Arquivo $filepath não encontrado.");
        }
        $file = file_get_contents($filepath);
        $lines = preg_split('#\n\s*\n#ui',$file);    

        $builder = new SrtFileBuilder;

        foreach($lines as $index => $data){

            if(empty($data)){
                continue;
            }

            $subtitle = new SrtSubtitle;
            $data = $this->removeWatermark($data);
            $rows = explode(PHP_EOL,$data);  
            if(count($rows) < 3){
                $rows = preg_split("/(\r\n|\n|\r)/",$data);
            }
    
            $firstOrder = array_shift($rows);
            $secondOorder = trim($firstOrder);

            $order = intval($secondOorder,10);
     
            $interval = array_shift($rows);
            $text = implode(PHP_EOL,$rows);
            
            $interval = explode(SrtSubtitle::TIMESTAMP_DELIMITER,$interval);
            try{
                $subtitle->setOrder($order);
                $subtitle->setLegendStartTime( $this->createSrtInterval( $interval[0] )  );
                $subtitle->setLegendEndTime( $this->createSrtInterval($interval[1])  );
                $subtitle->text = $text;
        
            }catch(\Throwable $e){
                throw $e;
                echo "Error: ".$e->getMessage().PHP_EOL;
                var_dump($rows);
                var_dump($firstOrder);
                var_dump($secondOorder);
                die;    
                continue;
            }
            $builder->add($subtitle);    
        }
        return $builder;
    }   
}