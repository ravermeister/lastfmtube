<?php

namespace LastFmTube\Util\lfmapi;

use simplehtmldom_1_5\simple_html_dom_node;

class Track {
    /**
     * @var string
     */
    var $artist;
    /**
     * @var string
     */
    var $title;
    /**
     * @var string
     */
    var $album;
    /**
     * @var bool
     */
    var $isplaying;

    /**
     * @var string
     */
    var $dateofplay;

    /**
     * Track constructor.
     * @param simple_html_dom_node $trackxml
     * @param $invalidNames
     */
    function __construct($trackxml, $invalidNames) {
        $myArtist = $trackxml->children ( 0 )->innertext;
        $myTitle = $trackxml->children ( 1 )->innertext;
        $myAlbum = $trackxml->children ( 4 )->innertext;

        $this->artist = html_entity_decode ( ((array_key_exists ( $myArtist, $invalidNames )) ? $invalidNames [$myArtist] : $myArtist), ENT_QUOTES | ENT_HTML5 );
        $this->title = html_entity_decode ( ((array_key_exists ( $myTitle, $invalidNames )) ? $invalidNames [$myTitle] : $myTitle), ENT_QUOTES | ENT_HTML5 );
        $this->album = html_entity_decode ( ((array_key_exists ( $myAlbum, $invalidNames )) ? $invalidNames [$myAlbum] : $myAlbum), ENT_QUOTES | ENT_HTML5 );

        // $this->dateofplay = date('d.m.Y H:i:s',$trackxml->children(10)->getAttribute('uts'));
        $play_timestamp = 0;
        if ($trackxml->children ( 10 ) !== null) {
            $play_timestamp = $trackxml->children ( 10 )->uts;
        }
        if ($play_timestamp > 0)
            $this->dateofplay = date ( 'd.m.Y H:i:s', $play_timestamp );
        else
            $this->dateofplay = "Jetzt!"; // timestamp 0 means currently playing!
        $this->isplaying = $trackxml->nowplaying;
    }

    /**
     * @return bool
     */
    function isPlaying() {
        return $this->isplaying;
    }

}