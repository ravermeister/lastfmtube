class ChartTimer {
    constructor() {
        this.track = {
            ARTIST: null,
            TITLE: null,
            isValid: function () {
                return this.ARTIST !== null && this.TITLE !== null;
            }
        };
    }

    start(artist = null, title = null) {

        //check old timer

        this.track.ARTIST = artist;
        this.track.TITLE = title;

        if (!this.track.isValid()) {
            console.error('invalid data for creating Chart Timer, not starting! ');
            return;
        }
        console.log('start chart timer');
    }

    pause(halt = true) {
        console.log((halt ? 'Stop' : 'resume') + ' chart timer');
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
        this.loadNextOnError = false;
        this.CURRENT_TRACK = null;
        this.maxErrorLoop = 5;
        this.errorLoopCount = 0;
        this.errorListeners = [];
        this.stateChangeListeners = [];

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
        this.addStateChangeListener(function (event) {
            switch (event.data) {
                case $player.ytStatus.PLAYING.ID:
                    $player.errorLoopCount = 0;
                    $player.setCurrentState('play');
                    break;
                case $player.ytStatus.PAUSED.ID:
                    $player.setCurrentState('pause');
                    break;
                case $player.ytStatus.BUFFERING.ID:
                    $player.setCurrentState('load');
                    break;
                case $player.ytStatus.ENDED.ID:
                    $player.setCurrentState('stop');
                    break;
            }
        });
        this.addErrorListener(function (event) {
            $player.errorLoopCount++;
        });
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
                if ($player.autoPlay && $page.isReady) {
                    $player.loadNextSong();
                }
                console.log('youtube player ready');
            };

            let onStateChange = function (event) {

                for (let cnt in $player.stateChangeListeners) {
                    let listener = $player.stateChangeListeners[cnt];
                    if (typeof listener !== 'function') continue;
                    listener(event);
                }
            };
            let onError = function (event) {
                console.error('youtube player error', event);
                for (let cnt in $player.errorListeners) {
                    let listener = $player.errorListeners[cnt];
                    if (typeof listener !== 'function') continue;
                    listener(event);
                }
            };

            $(document).ready(function () {

                let percentHeight = function (abs, val) {
                    return parseInt((abs / 100) * val);
                };

                let startvideo = '';//'9RMHHwJ9Eqk';
                let ytplayerwidth = '100%';
                let ytplayerheight = percentHeight($(document).height(), 55) + 'px';

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
            });
        };
    }

    addErrorListener(l = null) {
        if (typeof l !== 'function' || this.errorListeners.indexOf(l) !== -1) return;
        this.errorListeners.push(l);
    }

    removeErrorListener(l) {
        let index = this.errorListeners.indexOf(l);
        if (index < 0 || index >= this.errorListeners.length) return;
        this.errorListeners.splice(index, 1);
    }

    addStateChangeListener(l) {
        if (typeof l !== 'function' || this.stateChangeListeners.indexOf(l) !== -1) return;
        this.stateChangeListeners.push(l);
    }

    removeStateChangeListeners() {
        let index = this.stateChangeListeners.indexOf(l);
        if (index < 0 || index >= this.stateChangeListeners.length) return;
        this.stateChangeListeners.splice(index, 1);
    }

    loadNextSong() {

        let tracks = $page.myVues.playlist.content.$data.TRACKS;
        if (tracks.length === 0) return;

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
                } catch (e) {
                    console.error('inside callback', e, ' curpage: ', curPage, 'maxpage: ', maxPages);
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
        if (tracks.length === 0) return;

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
        if (this.isCurrentTrack(track)) return;

        if (this.CURRENT_TRACK !== null) {
            this.setCurrentState();
            this.CURRENT_TRACK = null;
        }

        this.CURRENT_TRACK = track;
        this.setCurrentState('load');
    }

    setCurrentState(newState = '') {
        if (this.CURRENT_TRACK == null || this.CURRENT_TRACK.PLAYSTATE === newState) return;
        this.CURRENT_TRACK.PLAYSTATE = newState;
        $page.myVues.youtube.menu.$data.PLAYSTATE = newState;
    }

    loadSong(track) {

        //console.log(this.ytPlayer);
        if (this.ytPlayer == null) return;

        this.setCurrentTrack(track);

        let needle = $page.createNeedle(track.ARTIST, track.TITLE, track.VIDEO_ID);
        if (needle.isValid(true)) {
            $player.loadVideoByNeedle(needle);
            return;
        }

        if (!needle.isValid()) {
            if ($player.errorLoopCount > $player.maxErrorLoop) {
                console.error('maximum error loop reached');
                return;
            }
            $player.errorLoopCount++;
            if ($player.loadNextOnError) $player.loadNextSong();
            return;
        }

        let request = 'php/json/JsonHandler.php?api=videos&data=search&needle=' + needle.asVar();

        $.ajax(request, {
            dataType: 'json',
            method: 'GET'
        }).done(function (search) {
            needle.applyData(search);
            $player.loadVideoByNeedle(needle);
        }).fail(function (xhr) {
            if (typeof xhr === 'object' && xhr !== null) {
                console.error(
                    'request: ', request,
                    '\n\nresponse: ', xhr.responseText,
                    '\n\nstatus: ', xhr.status,
                    '\n\nerror: ', xhr.statusText
                );
            } else {
                console.log('request: ', request, 'error');
            }
        });
    }

    searchSong(track, callBack = null) {
        let needle = $page.createNeedle(track.ARTIST, track.TITLE, track.VIDEO_ID);
        if (!needle.isValid()) {
            console.error('needle is invalid exit search');
            return;
        }

        let request =
            'php/json/JsonHandler.php?api=videos&data=search' +
            '&size=50&needle=' + needle.asVar();
        $.getJSON(request, function (json) {
            $playlist.loadSearchResult(needle, json, 1, callBack);

        }).fail(function (xhr) {
            if (typeof xhr === 'object' && xhr !== null) {
                console.error(
                    'request: ', request,
                    '\n\nresponse: ', xhr.responseText,
                    '\n\nstatus: ', xhr.status,
                    '\n\nerror: ', xhr.statusText
                );
            } else {
                console.log('request: ', request, 'error');
            }


            if (typeof callBack === 'function') {
                callBack(false);
            }
        });
    }

    loadVideoByNeedle(needle) {
        if (typeof needle !== 'undefined' && needle.isValid(true)) {
            $player.ytPlayer.loadVideoById(needle.videoId);
        } else {
            console.log('no video id in needle ', needle);
            if ($player.errorLoopCount > $player.maxErrorLoop) {
                console.error('maximum error loop reached');
                return;
            }
            $player.errorLoopCount++;
            if ($player.loadNextOnError) $player.loadNextSong();
        }
    }


    isCurrentTrack(track) {

        let isEqual = this.CURRENT_TRACK !== null && (
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
