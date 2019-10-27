class Icon {
    constructor(name) {

        this.name = name;
        this.big = this.name + ' fa-2x';
        this.bigger = this.name + ' fa-3x';

        this.animated = this.name + ' faa-flash animated';
        this.animatedBig = this.animated + ' fa-2x';
        this.animatedBigger = this.animated + ' fa-3x';

    }

    isIcon(elem, big = false) {
        return $(elem).hasClass(big ? this.big : this.name);
    }
}

class Menu {

    constructor(icons) {

        this.youtube = {
            LOGO: icons.youtube.big,
            TEXT: 'YouTube',
            PAGE: 'video'
        };

        this.search = {
            LOGO: icons.search.big,
            TEXT: 'Search',
            PAGE: 'playlist',
            LDATA: 'search'
        };

        this.lastfm = {
            LOGO: icons.headphones.big,
            TEXT: 'Last.fm',
            PAGE: 'playlist'
        };

        this.userlist = {
            LOGO: icons.user.big,
            TEXT: 'My Songs',
            PAGE: 'playlist'
        };

        this.topsongs = {
            LOGO: icons.star.big,
            TEXT: 'Top Songs',
            PAGE: 'playlist'
        };

        this.topuser = {
            LOGO: icons.trophy.big,
            TEXT: 'Top User',
            PAGE: 'playlist'
        };
        
        this.live

        this.defaultMenu = [
            this.youtube,
            this.lastfm,
            this.userlist,
            this.topsongs,
            this.topuser
        ];

    }

    updateData(json) {
        if ('undefined' !== typeof json.listmenu) json = json.listmenu;

        if ('undefined' !== typeof json.YTPLAYER.TEXT) this.youtube.TEXT = json.YTPLAYER.TEXT;
        if ('undefined' !== typeof json.YTPLAYER.PAGE) this.youtube.PAGE = json.YTPLAYER.PAGE;
        if ('undefined' !== typeof json.YTPLAYER.LDATA) this.youtube.LDATA = json.YTPLAYER.LDATA;

        if ('undefined' !== typeof json.LASTFM.TEXT) this.lastfm.TEXT = json.LASTFM.TEXT;
        if ('undefined' !== typeof json.LASTFM.PAGE) this.lastfm.PAGE = json.LASTFM.PAGE;
        if ('undefined' !== typeof json.LASTFM.LDATA) this.lastfm.LDATA = json.LASTFM.LDATA;

        if ('undefined' !== typeof json.USERLIST.TEXT) this.userlist.TEXT = json.USERLIST.TEXT;
        if ('undefined' !== typeof json.USERLIST.PAGE) this.userlist.PAGE = json.USERLIST.PAGE;
        if ('undefined' !== typeof json.USERLIST.LDATA) this.userlist.LDATA = json.USERLIST.LDATA;

        if ('undefined' !== typeof json.TOPSONGS.TEXT) this.topsongs.TEXT = json.TOPSONGS.TEXT;
        if ('undefined' !== typeof json.TOPSONGS.PAGE) this.topsongs.PAGE = json.TOPSONGS.PAGE;
        if ('undefined' !== typeof json.TOPSONGS.LDATA) this.topsongs.LDATA = json.TOPSONGS.LDATA;

        if ('undefined' !== typeof json.TOPUSER.TEXT) this.topuser.TEXT = json.TOPUSER.TEXT;
        if ('undefined' !== typeof json.TOPUSER.PAGE) this.topuser.PAGE = json.TOPUSER.PAGE;
        if ('undefined' !== typeof json.TOPUSER.LDATA) this.topuser.LDATA = json.TOPUSER.LDATA;

    }

    getMenuItem(playlist) {
        switch (playlist) {
            case 'youtube':
            case 'video':
            case 'video-container':
                return this.youtube;
            case 'topuser':
                return this.topuser;
            case 'topsongs':
                return this.topsongs;
            case 'userlist':
                return this.userlist;
            case 'search':
            	if($page.SEARCH_RETURN_PLAYLIST !== null) {
            		return this.getMenuItem($page.SEARCH_RETURN_PLAYLIST);
            	}
                return this.search;
            default:
            case 'lastfm':
            case 'default':
            case 'playlist-container':
                return this.lastfm;
        }
    }

