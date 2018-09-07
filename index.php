<?php
# encoding: UTF-8
require_once 'vendor/autoload.php';
use LastFmTube\Util\Db;
use LastFmTube\Util\Functions;

$control        = Functions::getInstance();
$control->startSession();

$lastvisit      = Db::getInstance()->updateLastFMUserVisit($_SESSION['music']['lastfm_user']);

$lastfm         = $control->getLfmApi();
$searcher       = $control->getYtApi();
$smarty         = $control->getSmarty();

$page=1;
$pagecnt=25;



$playlist       = $lastfm->getRecentlyPlayed($page,$pagecnt);
$tracklist      = $playlist->getTracks();

$final_tracklist = array();
$startvideo = array();

for($i=0;$i<sizeof($tracklist);$i++) {
    /**
     * @var \lfmtube\util\lfmapi\Track $track
     */
	$track 		= $tracklist[$i];	
	$track->title 	= $control->prepareNeedle($track->title);
	$track->artist	= $control->prepareNeedle($track->artist);
	$track->album	= $control->prepareNeedle($track->album);
	$needle         = $control->prepareNeedle($track->artist.' '.$track->title);
	$video_id=Db::getInstance()->getEnvVar($needle);

    if($video_id!=''&&$video_id!='undefined') {    
        if(sizeof($startvideo)==0) {
            $startvideo['videoId']      = $video_id;
            $startvideo['videoIndex']   = $i;
            $startvideo['artist']       = $track->artist;
            $startvideo['title']        = $track->title;
        }
        $final_tracklist[] = array('artist'=>$track->artist,'title'=>$track->title,'dateofplay'=>$track->dateofplay,'isplaying'=>(($track->isPlaying())?true:false),'video_id'=>$video_id);
    } else if(sizeof($startvideo)==0)  {
        $searcher->setNeedle($needle);
        $searcher->search();
        $search_result = $searcher->getVideoList();

        if(sizeof($search_result)>0) {
            /**
             * @var YoutubeVideo $video
             */
            $video                          = $search_result[0];
            $startvideo['videoId']          = $video->getVideoID();
            $startvideo['videoIndex']       = $i;
            $startvideo['artist']          = $track->artist;
            $startvideo['title']        = $track->title;
        }

        $final_tracklist[] = array('artist'=>$track->artist,'title'=>$track->title,'dateofplay'=>$track->dateofplay,'isplaying'=>(($track->isPlaying())?true:false),'video_id'=>'-1');
    } else
        $final_tracklist[] = array('artist'=>$track->artist,'title'=>$track->title,'dateofplay'=>$track->dateofplay,'isplaying'=>(($track->isPlaying())?true:false),'video_id'=>'-1');
}

$trackno = (($page-1)*$pagecnt)+1;

if(isset($_GET['disable_charts']))
    $smarty->assign('charts_counter',false);
else
    $smarty->assign('charts_counter',true);

$smarty->assign('music',1);
$smarty->assign('lastfm_user',$_SESSION['music']['lastfm_user']);
$smarty->assign('lastfm_user_visit', $lastvisit);
$smarty->assign('current_page',$page);
$smarty->assign('total_pages',$playlist->totalpages);
$smarty->assign('track_no',$trackno);
$smarty->assign('startvideo',$startvideo);
$smarty->assign('autostart',true);
$smarty->assign('tracklist',$final_tracklist);
$smarty->display('index.tpl');
