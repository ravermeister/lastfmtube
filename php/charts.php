<?php
require_once dirname(__FILE__).'/../includes/bootstrap.php';

switch($_POST['action'])
{
    case 'add' :
        $track = $_POST['track'];
	DB::getInstance()->updateCharts($track);
    break;

    case 'show' :
	$data = DB::getInstance()->query('SELECT_CHARTS');            
        echo json_encode($data); 
    break;
}
?>
