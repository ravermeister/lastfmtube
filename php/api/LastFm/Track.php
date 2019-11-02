<?php
/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
namespace LastFmTube\Api\LastFm;

use Exception;
use LastFmTube\Util\Functions;
use simple_html_dom\simple_html_dom;

class Track {

     /**
      *
      * @var string
      */
     private $artist;

     /**
      *
      * @var string
      */
     private $title;

     /**
      *
      * @var string
      */
     private $album;

     /**
      *
      * @var bool
      */
     private $isPlaying;

     /**
      *
      * @var string
      */
     private $dateofPlay;

     /**
      *
      * @var integer
      */
     private $playcount;

    /**
     * Track constructor.
     *
     * @param $artist
     * @param $title
     * @param string $album
     * @param string $lastplay
     * @param bool $isPlaying
     */
     public function __construct($artist, $title, $album = '', $lastplay = '', $isPlaying = false) {
          $this->artist = $artist;
          $this->title = $title;
          $this->album = $album;

          $this->dateofPlay = $lastplay;
          $this->isPlaying = $isPlaying;
     }

     /**
      *
      * @param simple_html_dom $trackxml
      * @return Track
      */
     public static function fromXML($trackxml) {

          // $this->dateofplay = date('d.m.Y H:i:s',$trackxml->children(10)->getAttribute('uts'));

         $artist = $trackxml->find('artist', 0);
          $title = $trackxml->find('name', 0);
          $album = $trackxml->find('album', 0);
          $date = $trackxml->find('date', 0);

          if ($date !== null) {
               $timestamp = $date->uts;
               // timestamp 0 or attribute nowplaying=true means currently playing!
               if ($timestamp <= 0 || 'true' === $trackxml->nowplaying) {
                    $lastplay = Functions::getInstance()->getLocale()['playlist.nowplaying'];
                    $isPlaying = true;
               } else {
                    $lastplay = date('Y-m-d H:i:s', $date->uts);
                    $isPlaying = false;
               }
          } else {
               // no timestamp means currently playing (tested)
               $lastplay = Functions::getInstance()->getLocale()['playlist.nowplaying'];
               $isPlaying = true;
          }

          return new Track(Functions::getInstance()->decodeHTML($artist->innertext), Functions::getInstance()->decodeHTML($title->innertext), Functions::getInstance()->decodeHTML($album->innertext), $lastplay, $isPlaying);
     }

     /**
      *
      * @return bool
      */
     public function isPlaying() {
          return $this->isPlaying;
     }

     /**
      *
      * @return string
      */
     public function getAlbum() {
          return $this->album;
     }

     /**
      *
      * @return string
      */
     public function getArtist() {
          return $this->artist;
     }

     public function setArtist($artist) {
          $this->artist = $artist;
     }

     /**
      *
      * @return string
      */
     public function getDateofPlay() {
          return $this->dateofPlay;
     }

     /**
      *
      * @return string
      */
     public function getTitle() {
          return $this->title;
     }

     public function setTitle($title) {
          $this->title = $title;
     }

     public function getPlayCount() {
          return $this->playcount;
     }

     public function setPlayCount($playount) {
          $this->playcount = $playount;
     }

     public function normalize() {
          // Functions::getInstance()->logMessage('before normalize, artist: >'.$this->artist.'<, title: >'.$this->title.'<');
         try {
             Functions::normalizeTrack($this->artist, $this->title);
         } catch (Exception $e) {
             Functions::getInstance()->logMessage('Error normalizing Track: '.$e->getMessage());
         }
         // Functions::getInstance()->logMessage('after normalize, artist: >'.$this->artist.'<, title: >'.$this->title.'<');
     }
}