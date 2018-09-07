<?php

require_once dirname(__FILE__) . '/../vendor/autoload.php';
use LastFmTube\Util\Db;
use LastFmTube\Util\Functions;

$action = $_GET ['action'];
if (! isset ( $_GET ['key'] ))
    return;
$key = Functions::getInstance ()->prepareNeedle ( $_GET ['key'] );

if (isset ( $_GET ['value'] ))
    $value = html_entity_decode ( $_GET ['value'] );

if ($action == 'del') {
    $deleted = '0';
    $deleted = Db::getInstance ()->delEnvVar ( $key );
    die ( $deleted . '' );
} else if ($action == 'add') {
    Db::getInstance ()->setEnvVar ( $key, $value );
    $value = Db::getInstance ()->getEnvVar ( $key );
    die ( $value );
} else if ($action == 'get') {
    $value = 'undefined';
    $value = Db::getInstance ()->getEnvVar ( $key );
    die ( $value );
}