    getMenu(playlist) {

        let list = [];
        switch (playlist) {
            case 'youtube':
            case 'video':
            case 'video-container':
                list = [
                    this.lastfm,
                    this.userlist,
                    this.topsongs,
                    this.topuser
                ];
                break;
            case 'lastfm':
            case 'default':
            case 'playlist-container':
                list = [
                    this.youtube,
                    this.userlist,
                    this.topsongs,
                    this.topuser
                ];
                break;
            case 'topuser':
            case 'search':
                list = [
                    this.youtube,
                    this.lastfm,
                    this.topsongs,
                    this.userlist
                ];
                break;
            case 'topsongs':
                list = [
                    this.youtube,
                    this.lastfm,
                    this.userlist,
                    this.topuser
                ];
                break;
            case 'userlist':
                list = [
                    this.youtube,
                    this.lastfm,
                    this.topsongs,
                    this.topuser
                ];
                break;
            default:
                list = [];
                break;
        }

        return list;
    }
}


class PageController {

    constructor() {

        PageController.article = {

            user: {
                dom: function () {
                    // language=JQuery-CSS
                    return $('article[name=user-container]');
                },

                name: 'user-container'
            },

            playlist: {
                dom: function () {
                    // language=JQuery-CSS
                    return $('article[name=playlist-container]');
                },

                name: 'playlist-container'
            },

            video: {
                dom: function () {
                    // language=JQuery-CSS
                    return $('article[name=video-container]');
                },

                name: 'video-container'
            }
        };

        PageController.TRACKS_PER_PAGE = 25; // in settings.ini
        PageController.icons = PageController.initIcons();
        PageController.analytics = null;

        this.settings = {};
        this.isReady = false;
        this.PLAYLIST = null;
        this.SEARCH_RETURN_PLAYLIST = null;
        this.PLAY_CONTROL = null;
        this.QUICKPLAY_TRACK = null;
        
        this.menu = new Menu(PageController.icons);
        this.myVues = {};
        this.menuData = [];
        this.applyVueMethods();
        this.applyJQueryMethods();
    }

    load(page = '', ldata = null, callBack = null) {
    	let pageLoaded = function (success) {
    		$page.setMainPageLoading();
    		location.href = '#' + (ldata === null ? page : ldata);
    		if(typeof callBack === 'function') {
    			callBack(success);
    		}
    	};

        let article = $('article[name=' + page + ']');
        if( page === 'search') {
        	article = $('article[name=playlist-container]');
        	ldata = 'search';
        }
        $page.setMainPageLoading(true);
        $(article).attr('id', ldata);
        
        if (!$page.isCurrentPlaylist(ldata)) {
            let lfmuser = $page.myVues.playlist.menu.$data.LASTFM_USER_NAME;
            if (typeof lfmuser === 'undefined' || lfmuser === null) {
                try {
                    lfmuser = $(article).find('#playlist_lastfmuser').val();
                } catch (e) {
                }
            }
            $page.loadList(1, lfmuser, pageLoaded, ldata);
            return;
        }

        pageLoaded(true);
    }

	changeUrl(title, url) {
	    if (typeof (history.pushState) != "undefined") {
	        var obj = { Title: title, Url: url };
	        history.pushState(obj, obj.Title, obj.Url);
	    } else {
	        alert("Browser does not support HTML5.");
	    }
	}
	
	loadPage(page, callBack = null) {
		
		switch(page) {
			case 'topsongs':
				$page.load('playlist-container' ,'topsongs', function(){	
					$page.changeUrl('Top Songs', '/#topsongs');	
					if('function' === typeof callBack) {
						callBack();
					}
				});
			break;
			case 'users':
				$page.load('user-container', 'topuser', function(){					
					$page.changeUrl('Top User', '/#topuser');
					if('function' === typeof callBack) {
						callBack();
					}
				});
			break;
			case 'personal':
				$page.load('user-container', 'userlist', function(){					
					$page.changeUrl('Userlist', '/#userlist');
					if('function' === typeof callBack) {
						callBack();
					}
				});
			break;
			case 'lastfm':
				$page.load('playlist-container', 'lastfm', function(){					
					$page.changeUrl('Last.fm', '/#lastfm');
					if('function' === typeof callBack) {
						callBack();
					}
				});	
			break;
			case 'video':
				$page.load('video-container', 'video', function(){					
					$page.changeUrl('Video', '/#video');
					if('function' === typeof callBack) {
						callBack();
					}
				});
			break;
		}
		
		
		
	}
    
