<?php
// encoding: UTF-8

require_once dirname(__FILE__) . '/../vendor/autoload.php';

use LastFmTube\Util\lfmapi\RecentlyPlayed;
use LastFmTube\Util\lfmapi\Track;
use LastFmTube\Util\Functions;

$page = 1;
$pagecnt = 25;

function jsonExit($data) {
    die ( json_encode ( $data ) );
}

if (isset ( $_POST ['lastfm_user'] )) {
    $_POST ['lastfm_user'] = trim ( $_POST ['lastfm_user'] );
    /* lastfm user is not case sensitive */
    if (strcasecmp ( $_POST ['lastfm_user'], $_SESSION ['music'] ['lastfm_user'] ) == 0)
        jsonExit ( array (
                'response_code' => 'same_playlist'
        ) );
    // if(strcmp($_POST['lastfm_user'], $_SESSION['music']['lastfm_user']) == 0) jsonExit(array('response_code' => 'same_playlist'));
    else
        $_SESSION ['music'] ['lastfm_user'] = $_POST ['lastfm_user'];
}

$lastfm = Functions::getInstance()->getLfmApi();
$smarty = Functions::getInstance()->getSmarty();
$searcher = Functions::getInstance()->getYtApi();

/**
 * @var  LastFm $lastfm
 */
$lastfm->setUser ( $_SESSION ['music'] ['lastfm_user'] );
/**
 * @var RecentlyPlayed $playlist
 */
$playlist = $lastfm->getRecentlyPlayed ( $page, $pagecnt );
$tracklist = $playlist->getTracks ();
$trackcnt = sizeof ( $tracklist );

if ($trackcnt <= 0) {
    jsonExit ( array (
            'response_code' => 'no_data'
    ) );
}

$startvideo = array();
$final_tracklist = array();

for($i = 0; $i < $trackcnt; $i ++) {

    /**
     * @var Track $track
     */
    $track = $tracklist [$i];
    $track->title = Functions::getInstance ()->prepareNeedle ( $track->title );
    $track->artist = Functions::getInstance ()->prepareNeedle ( $track->artist );
    $track->album = Functions::getInstance ()->prepareNeedle ( $track->album );
    $needle = Functions::getInstance ()->prepareNeedle ( $track->artist . ' ' . $track->title );
    $video_id = Db::getInstance ()->getEnvVar ( $needle );

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

Db::getInstance ()->updateLastFMUserVisit ( $_SESSION ['music'] ['lastfm_user'] );

$trackno = (($page - 1) * $pagecnt) + 1;

/**
 * @var \Smarty $smarty
 */
if (isset ( $_GET ['disable_charts'] ))
    $smarty->assign ( 'chartcounter', false );
else
    $smarty->assign ( 'chartcounter', true );

/**
 * @var mixed|string $settings
 */
$smarty->assign ( 'BASE_PATH', $settings ['general'] ['baseurl'] );
$smarty->assign ( 'music', 1 );
$smarty->assign ( 'lastfm_user', $_SESSION ['music'] ['lastfm_user'] );
$smarty->assign ( 'current_page', $page );
$smarty->assign ( 'total_pages', $playlist->totalpages );
$smarty->assign ( 'track_no', $trackno );
$smarty->assign ( 'startvideo', $startvideo );
$smarty->assign ( 'autostart', false );
$smarty->assign ( 'tracklist', $final_tracklist );
// $smarty->display('index.tpl');

$return_data ['response_code'] = 'ok';
$return_data ['current_page'] = $page;
$return_data ['total_pages'] = $playlist->totalpages;
$return_data ['track_no'] = $trackno;
$return_data ['startvideo'] = $startvideo;
$return_data ['playlist'] = $smarty->fetch ( dirname ( __FILE__ ) . '/../themes/' . $settings ['general'] ['theme'] . '/playlist.tpl' );

jsonExit ( $return_data );
