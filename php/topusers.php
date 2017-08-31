<?php
require_once dirname(__FILE__).'/../includes/bootstrap.php';

if(!isset($_POST['action'])) return;

switch($_POST['action']){
    case 'show' :
    case 'list' :        
	$data = DB::getInstance()->query('SELECT_ALL_LASTFM_USER');            
	echo json_encode($data);     
    break;
}
?>
