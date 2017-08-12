<?php
require_once dirname(__FILE__).'/../includes/bootstrap.php';

switch($_POST['action'])
{
    case 'add' :
        $track = $_POST['track'];
	DB::getInstance()->updateCharts($track);
    break;
    
    case 'show' :
        /*
         // TOP 100 
         $select_sql =
         '
            SELECT *  
            FROM  `site_music_charts`  
            ORDER BY  `playcount` DESC, `lastplay_time` DESC;  
            LIMIT 0,100;
         ';
         
         */
         // All Tracks playcount > 1
         /*
             SELECT * 
             FROM `site_music_charts` 
             WHERE 
             	(`playcount` > 1) OR 
                (
                    `playcount`=1 AND 
                    `lastplay_time` IN (
                        SELECT MAX(`lastplay_time`) 
                        FROM `site_music_charts` 
                        WHERE `playcount`=1
                    )
    			)
             ORDER BY `playcount` DESC, `lastplay_time` DESC;
         */         
	$prefix = $settings['database']['table_prefix'];
	$select_sql = '
		SELECT * FROM "'.$prefix.'charts" 
		WHERE ("playcount" > 1) OR (
                    "playcount" = 1 AND 
                    "lastplay_time" IN (
                        SELECT MAX("lastplay_time") 
                        FROM "'.$prefix.'charts"
                        WHERE "playcount"=1
                    )
    			)
             ORDER BY `playcount` DESC, `lastplay_time` DESC;
	 ';
         $data = DB::getInstance()->query($select_sql);            
        echo json_encode($data); 
    break;
}
?>
