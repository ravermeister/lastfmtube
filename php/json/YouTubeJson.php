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
        $size = isset($getvars['size']) ? $getvars['size'] : 1;
        $needle = isset($getvars['needle']) ? $getvars['needle'] : '';
        if(strlen(trim($needle)) == 0) {
            return $this->jsonError('Kein suchkriterium angegeben!');
        }

        $needle   = Functions::getInstance()->prepareNeedle($needle);
        $searcher = Functions::getInstance()->getYtApi();
        $searcher->setNeedle($needle);

        $searcher->search($size);
        $videos = $searcher->getVideoList();

        return $videos;

    }
}