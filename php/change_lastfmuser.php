<?php
# encoding: UTF-8
require_once dirname(__FILE__).'/../includes/bootstrap.php';
$page=1;
$pagecnt=25;

function jsonExit($data) {
	die(json_encode($data));
}

if(isset($_POST['lastfm_user'])) {

	/*lastfm user is not case sensitive*/
	if(strcasecmp($_POST['lastfm_user'], $_SESSION['music']['lastfm_user']) == 0) jsonExit(array('response_code' => 'same_playlist'));
	//if(strcmp($_POST['lastfm_user'], $_SESSION['music']['lastfm_user']) == 0) jsonExit(array('response_code' => 'same_playlist'));
	else $_SESSION['music']['lastfm_user'] = $_POST['lastfm_user'];
}

$lastfm->setUser($_SESSION['music']['lastfm_user']);
$playlist       = $lastfm->getRecentlyPlayed($page,$pagecnt);
$tracklist      = $playlist->getTracks(); 
$trackcnt 	= sizeof($tracklist);
if($trackcnt<=0) {
	jsonExit(array('response_code' => 'no_data'));
}

$trackno = (($page-1)*$pagecnt)+1;

for($i=0;$i<$trackcnt;$i++) {
    $track = $tracklist[$i];
    $needle = $track->artist.' '.$track->title;    
    $needle = addslashes(html_entity_decode($needle));
    $video_id=DB::getInstance()->getEnvVar($needle);
    
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
        
        if(sizeof($search_result)>0)
        {
            $video              	    = $search_result[0];
            $startvideo['videoId']          = $video->getVideoID();
            $startvideo['videoIndex']       = $i;
            $startvideo['artist']           = addslashes(html_entity_decode($track->artist));
            $startvideo['title']            = addslashes(html_entity_decode($track->title));                
        }
        
        $final_tracklist[] = array('artist'=>$track->artist,'title'=>$track->title,'dateofplay'=>$track->dateofplay,'isplaying'=>(($track->isPlaying())?true:false),'video_id'=>'-1');
    } else
        $final_tracklist[] = array('artist'=>$track->artist,'title'=>$track->title,'dateofplay'=>$track->dateofplay,'isplaying'=>(($track->isPlaying())?true:false),'video_id'=>'-1');            
}

DB::getInstance()->updateLastFMUserVisit($_SESSION['music']['lastfm_user']);

$trackno = (($page-1)*$pagecnt)+1;

if(isset($_GET['disable_charts']))
    $smarty->assign('chartcounter',false);
else
    $smarty->assign('chartcounter',true);


$smarty->assign('BASE_PATH',$settings['general']['baseurl']);
$smarty->assign('music',1);
$smarty->assign('lastfm_user',$_SESSION['music']['lastfm_user']);
$smarty->assign('current_page',$page);
$smarty->assign('total_pages',$playlist->totalpages);
$smarty->assign('track_no',$trackno);
$smarty->assign('startvideo',$startvideo);
$smarty->assign('autostart',false);
$smarty->assign('tracklist',$final_tracklist);
//$smarty->display('index.tpl');

$return_data['response_code']       = 'ok';
$return_data['current_page']        = $page;
$return_data['total_pages']         = $playlist->totalpages;
$return_data['track_no']            = $trackno;
$return_data['startvideo']          = $startvideo;
$return_data['playlist']            = $smarty->fetch(dirname(__FILE__).'/../themes/'.$settings['general']['theme'].'/playlist.tpl');

jsonExit($return_data);
?>
