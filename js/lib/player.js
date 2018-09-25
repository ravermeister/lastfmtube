class ChartTimer {
    constructor() {
        this.track = {
            ARTIST: null,
            TITLE: null,
            isValid: function() {
                return this.ARTIST !== null && this.TITLE !== null;
            }
        };
    }

    start(artist = null, title = null) {

        //check old timer

        this.track.ARTIST = artist;
        this.track.TITLE = title;

        if(!this.track.isValid()) {
            console.error('invalid data for creating Chart Timer, not starting! ');
            return;
        }
        console.log('start chart timer');
    }

    pause(halt = true) {
        console.log((halt ? 'Stop' : 'resume')+' chart timer');
    }

    timerFinished() {
        console.log('timr finished');
    }
}

class PlayerController {

    constructor() {
        this.ytPlayer = null;
        this.isReady = false;
        this.autoPlay = false;
        this.CURRENT_TRACK = null;
        this.ytStatus = new Object();

        this.ytStatus.UNSTARTED = new Object();
        this.ytStatus.UNSTARTED.ID = -1;
        this.ytStatus.UNSTARTED.NAME = 'unstarted';

        this.ytStatus.ENDED = new Object();
        this.ytStatus.ENDED.ID = 0;
        this.ytStatus.ENDED.NAME = 'ended';

        this.ytStatus.PLAYING = new Object();
        this.ytStatus.PLAYING.ID = 1;
        this.ytStatus.PLAYING.NAME = 'playing';

        this.ytStatus.PAUSED = new Object();
        this.ytStatus.PAUSED.ID = 2;
        this.ytStatus.PAUSED.NAME = 'paused';

        this.ytStatus.BUFFERING = new Object();
        this.ytStatus.BUFFERING.ID = 3;
        this.ytStatus.BUFFERING.NAME = 'buffering';

        this.ytStatus.CUED = new Object();
        this.ytStatus.CUED.ID = 5;
        this.ytStatus.CUED.NAME = 'vide cued';

        this.chartTimer = new ChartTimer();
    }

    initPlayer() {

        //$.getScript('//www.youtube.com/iframe_api');
        let tag = document.createElement('script');
        tag.src = '//www.youtube.com/iframe_api';
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = function () {


            let onReady = function (event) {
                $player.isReady = true;
                if ($player.autoPlay) {
                    $player.loadNextSong();
                }
                console.log('youtube player ready');
            };

            let onStateChange = function (event) {

                
                
                switch (event.data) {
                    case $player.ytStatus.UNSTARTED.ID:
                        break;
                    case $player.ytStatus.ENDED.ID:
                        $player.setCurrentState('stop');
                        $player.loadNextSong();
                        break;

                    case $player.ytStatus.PLAYING.ID:
                        $page.myVues.youtube.header.$data.NOW_PLAYING = $player.ytPlayer.getVideoData().title;
                        $player.setCurrentState('play');                        
                        break;

                    case $player.ytStatus.PAUSED.ID:
                        $player.setCurrentState('pause');
                        break;

                    case $player.ytStatus.BUFFERING.ID:
                        $player.setCurrentState('load');
                        break;

                    case $player.ytStatus.CUED.ID:
                        console.log('track cued');
                        break;
                }
            };
            let onError = function (event) {
                console.error('youtube player error', event);
            };

            $(document).ready(function () {

                let percentHeight = function(abs, val) {
                       return parseInt((abs/100)*val);
                };
                
                let startvideo = '';//'9RMHHwJ9Eqk';
                let ytplayerwidth = '100%';                
                let ytplayerheight = percentHeight($(document).height(), 55)+'px';
                
                $player.ytPlayer = new YT.Player('player', {

                    height: ytplayerheight,
                    width: ytplayerwidth,
                    videoId: startvideo,
                    crossDomain: true,

                    playerVars: {
                        'allowfullscreen': 1,
                        'allowscriptaccess': 'always',
                        'webkitallowfullscreen': 1,
                        'mozallowfullscreen': 1,
                        'autoplay': 1,
                        'html5': 1,
                        'enablejsapi': 1,
                        'fs': 1,
                        'playerapiid': 'lastfmtube'
                    },

                    events: {
                        'onReady': onReady,
                        'onStateChange': onStateChange,
                        'onError': onError
                    }
                });
            })
        };
    }

