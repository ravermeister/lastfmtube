<?php
/**
 * User: ravermeister
 * Date: 07.09.2018
 * Time: 10:44
 */

namespace LastFmTube\Json;


use LastFmTube\Util\Functions;

class YouTubeJson extends DefaultJson {

    public function __construct() {
        parent::__construct('youtube');
    }


    public function get($getvars) {
        if (!isset($getvars['ytaction'])) {
            return $this->jsonError("Falsche Parameter für aktion");
        }

        switch ($getvars['ytaction']) {
            case 'search':
                return search($getvars['listsize']);
        }
    }

    private function search($size = 1) {
        if (is_nan($size)) $size = 1;

        $needle   = Functions::getInstance()->prepareNeedle($_GET ['needle']);
        $searcher = Functions::getInstance()->getYtApi();
        $searcher->setNeedle($needle);

        $searcher->search($size);
        $videos = $searcher->getVideoList();

        return $this->jsonData($videos);

    }
}