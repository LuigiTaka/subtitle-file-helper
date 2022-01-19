<?php
require_once(__DIR__."/../autoload.php");

use Subtitles\{SrtFileBuilder, Utils,SrtParser};  

$srtFilepath = __DIR__.DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."data".DIRECTORY_SEPARATOR."temp_srt".DIRECTORY_SEPARATOR;

if(!is_dir($srtFilepath)){
    mkdir($srtFilepath);
}
$_POST['id'] = $_POST['id'] === 'null'?null:$_POST['id'];
if(isset($_POST['id']) && !empty($_POST['id'])){
    $id = trim($_POST['id']);
    $filename = $srtFilepath.DIRECTORY_SEPARATOR.$id.'.srt';
}else{
    $file = $_FILES['file']??null;
    $id = uniqid('srt-');
    $filename = $srtFilepath.DIRECTORY_SEPARATOR.$id.'.srt';
    $hasUploaded = move_uploaded_file($file['tmp_name'],$filename);
}

$parser = new SrtParser;
$builder = $parser->parse($filename);
$queue = $builder->getQueue();
$lines = [];
foreach($queue as $index => $subtitle){
    $data = $subtitle->toArray();
    $lines[] = $data;
}

Utils::jsonResponse([
    'lines' => $lines,
    'id' => $id,
]);