<?php
/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
namespace LastFmTube\Api\YouTube;

/**
 * 
 * @author Jonny Rimkus<jonny@rimkus.it>
 *
 */
class YouTubeVideo {

     var $video_id;

     var $title;

     function setTitle($theTitle) {
          $this->title = $theTitle;
     }

     function getTitle() {
          return $this->title;
     }

     function setVideoID($id) {
          $this->video_id = $id;
     }

     function getVideoId() {
          return $this->video_id;
     }
}