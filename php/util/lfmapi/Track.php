<?php

namespace LastFmTube\Util\lfmapi;

use LastFmTube\Util\Functions;
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
    var $dateofPlay;

    /**
     * Track constructor.
     * @param simple_html_dom_node $trackxml
     * @param                      $invalidNames
     */
    function __construct($trackxml) {
        $myArtist = $trackxml->children(0)->innertext;
        $myTitle  = $trackxml->children(1)->innertext;
        $myAlbum  = $trackxml->children(4)->innertext;

        $this->artist = html_entity_decode($myArtist, ENT_QUOTES | ENT_HTML5);
        $this->title  = html_entity_decode($myTitle, ENT_QUOTES | ENT_HTML5);
        $this->album  = html_entity_decode($myAlbum, ENT_QUOTES | ENT_HTML5);

        $this->title  = Functions::getInstance()->prepareNeedle($this->title);
        $this->artist = Functions::getInstance()->prepareNeedle($this->artist);

        // $this->dateofplay = date('d.m.Y H:i:s',$trackxml->children(10)->getAttribute('uts'));
        $play_timestamp = 0;
        if ($trackxml->children(10) !== null) {
            $play_timestamp = $trackxml->children(10)->uts;
        }
        if ($play_timestamp > 0) $this->dateofPlay = date('d.m.Y H:i:s', $play_timestamp);
        else
            $this->dateofPlay = "Jetzt!"; // timestamp 0 means currently playing!
        $this->isplaying = $trackxml->nowplaying;
    }

    /**
     * @return bool
     */
    function isPlaying() {
        return $this->isplaying;
    }

    /**
     * @return string
     */
    public function getAlbum() {
        return $this->album;
    }

    /**
     * @return string
     */
    public function getArtist() {
        return $this->artist;
    }

    /**
     * @return string
     */
    public function getDateofPlay() {
        return $this->dateofPlay;
    }

    /**
     * @return string
     */
    public function getTitle() {
        return $this->title;
    }
}