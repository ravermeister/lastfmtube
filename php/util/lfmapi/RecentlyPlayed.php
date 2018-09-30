<?php

namespace LastFmTube\Util\lfmapi;


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