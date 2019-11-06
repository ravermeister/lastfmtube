<?php
/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
namespace LastFmTube\Api\LastFm;

use simple_html_dom\simple_html_dom;

class RecentlyPlayed {

     private $page;

     private $totalPages;

     private $itemsPerPage;

     private $items = array();

     /**
      * RecentlyPlayed constructor.
      *
      * @param simple_html_dom $html
      */
     function __construct(&$html) {
          /**
           *
           * @var simple_html_dom $elem
           */
          $elem = $html->find('recenttracks ', 0);
          
          $this->page = $elem->page;
          $this->totalPages = $elem->totalpages;
          $this->itemsPerPage = $elem->perPage;

          $tracks = $elem->find('track');

          foreach ($tracks as $track) {
               $this->items[] = Track::fromXML($track);
          }

          if ($this->page > 1 && sizeof($this->items) > $this->itemsPerPage) {
               // last.fm sends now playing track always...
               // we want it only on page 1
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
          for ($i = 0; $i < sizeof($this->items); $i ++) {
               $track = $this->items[$i];
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