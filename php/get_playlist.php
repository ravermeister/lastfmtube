<?php
# encoding: UTF-8
require_once dirname(__FILE__).'/../includes/bootstrap.php';

$page = 1;
$pagecnt=25;
if(isset($_GET['page'])) $page = $_GET['page'];

$playlist       = $lastfm->getRecentlyPlayed($page,$pagecnt);
$tracklist      = $playlist->getTracks(); 


$trackno = (($page-1)*$pagecnt)+1;

for($i=0;$i<sizeof($tracklist);$i++)
{
    	$track 		= $tracklist[$i];	
	$track->title 	= Functions::getInstance()->prepareNeedle($track->title);
	$track->artist	= Functions::getInstance()->prepareNeedle($track->artist);
	$track->album	= Functions::getInstance()->prepareNeedle($track->album);	
	$video_id=DB::getInstance()->getEnvVar(Functions::getInstance()->prepareNeedle($track->artist.' '.$track->title));    
    
    if($video_id!=''&&$video_id!='undefined') {
        if(!isset($startvideo)) {
            $startvideo['videoId']      = $video_id;
            $startvideo['videoIndex']   = $i; 
            $startvideo['artist']       = addslashes(html_entity_decode($track->artist));
            $startvideo['title']        = addslashes(html_entity_decode($track->title));
        }            
        $final_tracklist[] = array('artist'=>$track->artist,'title'=>$track->title,'dateofplay'=>$track->dateofplay,'isplaying'=>(($track->isPlaying())?true:false),'video_id'=>$video_id);
    } else if(!isset($startvideo)) {
        
        $searcher->setNeedle($needle);
        $searcher->search();
        $search_result = $searcher->getVideoList();
        
        if(sizeof($search_result)>0) {
            $video                      = $search_result[0];               
            $startvideo['videoId']      = $video->getVideoID();
            $startvideo['videoIndex']   = $i; 
            $startvideo['artist']       = addslashes(html_entity_decode($track->artist));
            $startvideo['title']        = addslashes(html_entity_decode($track->title));                        
        }
        
        $final_tracklist[] = array('artist'=>$track->artist,'title'=>$track->title,'dateofplay'=>$track->dateofplay,'isplaying'=>(($track->isPlaying())?true:false),'video_id'=>'-1');
    } else
        $final_tracklist[] = array('artist'=>$track->artist,'title'=>$track->title,'dateofplay'=>$track->dateofplay,'isplaying'=>(($track->isPlaying())?true:false),'video_id'=>'-1');            
}


$trackno = (($page-1)*$pagecnt)+1;


$smarty->assign('current_page',$page);
$smarty->assign('total_pages',$playlist->totalpages);
$smarty->assign('track_no',$trackno);
$smarty->assign('startvideo',$startvideo);
$smarty->assign('autostart',false);
$smarty->assign('tracklist',$final_tracklist);

$content = $smarty->fetch('playlist.tpl');
die($content);

?>
