<?php
/**
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 10:44
 */

namespace LastFmTube\Json;


use LastFmTube\Util\Functions;
use LastFmTube\Util\lfmapi\Track;

class YouTubeJson extends DefaultJson {

    //as stated in exception message from youtube
    const MAX_YT_SEARCH_SIZE = 50;

    public function __construct() {
        parent::__construct('youtube');
    }


    public function get($getvars) {

        if (!isset($getvars['data'])) {
            return $this->jsonError("Falsche Parameter für aktion");
        }
        try {
            $data = false;
            $type = false;
            switch (strtolower($getvars['data'])) {
                case 'search':
                    $data = $this->search($getvars);
                    $type = 'videosearch';
                    break;
                default:
                    return $this->jsonError('Falsche Parameterangabe');
            }
            
            return $this->jsonData($data, $type);
        } catch (Exception $err) {
            return $this->jsonError('unbekannter Fehler: ' . $err->getMessage());
        }
    }

    private function search($getvars) {
        $needle = isset($getvars['needle']) ? $getvars['needle'] : '';
        if (strlen(trim($needle)) == 0) {
            return $this->jsonError('Kein suchkriterium angegeben!');
        }

        $size = isset($getvars['size']) ? $getvars['size'] : 1;
        $size = filter_var($size, FILTER_SANITIZE_NUMBER_INT);
        if ($size > YouTubeJson::MAX_YT_SEARCH_SIZE) {
            $size = YouTubeJson::MAX_YT_SEARCH_SIZE;
        }

        $needle   = Functions::getInstance()->decodeHTML($needle);
        $searcher = Functions::getInstance()->getYtApi();
        $searcher->setNeedle($needle);

        $searcher->search($size);
        $videos = $searcher->getVideoList();

                
        $asTracks = isset($_GET['tracklist']) ? 
            filter_var($_GET['tracklist'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) : 
            false;

        if ($asTracks !== true) {            
            return $videos;
        }

        
        
        $tracks = array();
        for ($cnt=0;$cnt<sizeof($videos);$cnt++) {
            $video = $videos[$cnt];
            $tracks[] = array(
                'NR' => ($cnt + 1),
                'ARTIST' => '',
                'TITLE' => $video->getTitle(),
                'LASTPLAY' => '',
                'VIDEO_ID' => $video->getVideoID(),
                'PLAY_CONTROL' => false,
                'PLAYLIST' => 'search',
                'PLAYSTATE' => ''
            );
        }
        
        return $tracks;
    }
}