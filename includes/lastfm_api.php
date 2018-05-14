<?php

use Sunra\PhpSimple\HtmlDomParser;

class lastfm {


    var $base_url       = 'http://ws.audioscrobbler.com/2.0';
    var $request_url    = '';
    var $apikey         = ''; 

    var $user           = '';
    var $method         = '';
    var $invalidNames   = array();
        
    var $methods        = array(
                                'album.addTags',
                                'album.getBuylinks',
                                'album.getInfo',
                                'album.getShouts',
                                'album.getTags',
                                'album.getTopTags',
                                'album.removeTag',
                                'album.search',
                                'album.share',
                                
                                'artist.addTags',
                                'artist.getCorrection',
                                'artist.getEvents',
                                'artist.getImages',
                                'artist.getInfo',
                                'artist.getPastEvents',
                                'artist.getPodcast',
                                'artist.getShouts',
                                'artist.getSimilar',
                                'artist.getTags',
                                'artist.getTopAlbums',
                                'artist.getTopFans',
                                'artist.getTopTags',
                                'artist.getTopTracks',
                                'artist.removeTag',
                                'artist.search',
                                'artist.share',
                                'artist.shout',
                                
                                'auth.getSession',
                                'auth.getToken',
                                'auth.getMobileSession',
                                
                                'chart.getHypedArtists',
                                'chart.getHypedTracks',
                                'chart.getLovedTracks',
                                'chart.getTopArtists',
                                'chart.getTopTags',
                                'chart.getTopTracks',
                                'event.attend',
                                'event.getAttendees',
                                'event.getInfo',
                                'event.getShouts',
                                'event.share',
                                'event.shout',
                                
                                'geo.getEvents',
                                'geo.getMetroArtistChart',
                                'geo.getMetroHypeArtistChart',
                                'geo.getMetroHypeTrackChart',
                                'geo.getMetroTrackChart',
                                'geo.getMetroUniqueArtistChart',
                                'geo.getMetroUniqueTrackChart',
                                'geo.getMetroWeeklyChartlist',
                                'geo.getMetros',
                                'geo.getTopArtists',
                                'geo.getTopTracks',
                                
                                'group.getHype',
                                'group.getMembers',
                                'group.getWeeklyAlbumChart',
                                'group.getWeeklyArtistChart',
                                'group.getWeeklyChartList',
                                'group.getWeeklyTrackChart',
                                
                                'library.addAlbum',
                                'library.addArtist',
                                'library.addTrack',
                                'library.getAlbums',
                                'library.getArtists',
                                'library.getTracks',
                                'library.removeAlbum',
                                'library.removeArtist',
                                'library.removeScrobble',
                                'library.removeTrack',
                                
                                'playlist.addTrack',
                                'playlist.create',
                                'playlist.fetch',
                                
                                'radio.getPlaylist',
                                'radio.search',
                                'radio.tune',
                                
                                'tag.getInfo',
                                'tag.getSimilar',
                                'tag.getTopAlbums',
                                'tag.getTopArtists',
                                'tag.getTopTags',
                                'tag.getTopTracks',
                                'tag.getWeeklyArtistChart',
                                'tag.getWeeklyChartList',
                                'tag.search',
                                
                                'tasteometer.compare',
                                
                                'track.addTags',
                                'track.ban',
                                'track.getBuylinks',
                                'track.getCorrection',
                                'track.getFingerprintMetadata',
                                'track.getInfo',
                                'track.getShouts',
                                'track.getSimilar',
                                'track.getTags',
                                'track.getTopFans',
                                'track.getTopTags',
                                'track.love',
                                'track.removeTag',
                                'track.scrobble',
                                'track.search',
                                'track.share',
                                'track.unban',
                                'track.unlove',
                                'track.updateNowPlaying',
                                
                                'user.getArtistTracks',
                                'user.getBannedTracks',
                                'user.getEvents',
                                'user.getFriends',
                                'user.getInfo',
                                'user.getLovedTracks',
                                'user.getNeighbours',
                                'user.getNewReleases',
                                'user.getPastEvents',
                                'user.getPersonalTags',
                                'user.getPlaylists',
                                'user.getRecentStations',
                                'user.getRecentTracks',
                                'user.getRecommendedArtists',
                                'user.getRecommendedEvents',
                                'user.getShouts',
                                'user.getTopAlbums',
                                'user.getTopArtists',
                                'user.getTopTags',
                                'user.getTopTracks',
                                'user.getWeeklyAlbumChart',
                                'user.getWeeklyArtistChart',
                                'user.getWeeklyChartList',
                                'user.getWeeklyTrackChart',
                                'user.shout',
                                
                                'venue.getEvents',
                                'venue.getPastEvents',
                                'venue.search'
                            );
    
    
    
    
    
    
    function loadInvalidNames($filename){
        foreach(file($filename) as $line){
            $entry = explode("=",$line,2);
            $this->invalidNames[$entry[0]] = $entry[1];
        }
    }
    
    
    function setApiKey($key)
    {
        $this->apikey = $key;
    }    
    function setUser($user)
    {
        $this->user = $user;
    }
    function setMethod($meth)
    {
        $set = false;
        for($i=0;$i<sizeof($this->methods);$i++)
        {
            $method = $this->methods[$i];
            if(strncasecmp($meth,$method,strlen($meth))==0)
            {
                $this->method = $method;
                $set=true;
                break;
            }
        }    
        if(!$set)
            die('unknown API method '.$meth);
    }
    function setURL($url)
    {
        $this->request_url = $url;
    }
    
    
    function getDOM()
    {
        $url = $this->base_url.'?method='.$this->method.'&api_key='.$this->apikey;

        if(isset($this->user))
            $url.='&user='.$this->user;

        if(strcmp($this->request_url,'')==0)
            $this->setURL($url);
        $html = HtmlDomParser::file_get_html($this->request_url);
        return $html;
    }
    
