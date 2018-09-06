<?php

use LastFmTube\Util\Functions;

header ( 'Content-Type: text/plain; charset=utf-8' );
require_once dirname(__FILE__) . '/../util/bootstrap.php';

$needle = Functions::getInstance ()->prepareNeedle ( $_GET ['needle'] );
$searcher->setNeedle ( $needle );

if (isset ( $_GET ['listsize'] ))
    $size = $_GET ['listsize'];
else {
    $size = 1;
}

$searcher->search ( $size );
$videos = $searcher->getVideoList ();
die ( json_encode ( $videos ) );
