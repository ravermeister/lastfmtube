<?php

namespace LastFmTube\Util\lfmapi;


use LastFmTube\Util\Functions;
use simplehtmldom_1_5\simple_html_dom;

class RecentlyPlayed {
    private $page;
    private $totalPages;
    private $itemsPerPage;
    private $items = array();

    /**
     * RecentlyPlayed constructor.
     * @param simple_html_dom $html
     * @param                 $invalidStrings
     */
    function __construct($html) {
        /**
         * @var simple_html_dom $elem
         */
        $elem = $html->find('recenttracks ', 0);

        $this->page         = $elem->page;
        $this->totalPages   = $elem->totalpages;
        $this->itemsPerPage = $elem->perPage;
                   

        $tracks = $html->find('track');
        foreach ($tracks as $track) { 
            $this->items [] = Track::fromXML($track);
        }
        if($this->page > 1 && sizeof($this->items) > $this->itemsPerPage) {
            //last.fm sends now playing track always...
            //we want it only on page 1
            if($this->items[0]->isPlaying()) {
                array_splice($this->items, 0, 1);
            } 
        }
        if($this->page > 1) Functions::getInstance()->logMessage('playlist size: ' . sizeof($tracks));
    }

    function getTracks() {
        return $this->items;
    }

    function getPlayingTrack() {
        $playing = '';
        for ($i = 0; $i < sizeof($this->items); $i++) {
            $track = $this->items [$i];
            if ($track->isPlaying()) {
                $playing = $track;
                break;
            }
        }

        return $playing;
    }

    function getTotalPages() {
        return $this->totalPages;
    }
}