    initURL() {
		switch (location.pathname) {
			case '/topsongs':
				$page.loadPage('topsongs', function(){					
					if($player.autoPlay) {
						$player.loadNextSong();
					}
				});
			break;
						
			case '/users':
				$page.loadPage('users');
			break;
			
			case '/personal':
				$page.loadPage('personal', function(){
					if($player.autoPlay) {
						$player.loadNextSong();
					}					
				});
			break;
			
			case '/lastfm':
				$page.loadPage('lastfm', function(){
					if($player.autoPlay) {
						$player.loadNextSong();
					}
				});
			break;
			
			case '/video':
			default:
				$page.loadPage('video', function(){
					if($player.autoPlay) {
						$player.loadNextSong();
					}
				});
			break;
		}
    }
    
    trackPlaylist(playlist) {
        if (!PageController.isFunction(PageController.analytics)) return;
        PageController.analytics('send', {
            'hitType': 'event',
            'eventCategory': playlist,
            'eventAction': 'view',
            'eventLabel': 'Playlist'
        });
    }

    trackSongPlay(track) {
    	if (!PageController.isFunction(PageController.analytics)) return;
    	PageController.analytics('send', {
            'hitType': 'event',
            'eventCategory': (track.artist + ' ' + track.title),
            'eventAction': 'play',
            'eventLabel': 'Track played'
        });
    }
    loadList(pageNum = 1, user = null, callBack = null, playlist = null) {
        if (playlist === null) playlist = $page.PLAYLIST;
        if (playlist === null) playlist = 'lastfm';

        let isPlaylist = false;        
        let curArticle = PageController.article.playlist.dom;
        let loadComplete = function (success) {
            let parentCallBack = callBack;
            curArticle = PageController.article.playlist.dom;
            $page.setCurrentPlaylist(playlist);
            $page.trackPlaylist($page.PLAYLIST);
            $page.setLoading(curArticle); 
            location.href = '#' + playlist;

            if (typeof parentCallBack === 'function') {
                parentCallBack(success);
            }
        };

        $page.setLoading(curArticle, true);
        switch (playlist) {
            case 'userlist':
                $playlist.loadCustomerList(pageNum, loadComplete);
                isPlaylist = true;
                break;
            case 'topsongs':
                $playlist.loadTopSongs(pageNum, null, loadComplete);
                isPlaylist = true;
                break;
            case 'topuser':
                $playlist.loadTopUser(pageNum, loadComplete);
                break;
            case 'video':
                if (typeof callBack === 'function') {
                    callBack(true);
                } else {
                    $page.setLoading(curArticle);
                }
                break;
            case 'lastfm':
                $playlist.loadLastFmList(pageNum, user, loadComplete);
                isPlaylist = true;
                break;
            default:
                break;
        }
    }

