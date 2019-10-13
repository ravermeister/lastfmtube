class ChartTimer {
    constructor(player) {

        this.timerStart = null;
        this.timerRemaining = null;
        this.timerTrack = null;
        this.timer = null;
        this.log = false;
        this.lastChartLfmUser = null;

        this.init(player);
    }


    init(player = null) {
        if (player === null) {
            if (this.log) console.error('cannot initialize Timer, invalid player instance!');
            return;
        }

        let control = this;

        player.addStateChangeListener(function (event) {
            switch (event.data) {
                case $player.ytStatus.PLAYING.ID:
                    control.start();
                    break;
                default:
                    control.stop();
                    break;
            }
        });
    }

    handleTimerEvent() {

        let track = $player.chartTimer.timerTrack;
        if ('undefined' === typeof track || track === null) {
            if ($player.chartTimer.log) console.log('timer event invalid track', track);
            return;
        }

        if ($player.chartTimer.log) console.log('handle timer event create needle from track');

        let needle = $page.createNeedle(
            track.artist,
            track.title,
            track.video
        );

        $player.chartTimer.clearTimer();
        $page.saveChartTrack(needle);
        if ('undefined' !== typeof track.lfmuser &&
            track.lfmuser !== '' &&
            $player.chartTimer.lastChartLfmUser !== track.lfmuser) {
            if ($player.chartTimer.log) console.log('handle save user chart');
            $page.saveChartUser(track.lfmuser);
            $player.chartTimer.lastChartLfmUser = track.lfmuser;
        } else if ($player.chartTimer.log) {
            console.log(
                'wont save user chart', track.lfmuser,
                '<-track timer->', $player.chartTimer.lastChartLfmUser
            );
        }

    }

    clearTimer() {
        if (this.timer === null) return;

        clearTimeout(this.timer);
        this.timerStart = null;
        this.timerRemaining = null;
        this.timerTrack = null;
        this.timer = null;
    }


    createTimer(track) {
        // duration is send when metadata arrives from youtube,
        // so delay max. 5 a second before checking duration
        let delay = 500; // ms
        let maxDelayCnt = 10; // 10x500 ms
        let delayCnt = 0;
        let durationTimer = setInterval(function () {
            if (delayCnt >= maxDelayCnt) {
                clearInterval(durationTimer);
                // console.error('can not start timer, no duration received from
				// youtube');
                return;
            }

            let vidDuration = $player.ytPlayer.getDuration();
            if (vidDuration > 0) {
                track.duration = vidDuration;

                let lfmScrobbleDuration = (track.duration / 2) | 0;
                if (lfmScrobbleDuration > 120) lfmScrobbleDuration = 120;
                // last.fm scrobble rule: half length of song or 2 min. if
				// greater

                $player.chartTimer.clearTimer();
                $player.chartTimer.timerStart = new Date();
                $player.chartTimer.timerRemaining = lfmScrobbleDuration;
                $player.chartTimer.timerTrack = track;
                $player.chartTimer.timer = setTimeout(
                    $player.chartTimer.handleTimerEvent,
                    (lfmScrobbleDuration * 1000)
                    /** debug * */
                    /** 10000* */
                );
                if ($player.chartTimer.log)
                    console.log('timer created, remaining: ', $player.chartTimer.timerRemaining);

                if ($player.chartTimer.log) clearInterval(durationTimer);
            }
            delayCnt++;
        }, delay);
    }

    resume(track) {
        if (!this.timerTrack.equals(track)) {
            if (this.log) console.log('timer track not current track, create new timer');
            this.createTimer(track);
            return;
        }

        if (this.log) console.log('resume timer with remaining time: ', this.timerRemaining);

        this.timerStart = new Date();
        this.timer = setTimeout(this.handleTimerEvent, (this.timerRemaining * 1000));
    }

    start() {
        if (!$player.currentTrackData.validTrack() && $player.currentTrackData.validVideo()) return;
        let curTrack = $player.currentTrackData.track;
        let track = {
            artist: curTrack.ARTIST,
            title: curTrack.TITLE,
            video: $player.currentTrackData.videoId,
            lfmuser: $player.currentTrackData.lfmUser,
            duration: 0,
            equals: function (other) {
                return (
                    'undefined' !== typeof other &&
                    other !== null &&
                    this.artist === other.artist &&
                    this.title === other.title &&
                    this.video === other.video
                );
            }
        };
        if (this.timerStart === null) {
            this.createTimer(track);
        } else {
            this.resume(track);
        }
    }

    stop() {
        if (this.timer === null) return;
        let timeRun = ((new Date() - this.timerStart) / 1000) | 0;
        this.timerRemaining -= timeRun;
        clearTimeout(this.timer);
        this.timer = null;
        if (this.log) console.log('timer stopped, timer run: ', timeRun, ' remaining: ', this.timerRemaining);
    }

}

