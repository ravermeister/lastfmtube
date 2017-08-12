<?php
require_once dirname(__FILE__).'/../includes/bootstrap.php';

$action=$_GET['action'];
if(!isset($_GET['key'])) return;
$key=html_entity_decode($_GET['key']);

if(isset($_GET['value'])) $value=html_entity_decode($_GET['value']);

if($action=='del') {
    $deleted='0';
    $deleted = DB::getInstance()->delEnvVar($key);
    die($deleted.'');
} else if($action=='add') {
    DB::getInstance()->setEnvVar($key,$value);
    $value = DB::getInstance()->getEnvVar($key);
    die($value);
} else if($action=='get') {
    $value='undefined';
    $value=DB::getInstance()->getEnvVar($key);
    die($value);
}
    
?>