    applyJQueryMethods() {
        $.urlParam = function (name, url = null) {
            let theUrl = url !== null ? url : window.location.href;
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(theUrl);
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

    applyVueMethods() {

        Vue.prototype.$applyData = function (json, log = false) {

            if (typeof this === 'undefined' || this === null) {
                console.error('Error, vue instance not found. Json: ', json, ', Vue: ', this);
                return;
            }

            if (log) {
                console.log('updateData', 'vue: ', this.$data, ' json: ', json);
            }
            if ('undefined' === typeof json) return;

            for (let key in this.$data) {
                if (log) console.log(key, ' exists ', (json.hasOwnProperty(key)));
                if (json.hasOwnProperty(key)) {
                    if (log) console.log('old: ' + this.$data[key] + ' | new ' + json[key]);
                    this.$data[key] = json[key];
                }
            }

            if (log) console.log('after update: ', this.$data);
        };
        Vue.prototype.$url2 = function (page, playlist, log) {
            let url = '';

            if (typeof page !== 'undefined') url = '#' + page;
            else if (typeof playlist !== 'undefined') url = '#' + playlist;
            else url = '';

            if (log) console.log('url', url, 'page', page, 'playlist', playlist);
            return url;
        };
        Vue.prototype.$url = function (menu, log = false) {
            let url = this.$url2(menu.PAGE, menu.PLAYLIST, log);
            // console.log('for menu', menu);
            return url;
        };

        Vue.prototype.$getMenuForPlaylist = function (playlist, json = null) {
            let menu = $page.menu.getMenu(playlist);
            return menu;
        };

        Vue.prototype.$loadListMenu = function (menu, event) {
            let curArticle = $(event.target).closest('article');
            let playlistArticle = $('article[name=' + menu.PAGE + ']');
            let forceReload = !$(playlistArticle).is(curArticle);
                        
            if (!$player.isReady || !forceReload &&
                typeof menu.LDATA !== 'undefined' &&
                menu.LDATA === $page.PLAYLIST
            ) {
                return;
            }
            let showPage = function (success) {
                // DOM updated
                if (typeof menu.LDATA !== 'undefined') {
                    $page.setLoading(curArticle);
                    if (success) {

                        if (menu.PAGE === 'playlist-container') {
                            $page.setCurrentPlaylist(menu.LDATA);
                        }
                        $(playlistArticle).attr('id', menu.LDATA);
                    }

                    if (forceReload) {
                        location.href = '#' + menu.LDATA;
                    }
                } else {
                    $page.setLoading(curArticle);
                    location.href = '#' + menu.PAGE;
                }
            };

            try {
                $page.setLoading(curArticle, true);

                if (typeof menu.LDATA !== 'undefined') {
                    let pageNum = 1;
                    if (
                        'undefined' !== typeof $player.currentTrackData.track &&
                        $player.currentTrackData.track !== null &&
                        $player.currentTrackData.track.PLAYLIST === menu.LDATA
                    ) {
                        let curNr = $player.currentTrackData.track.NR;
                        if (
                            'undefined' !== typeof $player.currentTrackData.track.PLAYCOUNT_CHANGE &&
                            parseInt($player.currentTrackData.track.PLAYCOUNT_CHANGE) > 0
                        ) {
                            curNr = parseInt(curNr) - parseInt($player.currentTrackData.track.PLAYCOUNT_CHANGE);
                        }

                        let curPage = (curNr / PageController.TRACKS_PER_PAGE) | 0;
                        if ((curNr % PageController.TRACKS_PER_PAGE) > 0) curPage++;
                        if (!isNaN(curPage)) pageNum = curPage;
                    }

                    $page.loadList(pageNum, null, showPage, menu.LDATA);
                } else {
                    showPage(true);
                }

                // usage as a promise (2.1.0+, see note below)
                /**
				 * Vue.nextTick() .then(function () { // DOM updated
				 * 
				 * });
				 */
            } catch (e) {
                console.error(e);
                // showPage(false);
            }
        };


    }

    initMyVues() {
        this.myVues = {
            base: new LibvueMainpage(),
            playlist: new LibvuePlaylist(),
            youtube: new LibvueVideo(),
            userlist: new LibvueUser(),

            updateAll: function (json) {
                this.base.update(json);
                this.playlist.update(json);
                this.youtube.update(json);
                this.userlist.update(json);
            }
        };
    }
    
    initShareButtons() {
		var a2a_config = a2a_config || {};

		a2a_config.linkname = "Last.fm YouTube Radio";
		a2a_config.linkurl = "https://lastfm.rimkus.it";
		a2a_config.locale = "en";
    }
    
    initHotKeys() {
    	    	
    	hotkeys('left', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault();     		
    		$player.rewind();    		
    	});
    	
    	hotkeys('ctrl+left', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.loadPreviousSong();    		
    	});
    	
    	hotkeys('right', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.fastForward();    		
    	});
    	
