<?php

namespace LastFmTube\Util\lfmapi;


use simplehtmldom_1_5\simple_html_dom;

class RecentlyPlayed {
    var $page;
    var $totalPages;
    var $itemsPerPage;
    var $items = array();

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
            $trackobj       = new Track ($track);
            $this->items [] = $trackobj;
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

}