class PlayerController {

    constructor() {
        this.ytPlayer = null;
        this.isReady = false;
        this.autoPlay = false;
        this.loadNextOnError = true;
        this.maxErrorLoop = 5;
        this.lfmUser = '';
        this.errorLoopCount = 0;
        this.errorListeners = [];
        this.stateChangeListeners = [];
        this.ytStatus = {};
        this.currentTrackData = {
            track: null,
            videoId: null,
            playlistTitle: null,

            validTrack: function () {
                return (
                    this.track !== null && ((
                        'undefined' !== typeof this.track.TITLE &&
                        this.track.TITLE !== null &&
                        this.track.TITLE.length > 0
                    ) || (
                        'undefined' !== typeof this.track.ARTIST &&
                        this.track.ARTIST !== null &&
                        this.track.ARTIST.length > 0
                    ))
                );
            },

            validVideo: function () {
                return this.videoId !== null && this.videoId.length > 0;
            }
        };


        this.ytStatus.UNSTARTED = {};
        this.ytStatus.UNSTARTED.ID = -1;
        this.ytStatus.UNSTARTED.NAME = 'unstarted';

        this.ytStatus.ENDED = {};
        this.ytStatus.ENDED.ID = 0;
        this.ytStatus.ENDED.NAME = 'ended';

        this.ytStatus.PLAYING = {};
        this.ytStatus.PLAYING.ID = 1;
        this.ytStatus.PLAYING.NAME = 'playing';

        this.ytStatus.PAUSED = {};
        this.ytStatus.PAUSED.ID = 2;
        this.ytStatus.PAUSED.NAME = 'paused';

        this.ytStatus.BUFFERING = {};
        this.ytStatus.BUFFERING.ID = 3;
        this.ytStatus.BUFFERING.NAME = 'buffering';

        this.ytStatus.CUED = {};
        this.ytStatus.CUED.ID = 5;
        this.ytStatus.CUED.NAME = 'video cued';

        this.chartTimer = new ChartTimer(this);
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
                    $player.loadNextSong();
                    break;
            }
        });
        this.addErrorListener(function (event) {
            $player.errorLoopCount++;

            if ($page.myVues.playlist.menu.$data.PLAYLIST === 'search') {
                $page.myVues.playlist.menu.$data.SEARCH_VIDEO_ID = '';
            }

            if ($player.errorLoopCount >= $player.maxErrorLoop) {
                console.error('maximum error loop reached');
                return;
            }
            $player.setCurrentState('stop');
            $player.loadNextSong();
        });
    }

    initPlayer(initReadyCallback) {

        // $.getScript('//www.youtube.com/iframe_api');
        let tag = document.createElement('script');
        tag.src = '//www.youtube.com/iframe_api';
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = function () {


            let onReady = function (event) {
            	$player.isReady = true;
//            	console.log('youtube player ready');
            	if(typeof initReadyCallback === 'function') {
            		initReadyCallback();
            	}
            };

            let onStateChange = function (event) {

                for (let cnt in $player.stateChangeListeners) {
                    let listener = $player.stateChangeListeners[cnt];
                    if ('function' !== typeof listener) continue;
                    listener(event);
                }
            };
            let onError = function (event) {
                console.error('youtube player error', event);
                for (let cnt in $player.errorListeners) {
                    let listener = $player.errorListeners[cnt];
                    if ('function' !== typeof listener) continue;
                    listener(event);
                }
            };

            $(document).ready(function () {

                let percentHeight = function (abs, val) {
                    return ((abs / 100) * val) | 0;
                };

                let startvideo = '';// '9RMHHwJ9Eqk';
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
        if ('function' !== typeof l || this.errorListeners.indexOf(l) !== -1) return;
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
        let curTrack = this.currentTrackData.track;

        let nextIndex = curTrack !== null ?
            (parseInt(curTrack.NR) % PageController.TRACKS_PER_PAGE) : 0;
        let isLast = curTrack !== null && ($page.myVues.playlist.menu.$data.CUR_PAGE *
            PageController.TRACKS_PER_PAGE) === parseInt(curTrack.NR);

        if (isLast || nextIndex >= tracks.length) {
            let playlist = $page.myVues.playlist.menu;
            let curPage = playlist.$data.CUR_PAGE;
            let maxPages = playlist.$data.MAX_PAGES;
            let user = playlist.$data.LASTFM_USER_NAME;
            if ((curPage + 1) > maxPages) curPage = 1;
            else curPage++;

            $page.loadList(curPage, user, function (success) {
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

        let curTrack = this.currentTrackData.track;
        if (curTrack === null) return;
        let tracks = $page.myVues.playlist.content.$data.TRACKS;
        if (tracks.length === 0) return;
        let isLast = curTrack !== null && ($page.myVues.playlist.menu.$data.CUR_PAGE *
            PageController.TRACKS_PER_PAGE) === parseInt(curTrack.NR);
        let prevIndex = (parseInt(curTrack.NR) % PageController.TRACKS_PER_PAGE) - 2;

        if (isLast) {
            prevIndex = tracks.length - 2;
        } else if (prevIndex < 0) {
            let curPage = $page.myVues.playlist.menu.$data.CUR_PAGE;
            if ('undefined' === typeof curPage) curPage = 1;
            let maxPages = $page.myVues.playlist.menu.$data.MAX_PAGES;
            let user = $page.myVues.playlist.menu.$data.LASTFM_USER_NAME;

            if ((curPage - 1) < 1) curPage = maxPages;
            else curPage--;
            $page.loadList(curPage, user, function (success) {
                if (!success) return;
                tracks = $page.myVues.playlist.content.$data.TRACKS;
                $player.loadSong(tracks[tracks.length - 1]);
            });
            return;
        }

        this.loadSong(tracks[prevIndex]);
    }

    setCurrentTrack(track, force = false) {
        if (!force && this.isCurrentTrack(track)) return;
        let curTrack = this.currentTrackData.track;

        if (curTrack !== null) {
            this.setCurrentState();
            this.currentTrackData.track = null;
        }

        this.currentTrackData.track = track;
        $page.myVues.youtube.header.$data.CURRENT_TRACK = track;
        if (track.PLAYLIST !== 'search') $page.myVues.youtube.header.SEARCH_TRACK = track;
        this.setCurrentState('load');
    }

    setCurrentState(newState = '') {
        let curTrack = this.currentTrackData.track;
        if (curTrack === null || curTrack.PLAYSTATE === newState) return;
        curTrack.PLAYSTATE = newState;
        $page.myVues.youtube.menu.$data.PLAYSTATE = newState;
    }

    loadSong(track) {

        // console.log(this.ytPlayer);
        if (this.ytPlayer === null) return;

        this.setCurrentTrack(track);

        let needle = $page.createNeedle(track.ARTIST, track.TITLE, track.VIDEO_ID);
        if (needle.isValid(true)) {
            $player.loadVideo(needle.videoId);
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

        let request = 'php/json/page/YouTube.php?action=search&needle=' + needle.asVar();

        $.ajax(request, {
            dataType: 'json',
            method: 'GET'
        }).done(function (search) {
            needle.applyData(search);
            $player.loadVideo(needle.videoId);
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

    searchSong(track, callBack = null, loadPage = false) {
        let needle = $page.createNeedle(track.ARTIST, track.TITLE, track.VIDEO_ID);
        if (!needle.isValid()) {
            console.error('needle is invalid exit search');
            return;
        }

        let request =
            'php/json/page/YouTube.php?action=search' +
            '&size=50&needle=' + needle.asVar();
        $.getJSON(request, function (json) {
            PlaylistController.loadSearchResult(needle, json, 1, callBack);
            if (loadPage) location.href = '#' + $page.PLAYLIST;
            if (typeof callBack === 'function') {
                callBack(true);
            }
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

    loadVideo(videoId = '') {
        if (typeof videoId !== 'undefined' && videoId !== null && videoId.length > 0) {
            $player.ytPlayer.loadVideoById(videoId);
            $playlist.loadVideoCommentList(videoId);
            
            $player.currentTrackData.videoId = videoId;
            $player.currentTrackData.lfmUser = $page.myVues.playlist.menu.$data.LASTFM_USER_NAME;
        } else {
            if ($player.errorLoopCount > $player.maxErrorLoop) {
                console.error('maximum error loop reached');
                return;
            }
            $player.errorLoopCount++;
            if ($player.loadNextOnError) {
                $player.loadNextSong();
            }
        }
    }


    isCurrentTrack(track) {
        let curTrack = this.currentTrackData.track;
        if (curTrack === null) return false;
        let checkNr = curTrack.PLAYLIST !== 'topsongs';
        let isEqual = curTrack !== null && (

            curTrack === track || (
                (!checkNr || parseInt(curTrack.NR) === parseInt(track.NR)) &&
                curTrack.PLAYLIST === track.PLAYLIST &&
                curTrack.ARTIST === track.ARTIST &&
                curTrack.TITLE === track.TITLE
            ));

        return isEqual;
    }

    isPlaying() {
        return this.ytPlayer.getPlayerState() === this.ytStatus.PLAYING.ID;
    }

    isPaused() {
        return this.ytPlayer.getPlayerState() === this.ytStatus.PAUSED.ID;
    }
}