    	hotkeys('ctrl+right', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.loadNextSong();    		
    	});
    	
    	hotkeys('enter', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.togglePlay();    		
    	});
    	
    	hotkeys('space', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.togglePlay();    		
    	});

    	hotkeys('ctrl+1', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('video')
    	});
    	
    	hotkeys('ctrl+2', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('lastfm');
    	});
    	
    	hotkeys('ctrl+8', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('personal');    		
    	});
    	
    	hotkeys('ctrl+4', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('topsongs');    		
    	});
    	
    	hotkeys('ctrl+5', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$page.loadPage('users');    		
    	});
    	
    	/**
		 * TODO: add hotkeys for search
		 */
    	
    }

    initSettings() {
    	
		$.ajax({
			url: 'php/json/page/Page.php?action=config',
			dataType: 'json',
			async: false,
			success: function(json) {
				if(json && json.data && json.data.value) {
					let conf = json.data.value;				
					$player.settings = conf;         
				}
			},
			error: function(xhr) {
	            $.logXhr(xhr);
			}
		});
    	
// $.getJSON('php/json/page/Page.php?action=config', function (json) {
// if(json && json.data && json.data.value) {
// let conf = json.data.value;
// $player.settings = conf;
// }
// }).fail(function (xhr) {
// $.logXhr(xhr);
// });
    }
    
    init(initReadyCallBack) {
    	$page.initSettings();
    	$page.initShareButtons();
    	$page.initHotKeys();
    	$page.initMyVues();
        $page.setMainPageLoading(true);
        location.hash = '';
        
        let request = 'php/json/page/Page.php?action=init';
        $.getJSON(request, function (json) {
            if ('undefined' === typeof json || 'undefined' === typeof json.data) return;

            $page.myVues.updateAll(json.data.value);
            $page.menu.updateData(json.data.value);

            
            $page.setMainPageLoading();           
            $page.isReady = true;
            if(typeof initReadyCallBack === 'function') {
            	initReadyCallBack();
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

    setLoading(curArticle, active = false) {

        if ($(curArticle).is(PageController.article.user.dom())) {
            this.myVues.userlist.header.title.$data.LOADING = active;
        } else if ($(curArticle).is(PageController.article.playlist.dom())) {
            this.myVues.playlist.header.title.$data.LOADING = active;
        } else if ($(curArticle).is(PageController.article.video.dom())) {
            this.myVues.youtube.header.$data.LOADING = active;
        }
    }

    setMainPageLoading(active = false) {
        this.myVues.base.logo.$data.PAGE_LOADER = active ?
            PageController.icons.loader.bigger : PageController.icons.diamond.bigger;
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


    static initIcons() {
        let icons = {};
        icons.play = new Icon('fa-play');
        icons.pause = new Icon('fa-pause');
        icons.stop = new Icon('fa-stop');
        icons.youtube = new Icon('fa fa-youtube');
        icons.search = new Icon('fa fa-search');
        icons.plus = new Icon('fa-plus');
        icons.minus = new Icon('fa-minus');
        icons.diamond = new Icon('fa fa-diamond');
        icons.headphones = new Icon('fas fa-headphones');
        icons.check = new Icon('fas fa-check');
        icons.loader = new Icon('fa fa-spinner faa-spin animated');
        icons.star = new Icon('fas fa-star');
        icons.trophy = new Icon('fas fa-trophy');
        icons.user = new Icon('fas fa-user');
        icons.trash = new Icon('fas fa-trash-alt');
        icons.save = new Icon('fas fa-save');


        icons.list = [
            icons.play,
            icons.pause,
            icons.stop,
            icons.youtube,
            icons.search,
            icons.plus,
            icons.minus,
            icons.diamond,
            icons.headphones,
            icons.check,
            icons.loader,
            icons.star,
            icons.trophy,
            icons.user,
            icons.trash,
            icons.save
        ];

        icons.getIcon = function (elem, big) {
            for (let cnt = 0; cnt < this.list.length; cnt++) {
                if (this.list[cnt].isIcon(elem, big)) {
                    return this.list[cnt];
                }
            }
            return null;
        };
        icons.getPlaylistIcon = function (playlist = null) {
            if (playlist === null) return this.diamond.big;
            switch (playlist) {
                case 'topsongs':
                    return this.star;
                case 'topuser':
                case 'user-container':
                    return this.trophy;
                case 'userlist':
                    return this.user;
                case 'youtube':
                    return this.youtube;
                case 'search':
                	if($page.SEARCH_RETURN_PLAYLIST !== null) {
                		return this.getPlaylistIcon($page.SEARCH_RETURN_PLAYLIST);
                	}
                    return this.search;
                default:
                    return this.headphones;
            }

        };

        return icons;
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

    static isFunction(functionToCheck) {
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

                    if ($page.myVues.playlist.content.$data.TRACKS.length > PageController.TRACKS_PER_PAGE) {
                        $page.myVues.playlist.content.$data.TRACKS.splice(
                            PageController.TRACKS_PER_PAGE,
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