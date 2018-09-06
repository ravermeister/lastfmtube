<?php
// encoding: UTF-8

namespace LastFmTube\Util;

require_once dirname(__FILE__) . '/../util/bootstrap.php';

$page = 1;
$pagecnt = 25;
if (isset ( $_GET ['page'] ))
    $page = $_GET ['page'];

/**
 * @var  LastFm $lastfm
 */
$playlist = $lastfm->getRecentlyPlayed ( $page, $pagecnt );
$tracklist = $playlist->getTracks ();
$startvideo = array();
$final_tracklist = array();

for($i = 0; $i < sizeof ( $tracklist ); $i ++) {

    /**
     * @var lfmapi\Track $track
     */
    $track = $tracklist [$i];
    $track->title = Functions::getInstance ()->prepareNeedle ( $track->title );
    $track->artist = Functions::getInstance ()->prepareNeedle ( $track->artist );
    $track->album = Functions::getInstance ()->prepareNeedle ( $track->album );
    $needle = Functions::getInstance ()->prepareNeedle ( $track->artist . ' ' . $track->title );
    $video_id = DB::getInstance ()->getEnvVar ( $needle );

    if (strlen($video_id ) == 0 || strcmp($video_id, 'undefined') == 0) {

        if (sizeof($startvideo) == 0) {
            /**
             * @var \YoutubeSearch $searcher
             */
            $searcher->setNeedle ( $needle );
            $searcher->search ();
            $search_result = $searcher->getVideoList ();

            if (sizeof ( $search_result ) > 0) {
                /**
                 * @var \YoutubeVideo $video
                 */
                $video = $search_result [0];
                $video_id = $video->getVideoID();
            }

            $startvideo ['videoId'] = $video_id;
            $startvideo ['videoIndex'] = $i;
            $startvideo ['artist'] = addslashes ( html_entity_decode ( $track->artist ) );
            $startvideo ['title'] = addslashes ( html_entity_decode ( $track->title ) );
        }

        $video_id = '-1';
    }

    $final_tracklist [] = array (
        'artist' => addslashes ( html_entity_decode ( $track->artist ) ),
        'title' => addslashes ( html_entity_decode ( $track->title ) ),
        'dateofplay' => $track->dateofplay,
        'isplaying' => (($track->isPlaying ()) ? true : false),
        'video_id' => $video_id
    );
}

$trackno = (($page - 1) * $pagecnt) + 1;

/**
 * @var \Smarty $smarty
 */
$smarty->assign ( 'current_page', $page );
$smarty->assign ( 'total_pages', $playlist->totalpages );
$smarty->assign ( 'track_no', $trackno );
$smarty->assign ( 'startvideo', $startvideo );
$smarty->assign ( 'autostart', false );
$smarty->assign ( 'tracklist', $final_tracklist );

$content = $smarty->fetch ( 'playlist.tpl' );
die ( $content );