    function getData()
    {
        $html = getDOM();
        return $html->outertext;    
    }
    
    
    function getRecentlyPlayed($page=1,$limit=25)
    {
        $url = $this->base_url.'?method=user.getRecentTracks&user='.$this->user.'&api_key='.$this->apikey.'&page='.$page.'&limit='.$limit;
        $this->setURL($url);
        $html = $this->getDOM();
        return new recentlyPlayed($html,$this->invalidNames);
    }
}







class recentlyPlayed
{
    var $page;
    var $totalpages;
    var $itemcount;
    var $items = array();
    
    function recentlyPlayed($html,$invalidStrings)
    {
        $elem = $html->find('recenttracks ',0);
        
        $this->page             = $elem->page;
        $this->totalpages       = $elem->totalpages;
        $this->itemcount        = $elem->perPage;
        
        $tracks = $html->find('track');
        foreach($tracks as $track)
        {
            $trackobj = new track($track,$invalidStrings);
            $this->items[]  = $trackobj;
        }    
    }
    
    function getTracks()
    {
        return $this->items;
    }    
    
    function getPlayingTrack()
    {
        for($i=0;$i<sizeof($this->items);$i++)
        {
            $track = $this->items[$i];
            if($track->isPlaying())
                return $track;
        }
    }
}

class track
{
    var $artist;
    var $title;
    var $album;
    var $isplaying;
    var $dateofplay;
    
    function track($trackxml,$invalidNames)
    {    
        $myArtist = $trackxml->children(0)->innertext;
        $myTitle  = $trackxml->children(1)->innertext;
        $myAlbum  = $trackxml->children(4)->innertext;
	
        $this->artist       = html_entity_decode(((array_key_exists($myArtist,$invalidNames))?$invalidNames[$myArtist]:$myArtist), ENT_QUOTES | ENT_HTML5);
        $this->title        = html_entity_decode(((array_key_exists($myTitle,$invalidNames))?$invalidNames[$myTitle]:$myTitle), ENT_QUOTES | ENT_HTML5);
        $this->album        = html_entity_decode(((array_key_exists($myAlbum,$invalidNames))?$invalidNames[$myAlbum]:$myAlbum), ENT_QUOTES | ENT_HTML5);
	
        //$this->dateofplay   = date('d.m.Y H:i:s',$trackxml->children(10)->getAttribute('uts'));
        $play_timestamp     = 0;	
	if($trackxml->children(10)!==null){
		$play_timestamp=$trackxml->children(10)->uts;       
	}	
        if($play_timestamp>0) 
            $this->dateofplay   = date('d.m.Y H:i:s',$play_timestamp);
        else
            $this->dateofplay   = "Jetzt!"; //timestamp 0 means currently playing!
        $this->isplaying    = $trackxml->nowplaying;
        
    }   
    
    function isPlaying()
    {
        return $this->isplaying;
    } 
}



















?>
