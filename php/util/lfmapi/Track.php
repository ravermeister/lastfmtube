<?php

namespace LastFmTube\Util\lfmapi;

use LastFmTube\Util\Functions;

class Track {
    /**
     * @var string
     */
    private $artist;
    /**
     * @var string
     */
    private $title;
    /**
     * @var string
     */
    private $album;
    /**
     * @var bool
     */
    private $isplaying;

    /**
     * @var string
     */
    private $dateofPlay;

    /**
     * Track constructor.
     * @param        $artist
     * @param        $title
     * @param        $album
     * @param string $lastplay
     * @param bool   $isPlaying
     */
    public function __construct($artist, $title, $album = '', $lastplay = '', $isPlaying = false) {
        $this->artist     = Functions::getInstance()->decodeHTML($artist);
        $this->title      = Functions::getInstance()->decodeHTML($title);
        $this->album      = Functions::getInstance()->decodeHTML($album);
        $this->dateofPlay = $lastplay;
        $this->isPlaying  = $isPlaying;
    }


    public static function fromXML($trackxml) {

        // $this->dateofplay = date('d.m.Y H:i:s',$trackxml->children(10)->getAttribute('uts'));
        $isPlaying = false;
        if ($trackxml->children(10) !== null) {
            $timestamp = $trackxml->children(10)->uts;


            if ($timestamp <= 0) {
                // timestamp 0 means currently playing!
                $lastplay  = Functions::getInstance()->getLocale()['playlist.lastplay.now'];
                $isPlaying = true;
            }
            else {
                $lastplay  = date(
                    'Y-m-d H:i:s',
                    $trackxml->children(10)->uts
                );
                $isPlaying = false;
            }
        }
        else {
            //no timestamp means currently playing (tested)
            $lastplay  = Functions::getInstance()->getLocale()['playlist.lastplay.now'];
            $isPlaying = true;
        }
        
        return new Track(
            Functions::getInstance()->decodeHTML($trackxml->children(0)->innertext),
            Functions::getInstance()->decodeHTML($trackxml->children(1)->innertext),
            Functions::getInstance()->decodeHTML($trackxml->children(4)->innertext),
            $lastplay,
            $isPlaying
        );
    }

    /**
     * @return bool
     */
    public function isPlaying() {
        return  $this->isPlaying;
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