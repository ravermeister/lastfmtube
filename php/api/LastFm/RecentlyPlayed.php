<?php

namespace LastFmTube\Api\LastFm;


class RecentlyPlayed {
    private $page;
    private $totalPages;
    private $itemsPerPage;
    private $items = array();

    /**
     * RecentlyPlayed constructor.
     * @param                 $invalidStrings
     */
    function __construct($html) {

        $elem = $html->find('recenttracks ', 0);

        $this->page         = isset($elem->page) ? $elem->page : 1;
        $this->totalPages   = isset($elem->totalPages) ? $elem->totalpages : 1;
        $this->itemsPerPage = isset($elem->itemsPerPage) ? $elem->itemsPerPage : 25;
        
        $tracks = $html->find('track');
        foreach ($tracks as $track) {
            $this->items [] = Track::fromXML($track);
        }

        if ($this->page > 1 && sizeof($this->items) > $this->itemsPerPage) {
            //last.fm sends now playing track always...
            //we want it only on page 1
            if ($this->items[0]->isPlaying()) {
                array_splice($this->items, 0, 1);
            }
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