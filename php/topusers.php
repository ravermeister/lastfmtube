<?php
require_once dirname(__FILE__).'/../includes/bootstrap.php';

switch($_POST['action']){
    case 'show' :
    case 'list' :
    $prefix = $settings['database']['table_prefix'];
    //top sql
    $select_sql = 
    '
        SELECT * 
        FROM "'.$prefix.'charts_lastfm_user"
        ORDER BY 
		playcount DESC,
		last_played DESC        
    ';
    //add limit to sql to limit the result for the top xx users
    //LIMIT 0,5;
    
    $data = DB::getInstance()->query($select_sql);            
    echo json_encode($data);     
    break;
}
?>
