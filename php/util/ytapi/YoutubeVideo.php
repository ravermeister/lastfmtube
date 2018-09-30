<?php

namespace LastFmTube\Util\ytapi;

class YoutubeVideo {
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

    function getVideoID() {
        return $this->video_id;
    }
}