<?php
/**
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 10:44
 */

namespace LastFmTube\Json\Page;
require_once dirname(__FILE__) . '/../DefaultJson.php';

use LastFmTube\Json\DefaultJson;
use LastFmTube\Util\Db;
use Exception;
use LastFmTube\Util\Functions;
use VideoComments;
class YouTube extends DefaultJson {

    //as stated in exception message from youtube
    const MAX_YT_SEARCH_SIZE = 50;

    public function __construct() {
        parent::__construct('youtube');
    }

    public static function process($returnOutput = false) {
        $instance = new YouTube();
        $data     = $instance->handleRequest();
        $data     = $instance->jsonData($data);
        if ($returnOutput) return $data;
        die($data);
    }

    public function get() {

        try {
            switch (self::getVar('action', '')) {
                case 'search':
                    return $this->searchVideo();
                    break;
                case 'videoComments':
                    $videoId = self::getVar('videoId', '');
                    Functions::getInstance()->logMessage('Comments for Video: '.$videoId);
                    return $this->loadVideoComments($videoId);
                    break;
                default:
                    $this->jsonError('invalid Arguments');
            }

        } catch (Exception $err) {
            $this->jsonError('unbekannter Fehler: ' . $err->getMessage());
        }
    }
    
    private function loadVideoComments($videoId='', $limit=25) {
        if(strlen($videoId)==0) return;
        
        $searcher = $this->funcs->getYtApi();
        /**
         * 
         * @var VideoComments $searchResult
         */
        $searchResult = $searcher->searchComments($videoId, $limit);             
        return $searchResult->toJson();
    }

    /**
     * @return array|void
     */
    private function searchVideo() {
        $needle = self::getVar('needle', '');
        if (strlen(trim($needle)) == 0) {
            return $this->jsonError('invalid search criteria!');
        }

        $size = self::getVar('size', 1);
        if ($size > YouTube::MAX_YT_SEARCH_SIZE) {
            $size = YouTube::MAX_YT_SEARCH_SIZE;
        }

        $needle   = $this->funcs->decodeHTML($needle);
        $searcher = $this->funcs->getYtApi();
        $searcher->setNeedle($needle);

        $videos = $searcher->searchVideo($size);
        if ($size == 1) {
            if( sizeof($videos) <= 0) return '';
            
            /** @var YouTubeVideo $video */
            $video = $videos[0];
            return $video->getVideoId();
        }
        $tracks = array();
        for ($cnt = 0; $cnt < sizeof($videos); $cnt++) {

            /** @var YouTubeVideo $video */
            $video = $videos[$cnt];
            /**
             * TODO: we could split the title to an artist and title and use the replaceMap
             */
            $tracks[] = array(
                'NR'           => ($cnt + 1),
                'ARTIST'       => '',
                'TITLE'        => $video->getTitle(),
                'LASTPLAY'     => '',
                'VIDEO_ID'     => $video->getVideoId(),
                'PLAY_CONTROL' => false,
                'PLAYLIST'     => 'search',
                'PLAYSTATE'    => ''
            );
        }
        return $tracks;
    }

    public function post() {
        switch (self::getVar('action', '')) {
            case 'save-video':
                return $this->saveVideo();
            case 'delete-video':
                return $this->deleteVideo();
            default:
                $this->jsonError('invalid Arguments');
        }
    }

    private function saveVideo() {
        $artist = trim($this->funcs->decodeHTML(self::getVar('artist', '', $_POST)));
        $title  = trim($this->funcs->decodeHTML(self::getVar('title', '', $_POST)));
        $video  = trim($this->funcs->decodeHTML(self::getVar('videoId', '', $_POST)));
        if (strlen($video) === 0 || (strlen($title) === 0 && strlen($artist) === 0)) {
            $this->jsonError('invalid Arguments');
            return;
        }

        $db    = Db::getInstance();
        $track = array(
            'artist' => $artist,
            'title'  => $title,
            'url'    => $video
        );
        $upcnt = $db->query('EDIT_VIDEO', $track);
        if ($upcnt === 0) {
            $db->query('ADD_VIDEO', $track);
        }
        return $track;
    }

    private function deleteVideo() {
        $artist = trim($this->funcs->decodeHTML(self::getVar('artist', '', $_POST)));
        $title  = trim($this->funcs->decodeHTML(self::getVar('title', '', $_POST)));
        if (strlen($title) === 0 && strlen($artist) === 0) {
            $this->jsonError('invalid Arguments');
            return;
        }
        $track = array(
            'artist' => $artist,
            'title'  => $title
        );

        $db = Db::getInstance();
        $db->query('DELETE_VIDEO', $track);
        return $track;
    }
}

YouTube::process();