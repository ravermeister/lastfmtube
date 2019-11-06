/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class PageController {

    constructor() {

        this.analytics = null;
        this.icons = new Icons();
        this.settings = {};
        this.isReady = false;
        this.PLAYLIST = null;
        this.SEARCH_RETURN_PLAYLIST = null;
        this.PLAY_CONTROL = null;
        this.QUICKPLAY_TRACK = null;
        
        this.loader = new PageLoader();
        this.menu = new Menu(this);
        this.myVues = {};
		VueController.applyVueMethods();
        this.applyJQueryMethods();
    }
    

    trackPlaylist(playlist) {
        if (!this.isFunction(this.analytics)) return;
        this.analytics('send', {
            'hitType': 'event',
            'eventCategory': playlist,
            'eventAction': 'view',
            'eventLabel': 'Playlist'
        });
    }

    trackSongPlay(track) {
    	if (!this.isFunction(this.analytics)) return;
    	this.analytics('send', {
            'hitType': 'event',
            'eventCategory': (track.artist + ' ' + track.title),
            'eventAction': 'play',
            'eventLabel': 'Track played'
        });
    }

    applyJQueryMethods() {
        $.urlParam = function (name, url = null) {
            let theUrl = url !== null ? url : window.location.href;
            let results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(theUrl);
            return results === null ? null : results[1] || null;
        };
        $.logXhr = function (xhr) {
            if (typeof xhr === 'object' && xhr !== null) {
                console.error(
                    '\n\nresponse: ', xhr.responseText,
                    '\n\nstatus: ', xhr.status,
                    '\n\nerror: ', xhr.statusText
                );
            }
        };
    }

    initShareButtons() {
		// let a2a_config = a2a_config || {};
    	let a2a_config = {};
		a2a_config.linkname = "Last.fm YouTube Radio";
		a2a_config.linkurl = "https://lastfm.rimkus.it";
		a2a_config.locale = "en";
    }
    
    initSettings() {    
    	let page = this;
    	
    	$.ajax({
			url: 'php/json/page/Page.php?action=config',
			dataType: 'json',
			async: false,
			success: function(json) {
				if(json && json.data && json.data.value) {
					page.settings = json.data.value;				
				}
			},
			error: function(xhr) {
	            $.logXhr(xhr);
			}
		});
    }
    
    init(initReadyCallBack) {
    	this.initSettings();
    	this.initShareButtons();    	
        this.myVues = VueController.createVues();
                let request = 'php/json/page/Page.php?action=init';
        $.getJSON(request, function (json) {
            if ('undefined' === typeof json || 'undefined' === typeof json.data) return;

            console.log('init data: ', json.data.value);
            $page.myVues.updateAll(json.data.value);
            $page.menu.updateData(json.data.value);

            $page.isReady = true;
            if(typeof initReadyCallBack === 'function') {
            	initReadyCallBack();
            } else {
            	$page.loader.initURL();
            }       
                        
            console.log('init page success');
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

    setCurrentPlaylist(playlist = null) {

    	
    	if (playlist === null || playlist === 'video' || $page.isCurrentPlaylist(playlist))
            return;
    	
        if(playlist === 'search') {
        	$page.SEARCH_RETURN_PLAYLIST = $page.PLAYLIST;
        	if($page.SEARCH_RETURN_PLAYLIST === null) {
        		$page.SEARCH_RETURN_PLAYLIST = 'lastfm';	
        	}
        }

        $page.PLAYLIST = playlist;
        $page.myVues.playlist.menu.$data.PLAYLIST = $page.PLAYLIST;
        $page.myVues.playlist.header.menu.$data.PLAYLIST = $page.PLAYLIST;
        $page.myVues.playlist.header.title.$data.PLAYLIST = $page.PLAYLIST;
        $page.myVues.youtube.header.$data.PLAYLIST = $page.PLAYLIST;

        if (!$player.isPlaying() ||
            'undefined' === typeof $player.currentTrackData.track ||
            $player.currentTrackData.track === null ||
            $player.currentTrackData.track.PLAYLIST === playlist) {
        }

    }

    isCurrentPlaylist(playlist) {
        return (
            typeof playlist !== 'undefined' &&
            this.PLAYLIST === playlist
        );
    }


    createNeedle(artist = '', title = '', videoId = '') {
        return {
            artist: artist,
            title: title,
            videoId: videoId,
            asVar: function (raw = false) {
                if (
                    typeof this.artist === 'undefined' ||
                    typeof this.title === 'undefined' ||
                    this.artist === null ||
                    this.title === null
                ) return '';


                if (!raw) return (encodeURIComponent(this.artist) + ' ' + encodeURIComponent(this.title)).trim();
                else return (this.artist + ' ' + this.title).trim();
            },
            isValid: function (checkVideo = false) {
                if (checkVideo) {
                    return (
                        typeof this.videoId !== 'undefined' &&
                        this.videoId !== null &&
                        this.videoId.trim().length > 0
                    );
                }

                let needleVar = this.asVar();

                return (
                    typeof needleVar !== 'undefined' &&
                    needleVar !== null &&
                    needleVar.trim().length > 0
                );
            },
            applyData: function (json) {
                if (
                    typeof json.data !== 'undefined' &&
                    typeof json.data.value == 'string' &&
                    json.data.value.trim().length > 0
                ) {
                    this.videoId = json.data.value;
                }
            }
        };
    }

    static clone(src) {
        return Object.assign({}, src);
    }

    static resetTrack(track) {
        track.PLAY_CONTROL = false;
        track.SHOWPLAY = false;
        track.NOWPLAYING = false;
        track.LOADING = false;
    }

    isFunction(functionToCheck) {
    	 return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }
    
    saveChartUser(lfmuser = null) {
        if (typeof lfmuser === 'undefined' || lfmuser === null) return;

        $.ajax('php/json/page/Page.php?action=save-userplay', {
            dataType: 'json',
            method: 'POST',
            data: {
                user: lfmuser
            }
        }).done(function (userJson) {

            for (let cnt in $page.myVues.userlist.content.$data.USER) {
                let user = $page.myVues.userlist.content.$data.USER[cnt];

                if (user.NAME === userJson.data.value.username) {
                    user.PLAYCOUNT = userJson.data.value.playcount;
                    user.LASTPLAY = userJson.data.value.lastplay;
                    user.PLAYCOUNT_CHANGE = parseInt(user.NR) - parseInt(userJson.data.value.nr);
                }
            }

        }).fail(function (xhr) {
            if (typeof xhr === 'object' && xhr !== null) {
                console.error(
                    '\n\nresponse: ', xhr.responseText,
                    '\n\nstatus: ', xhr.status,
                    '\n\nerror: ', xhr.statusText
                );
            } else {
                console.log('request: ', request, 'error');
            }

        });
    }

    saveChartTrack(needle, callback = null) {
    	    	
        if (!needle.isValid()) {
            if (callback !== null) {
                callback(false);
            }
            return;
        }

        $.ajax('php/json/page/Page.php?&action=save-trackplay', {
            dataType: 'json',
            method: 'POST',
            data: {
                artist: needle.artist,
                title: needle.title
            }
        }).done(function (chartJson) {
                let isTopSongPlaylist = $page.myVues.playlist.menu.$data.PLAYLIST === 'topsongs';
                let trackList = $page.myVues.playlist.content.$data.TRACKS;
                let oldTrack = null;

                for (let cnt = 0; cnt < $page.myVues.playlist.content.$data.TRACKS.length; cnt++) {
                    let track = $page.myVues.playlist.content.$data.TRACKS[cnt];
                    if (
                        track.ARTIST === chartJson.data.value.artist &&
                        track.TITLE === chartJson.data.value.title
                    ) {
                        oldTrack = track;
                        break;
                    }
                }

                if (oldTrack === null) {
                    if (!isTopSongPlaylist) return;

                    let newTrack = LibvuePlaylist.createEmptyTrack();
                    newTrack.NR = chartJson.data.value.pos;
                    newTrack.ARTIST = chartJson.data.value.artist;
                    newTrack.TITLE = chartJson.data.value.title;
                    newTrack.LASTPLAY = chartJson.data.value.lastplayed;
                    newTrack.PLAYCOUNT = chartJson.data.value.playcount;
                    newTrack.PLAYCOUNT_CHANGE = (parseInt(newTrack.NR) - parseInt(chartJson.data.value.pos));

                    if (trackList.length === 0) {
                        $page.myVues.playlist.content.$data.TRACKS.push(newTrack);
                        return;
                    }

                    if ($page.myVues.playlist.content.$data.TRACKS[0].NR > newTrack.NR) {
                        return; // we are higher than first pos in list
                    }

                    let trackInserted = false;
                    for (let cnt = 0; cnt < trackList.length; cnt++) {
                        let curTrack = trackList[cnt];
                        if (!trackInserted && curTrack.NR >= newTrack.NR) {
                            $page.myVues.playlist.content.$data.TRACKS.splice(cnt, 0, newTrack);
                            trackInserted = true;
                        } else if (trackInserted) {
                            curTrack.NR = (parseInt(curTrack.NR) + 1);
                        }
                    }

                    if ($page.myVues.playlist.content.$data.TRACKS.length > $page.settings.general.tracksPerPage) {
                        $page.myVues.playlist.content.$data.TRACKS.splice(
                        	$page.settings.general.tracksPerPage,
                            $page.myVues.playlist.content.$data.TRACKS.length
                        );

                        let curPage = parseInt($page.myVues.playlist.menu.$data.CUR_PAGE);
                        let maxPages = parseInt($page.myVues.playlist.menu.$data.MAX_PAGES);
                        if (curPage === maxPages) {
                            $page.myVues.playlist.menu.$data.MAX_PAGES = maxPages;
                        }
                    }

                    $page.trackSongPlay(newTrack);
                    return;
                }

                oldTrack.LASTPLAY = chartJson.data.value.lastplayed;
                if (isTopSongPlaylist) {
                    oldTrack.PLAYCOUNT = chartJson.data.value.playcount;
                    oldTrack.PLAYCOUNT_CHANGE = (parseInt(oldTrack.NR) - parseInt(chartJson.data.value.pos));
                    if ($player.isCurrentTrack(oldTrack)) {
                        oldTrack.NR = oldTrack.NR + '';
                    }
                }
                $page.trackSongPlay(oldTrack);
            }
        ).fail(function (xhr) {
            if (typeof xhr === 'object' && xhr !== null) {
                console.error(
                    '\n\nresponse: ', xhr.responseText,
                    '\n\nstatus: ', xhr.status,
                    '\n\nerror: ', xhr.statusText
                );
            }
        });
    }

    saveVideo(needle, callback = null) {

        if (!needle.isValid(true)) {
            if (callback !== null) {
                callback(false);
            }
            return;
        }

        $.ajax('php/json/page/YouTube.php?action=save-video', {
            dataType: 'json',
            method: 'POST',
            data: {
                artist: needle.artist,
                title: needle.title,
                videoId: needle.videoId
            }
        }).done(function (json) {

            let userTracks = $playlist.getUserTracks();
            for (let cnt = 0; cnt < userTracks.length; cnt++) {
                let uTrack = userTracks[cnt];
                if (
                    uTrack.TITLE === needle.title &&
                    uTrack.ARTIST === needle.artist
                ) {
                    uTrack.VIDEO_ID = json.data.value.url;
                }
            }
            $playlist.setUserTracks(userTracks);
            if (typeof callback === 'function') {
                callback(true);
            }
        }).fail(function (xhr) {
            $.logXhr(xhr);
            if (typeof callback === 'function') {
                callback(false);
            }
        });
    }

    deleteVideo(needle, callback = null) {

        if (!needle.isValid()) return;

        $.ajax('php/json/page/YouTube.php?action=delete-video', {
            dataType: 'json',
            method: 'POST',
            data: {
                artist: needle.artist,
                title: needle.title
            }
        }).done(function (json) {
            let userTracks = $playlist.getUserTracks();
            let curTrack = null;
            for (let cnt = 0; cnt < userTracks.length; cnt++) {
                let uTrack = userTracks[cnt];
                if (
                    uTrack.TITLE === needle.title &&
                    uTrack.ARTIST === needle.artist
                ) {
                    uTrack.VIDEO_ID = '';
                }
                if ($player.isCurrentTrack(uTrack)) {
                    $player.currentTrackData.track.VIDEO_ID = '';
                    curTrack = uTrack;
                }
            }
            $playlist.setUserTracks(userTracks);
            if ($page.PLAYLIST === 'userlist') {
                if (curTrack !== null) {
                    curTrack.PLAY_CONTROL = $player.currentTrackData.track.PLAY_CONTROL;
                    curTrack.PLAYSTATE = $player.currentTrackData.track.PLAYSTATE;
                    $player.currentTrackData.track = curTrack;
                }
                $page.myVues.playlist.content.update({
                    TRACKS: userTracks
                });
            }
            if (typeof callback === 'function') {
                callback(true);
            }
        }).fail(function (xhr) {
            $.logXhr(xhr);
            if (typeof callback === 'function') {
                callback(true);
            }
        });
    }
}