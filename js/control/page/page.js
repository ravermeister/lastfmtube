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

        this.icons = new Icons(this);
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
        
        $.getJSON('php/json/page/Page.php?action=init', function (json) {
            if ('undefined' === typeof json || 'undefined' === typeof json.data) return;

            $page.menu.updateData(json.data.value);
            $page.myVues.updateAll(json.data.value);

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

    createNeedle(origTrack = null, artist = '', title = '', videoId = '') {
        return {
            artist: 	artist !== null && artist.length > 0 ? artist : 
            			origTrack !== null ? origTrack.ARTIST : null,
            					
            title: 		title !== null && title.length > 0 ? title :
            			origTrack !== null ? origTrack.TITLE : null,
            					
            videoId:	videoId !== null && videoId.length > 0 ? videoId :
            			origTrack !== null ? origTrack.VIDEO_ID : null,
            		
            playlist: origTrack === null ? null : origTrack.PLAYLIST,
            sortby: origTrack === null ? null : origTrack.SORTBY, 
            track: origTrack,
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
        	let users = $page.myVues.userlist.topuser.content.$data.USER;
        	if(!Array.isArray(users)) return;
        	
            for (let cnt=0; cnt<users.length; cnt++) {
                let user = $page.myVues.userlist.topuser.content.$data.USER[cnt];

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
    	
        $.ajax('php/json/page/Page.php?&action=save-trackplay', {
            dataType: 'json',
            method: 'POST',
            data: {
                artist: needle.artist,
                title: needle.title,
                sortby: needle.sortby,
                playlist: needle.playlist
            }
        }).done(function (json) {

        	$playlist.updateSongPlayCount($page.myVues.playlist.lastfm, json, true);
        	$playlist.updateSongPlayCount($page.myVues.playlist.topsongs, json);
        	$playlist.updateSongPlayCount($page.myVues.playlist.user, json); 
             	
        }).fail(function (xhr) {
            if (typeof xhr === 'object' && xhr !== null) {
                console.error(
                    '\n\nresponse: ', xhr.responseText,
                    '\n\nstatus: ', xhr.status,
                    '\n\nerror: ', xhr.statusText
                );
            }
        });
    }
}
