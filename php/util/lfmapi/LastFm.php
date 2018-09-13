<?php

namespace LastFmTube\Util\lfmapi;

use LastFmTube\Util\Strings;
use simplehtmldom_1_5\simple_html_dom;
use Sunra\PhpSimple\HtmlDomParser;

class LastFm {
    var $base_url     = 'http://ws.audioscrobbler.com/2.0';
    var $request_url  = '';
    var $apikey       = '';
    var $user         = '';
    var $method       = '';
    var $invalidNames = array();
    var $methods      = array('album.addTags', 'album.getBuylinks', 'album.getInfo', 'album.getShouts', 'album.getTags',
                              'album.getTopTags', 'album.removeTag', 'album.search', 'album.share',

                              'artist.addTags', 'artist.getCorrection', 'artist.getEvents', 'artist.getImages',
                              'artist.getInfo', 'artist.getPastEvents', 'artist.getPodcast', 'artist.getShouts',
                              'artist.getSimilar', 'artist.getTags', 'artist.getTopAlbums', 'artist.getTopFans',
                              'artist.getTopTags', 'artist.getTopTracks', 'artist.removeTag', 'artist.search',
                              'artist.share', 'artist.shout',

                              'auth.getSession', 'auth.getToken', 'auth.getMobileSession',

                              'chart.getHypedArtists', 'chart.getHypedTracks', 'chart.getLovedTracks',
                              'chart.getTopArtists', 'chart.getTopTags', 'chart.getTopTracks', 'event.attend',
                              'event.getAttendees', 'event.getInfo', 'event.getShouts', 'event.share', 'event.shout',

                              'geo.getEvents', 'geo.getMetroArtistChart', 'geo.getMetroHypeArtistChart',
                              'geo.getMetroHypeTrackChart', 'geo.getMetroTrackChart', 'geo.getMetroUniqueArtistChart',
                              'geo.getMetroUniqueTrackChart', 'geo.getMetroWeeklyChartlist', 'geo.getMetros',
                              'geo.getTopArtists', 'geo.getTopTracks',

                              'group.getHype', 'group.getMembers', 'group.getWeeklyAlbumChart',
                              'group.getWeeklyArtistChart', 'group.getWeeklyChartList', 'group.getWeeklyTrackChart',

                              'library.addAlbum', 'library.addArtist', 'library.addTrack', 'library.getAlbums',
                              'library.getArtists', 'library.getTracks', 'library.removeAlbum', 'library.removeArtist',
                              'library.removeScrobble', 'library.removeTrack',

                              'playlist.addTrack', 'playlist.create', 'playlist.fetch',

                              'radio.getPlaylist', 'radio.search', 'radio.tune',

                              'tag.getInfo', 'tag.getSimilar', 'tag.getTopAlbums', 'tag.getTopArtists',
                              'tag.getTopTags', 'tag.getTopTracks', 'tag.getWeeklyArtistChart',
                              'tag.getWeeklyChartList', 'tag.search',

                              'tasteometer.compare',

                              'track.addTags', 'track.ban', 'track.getBuylinks', 'track.getCorrection',
                              'track.getFingerprintMetadata', 'track.getInfo', 'track.getShouts', 'track.getSimilar',
                              'track.getTags', 'track.getTopFans', 'track.getTopTags', 'track.love', 'track.removeTag',
                              'track.scrobble', 'track.search', 'track.share', 'track.unban', 'track.unlove',
                              'track.updateNowPlaying',

                              'user.getArtistTracks', 'user.getBannedTracks', 'user.getEvents', 'user.getFriends',
                              'user.getInfo', 'user.getLovedTracks', 'user.getNeighbours', 'user.getNewReleases',
                              'user.getPastEvents', 'user.getPersonalTags', 'user.getPlaylists',
                              'user.getRecentStations', 'user.getRecentTracks', 'user.getRecommendedArtists',
                              'user.getRecommendedEvents', 'user.getShouts', 'user.getTopAlbums', 'user.getTopArtists',
                              'user.getTopTags', 'user.getTopTracks', 'user.getWeeklyAlbumChart',
                              'user.getWeeklyArtistChart', 'user.getWeeklyChartList', 'user.getWeeklyTrackChart',
                              'user.shout',

                              'venue.getEvents', 'venue.getPastEvents', 'venue.search');

    function loadInvalidNames($filename) {
        foreach (file($filename) as $line) {
            if (Strings::startsWith($line, '#')) continue;

            $line = Strings::trimEOL($line);
            if (strlen(trim($line)) == 0) continue;

            $entry                           = explode("=", $line, 2);
            $this->invalidNames [$entry [0]] = $entry [1];
        }
    }

    function setApiKey($key) {
        $this->apikey = $key;
    }

    function getUser() {
        return $this->user;
    }

    function setUser($user) {
        $this->user = $user;
    }

    function setMethod($meth) {
        $set = false;
        for ($i = 0; $i < sizeof($this->methods); $i++) {
            $method = $this->methods [$i];
            if (strncasecmp($meth, $method, strlen($meth)) == 0) {
                $this->method = $method;
                $set          = true;
                break;
            }
        }
        if (!$set) die ('unknown API method ' . $meth);
    }

    /**
     * @return simple_html_dom
     */
    function getData() {

        $html = $this->getDOM();
        if (empty($html)) return null;
        return $html->outertext;
    }

    /**
     * @return simple_html_dom
     */
    function getDOM() {
        $url = $this->base_url . '?method=' . $this->method . '&api_key=' . $this->apikey;

        if (isset ($this->user)) $url .= '&user=' . $this->user;

        if (strcmp($this->request_url, '') == 0) $this->setURL($url);
        $html = HtmlDomParser::file_get_html($this->request_url);
        return $html;
    }

    function setURL($url) {
        $this->request_url = $url;
    }

    function getRecentlyPlayed($page = 1, $limit = 25) {
        $url = $this->base_url . '?method=user.getRecentTracks&user=' . $this->user . '&api_key=' . $this->apikey .
               '&page=' . $page . '&limit=' . $limit;
        $this->setURL($url);
        $html = $this->getDOM();

        return new RecentlyPlayed ($html, $this->invalidNames);
    }
}
