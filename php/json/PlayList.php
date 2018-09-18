<?php
/**
 * Created by PhpStorm.
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 11:14
 */

namespace LastFmTube\Json;


use LastFmTube\Util\Functions;

class PlayList extends DefaultJson {

    private static $MAX_LIST_CNT = 25;

    public function __construct() {
        parent::__construct('playlist');
    }


    private function playlistDefault($page = 1) {
        if (is_nan($page)) $page = 1;
        $pagecnt = self::$MAX_LIST_CNT;

        $playlist        = Functions::getInstance()->getLfmApi()->getRecentlyPlayed($page, $pagecnt);
        $tracklist       = $playlist->getTracks();
        $startvideo      = array();
        $final_tracklist = array();

        $searcher = Functions::getInstance()->getYtApi();
        for ($i = 0; $i < sizeof($tracklist); $i++) {
            $track         = $tracklist [$i];
            $track->title  = Functions::getInstance()->prepareNeedle($track->title);
            $track->artist = Functions::getInstance()->prepareNeedle($track->artist);
            $track->album  = Functions::getInstance()->prepareNeedle($track->album);
            $needle        = Functions::getInstance()->prepareNeedle($track->artist . ' ' . $track->title);
            $video_id      = Db::getInstance()->getEnvVar($needle);

            if (strlen($video_id) == 0 || strcmp($video_id, 'undefined') == 0) {

                if (sizeof($startvideo) == 0) {

                    $searcher->setNeedle($needle);
                    $searcher->search();
                    $search_result = $searcher->getVideoList();

                    if (sizeof($search_result) > 0) {
                        $video    = $search_result [0];
                        $video_id = $video->getVideoID();
                    }

                    $startvideo ['videoId']    = $video_id;
                    $startvideo ['videoIndex'] = $i;
                    $startvideo ['artist']     = addslashes(html_entity_decode($track->artist));
                    $startvideo ['title']      = addslashes(html_entity_decode($track->title));
                }

                $video_id = '-1';
            }

            $final_tracklist [] = array('artist'     => addslashes(html_entity_decode($track->artist)),
                                        'title'      => addslashes(html_entity_decode($track->title)),
                                        'dateofplay' => $track->dateofplay,
                                        'isplaying'  => (($track->isPlaying()) ? true : false),
                                        'video_id'   => $video_id);
        }

        $trackno = (($page - 1) * $pagecnt) + 1;

        $list['current_page'] = $page;
        $list['total_pages']  = $playlist->totalPages;
        $list['track_no']     = $trackno;
        $list['startvideo']   = $startvideo;
        $list['autostart']    = false;
        $list['tracklist']    = $final_tracklist;

        return $this->jsonData($list, 'playlist_default');
    }

    private function getPlaylistTopUser() {
        $data = Db::getInstance()->query('SELECT_ALL_LASTFM_USER');
        return $this->jsonData($data, 'playlist_topuser');
    }

    private function getPlaylistUser() {
        /**
         *
         * @todo implement loading of saved playlist for a registered user.
         */
        if (!isset ($_SESSION ['music'] ['playlist'])) {
            if (isset ($_COOKIE ['music_userlist'])) {
                $data                            = $_COOKIE ['music_userlist'];
                $data                            = json_decode($data, true);
                $_SESSION ['music'] ['playlist'] = $data;
            }
            else
                $_SESSION ['music'] ['playlist'] = array();
        }


        return $this->jsonData($_SESSION['music']['playlist'], 'playlist_user');
    }

    private function postPlaylistUser($postvars) {

        if (!isset($postvars['trackdata'])) {
            return $this->jsonData($_SESSION ['music'] ['playlist'], 'playlist_user');
        }

        if (!isset ($_SESSION ['music'] ['playlist'])) {
            if (isset ($_COOKIE ['music_userlist'])) {
                $data                            = $_COOKIE ['music_userlist'];
                $data                            = json_decode($data, true);
                $_SESSION ['music'] ['playlist'] = $data;
            }
            else
                $_SESSION ['music'] ['playlist'] = array();
        }

        $newtitle                           = $postvars['trackdata'];
        $_SESSION ['music'] ['playlist'] [] = $newtitle;
        $_COOKIE ['music_userlist']         = $_SESSION ['music'] ['playlist'];

        return $this->jsonData($_SESSION ['music'] ['playlist'], 'playlist_user');
    }

    private function deletePlaylistUser($getvars) {

        if (isset($getvars['all'])) {
            $_SESSION ['music'] ['playlist'] = array();
            $_COOKIE ['music_userlist']      = $_SESSION ['music'] ['playlist'];

            return $this->jsonData($_SESSION ['music'] ['playlist'], 'playlist_user');
        }


        if (!isset ($_SESSION ['music'] ['playlist'])) {
            if (isset ($_COOKIE ['music_userlist'])) {
                $data                            = $_COOKIE ['music_userlist'];
                $data                            = json_decode($data, true);
                $_SESSION ['music'] ['playlist'] = $data;
            }
            else
                $_SESSION ['music'] ['playlist'] = array();
        }

        $remove_track = $_POST ['trackdata'];
        $new_playlist = array();
        for ($cnt = 0; $cnt < sizeof($_SESSION ['music'] ['playlist']); $cnt++) {
            $savetrack = $_SESSION ['music'] ['playlist'] [$cnt];
            if ((($cnt + 1) == $remove_track ['nr'])) continue;
            $new_playlist [] = $savetrack;
        }

        $_SESSION ['music'] ['playlist'] = $new_playlist;
        return $this->jsonData($_SESSION ['music'] ['playlist'], 'playlist_user');
    }


    public function get($getvars) {
        switch ($getvars['type']) {
            case 'topuser':
                return $this->getPlaylistTopUser();
            case 'userlist':
                return $this->getPlaylistUser();
            default:
                return $this->getPlaylistDefault($getvars['page']);
        }
    }


    public function post($getvars, $postvars) {
        switch ($getvars['type']) {
            case 'userlist':
                return $this->postPlaylistUser($postvars);
        }
    }

    public function delete($getvars) {
        switch ($getvars['type']) {
            case 'userlist':
                return $this->deletePlaylistUser($getvars);
        }

    }
}