    loadNextSong() {

        let tracks = $page.myVues.playlist.content.$data.TRACKS;
        if(tracks.length === 0) return;
        
        let nextIndex = this.CURRENT_TRACK !== null ? tracks.indexOf(this.CURRENT_TRACK) + 1 : 0;

        if ((nextIndex) >= tracks.length) {
            let playlist = $page.myVues.playlist.menu;
            let curPage = playlist.$data.CUR_PAGE;
            let maxPages = playlist.$data.MAX_PAGES;
            let user = playlist.$data.LASTFM_USER_NAME;
            if ((curPage + 1) > maxPages) curPage = 1;
            else curPage++;

            $playlist.loadPlaylistPage(curPage, user, function (success) {
                try {
                    if (!success) return;
                    let tracks = $page.myVues.playlist.content.$data.TRACKS;
                    $player.loadSong(tracks[0]);                    
                }catch (e) {
                    console.error('inside callback', e, ' curpage: ',curPage, 'maxpage: ', maxPages);
                }
            });

            return;
        } else if (nextIndex < 0) {
            nextIndex = 0;
        }
        
        this.loadSong(tracks[nextIndex]);
    }

    loadPreviousSong() {
        if (this.CURRENT_TRACK == null) return;
        let tracks = $page.myVues.playlist.content.$data.TRACKS;
        if(tracks.length === 0) return;
        
        let index = tracks.indexOf(this.CURRENT_TRACK);

        if ((index - 1) < 0) {
            let playlist = $page.myVues.playlist.header.menu;
            let curPage = playlist.$data.CUR_PAGE;
            let maxPages = playlist.$data.MAX_PAGES;
            let user = playlist.$data.LASTFM_USER_NAME;
            if ((curPage - 1) > maxPages) curPage = maxPages;
            else curPage--;

            $playlist.loadPlaylistPage(user, curPage, 'default', function (success) {
                if (!success) return;

                let tracks = $page.vueMap['PLAYLIST_TRACKS'].$data.TRACKS;
                $player.loadSong(tracks[tracks.length - 1]);
            });


            index = tracks.length - 1;
        } else if (index < 0) {
            index = 0;
        } else {
            index--;
        }

        this.loadSong(tracks[index]);
    }

    setCurrentTrack(track) {
        if(this.isCurrentTrack(track)) return;
        
        if (this.CURRENT_TRACK !== null) {
            this.setCurrentState();
            this.CURRENT_TRACK = null;
        }
        
        this.CURRENT_TRACK = track;
        this.setCurrentState('load');
    }
    
    setCurrentState(newState = '') {
        if(this.CURRENT_TRACK==null || this.CURRENT_TRACK.PLAYSTATE === newState) return;
        this.CURRENT_TRACK.PLAYSTATE = newState;
        $page.myVues.youtube.menu.$data.PLAYSTATE = newState; 
    }

    loadSong(track) {
        //console.log(artist);
        //console.log(title);
        //console.log(this.ytPlayer);
        if (this.ytPlayer == null) return;        
        this.setCurrentTrack(track);   

        let needle = $page.createNeedle(track);
        if (needle.videoId !== null && needle.videoId.length > 0) {            
            $player.loadVideoByNeedle(needle);
            return;
        }
        
        if(!needle.isValid()) {
            this.loadNextSong();
            return;
        }
        
        let request = './php/json/JsonHandler.php?api=videos&data=search&needle=' + needle.asVar();
        
        $.ajax(request, {
            dataType: 'json'
        }).done(function (search) {

            needle.applyData(search);

            if (!needle.isValid(true)) {
                console.log('load next song no video was found');
                return;
            }

            $player.loadVideoByNeedle(needle);
        }).fail(function (xhr) {
            console.error('error: ', xhr);
        });
    }

    loadVideoByNeedle(needle) {
        if (typeof needle !== 'undefined' && needle.isValid(true)) {
            $player.ytPlayer.loadVideoById(needle.videoId);
        } else {
            console.error('invalid parameter for loadVideoByNeedle');
            console.error(needle);
        }
    }


    isCurrentTrack(track) {
        
        let isEqual =  this.CURRENT_TRACK !== null && (
            this.CURRENT_TRACK == track || (
                this.CURRENT_TRACK.NR == track.NR &&
                this.CURRENT_TRACK.PLAYLIST == track.PLAYLIST &&
                this.CURRENT_TRACK.ARTIST == track.ARTIST &&
                this.CURRENT_TRACK.TITLE == track.TITLE
            ));

        return isEqual;
    }

    isPlaying() {
        return this.ytPlayer.getPlayerState() == this.ytStatus.PLAYING.ID;
    }

    isPaused() {
        return this.ytPlayer.getPlayerState() == this.ytStatus.PAUSED.ID;
    }
}
