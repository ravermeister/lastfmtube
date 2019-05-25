<?php

namespace LastFmTube\Api\YouTube;

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