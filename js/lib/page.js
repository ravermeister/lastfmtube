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

        this.defaultMenu = [
            this.youtube,
            this.lastfm,
            this.userlist,
            this.topsongs,
            this.topuser
        ];

    }

    updateData(json) {
        if ('undefined' === typeof json) return;

        if ('undefined' !== typeof json.HEADER_MENU) json = json.HEADER_MENU;

        if ('undefined' !== typeof json.YTPLAYER.TEXT) this.youtube.TEXT = json.YTPLAYER.TEXT;
        if ('undefined' !== typeof json.YTPLAYER.PAGE) this.youtube.PAGE = json.YTPLAYER.PAGE;
        if ('undefined' !== typeof json.YTPLAYER.PLAYLIST) this.youtube.PLAYLIST = json.YTPLAYER.PLAYLIST;

        if ('undefined' !== typeof json.LASTFM.TEXT) this.lastfm.TEXT = json.LASTFM.TEXT;
        if ('undefined' !== typeof json.LASTFM.PAGE) this.lastfm.PAGE = json.LASTFM.PAGE;
        if ('undefined' !== typeof json.LASTFM.PLAYLIST) this.lastfm.PLAYLIST = json.LASTFM.PLAYLIST;

        if ('undefined' !== typeof json.USERLIST.TEXT) this.userlist.TEXT = json.USERLIST.TEXT;
        if ('undefined' !== typeof json.USERLIST.PAGE) this.userlist.PAGE = json.USERLIST.PAGE;
        if ('undefined' !== typeof json.USERLIST.PLAYLIST) this.userlist.PLAYLIST = json.USERLIST.PLAYLIST;

        if ('undefined' !== typeof json.TOPSONGS.TEXT) this.topsongs.TEXT = json.TOPSONGS.TEXT;
        if ('undefined' !== typeof json.TOPSONGS.PAGE) this.topsongs.PAGE = json.TOPSONGS.PAGE;
        if ('undefined' !== typeof json.TOPSONGS.PLAYLIST) this.topsongs.PLAYLIST = json.TOPSONGS.PLAYLIST;

        if ('undefined' !== typeof json.TOPUSER.TEXT) this.topuser.TEXT = json.TOPUSER.TEXT;
        if ('undefined' !== typeof json.TOPUSER.PAGE) this.topuser.PAGE = json.TOPUSER.PAGE;
        if ('undefined' !== typeof json.TOPUSER.PLAYLIST) this.topuser.PLAYLIST = json.TOPUSER.PLAYLIST;

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
        
        PageController.TRACKS_PER_PAGE = 25; //in settings.ini
        PageController.PLAYCOUNT_UP = '▴';
        PageController.icons = PageController.initIcons();

        this.isReady = false;
        this.PLAYLIST = null;
        this.PLAY_CONTROL = null;
        this.QUICKPLAY_TRACK = null;

        this.menu = new Menu(PageController.icons);
        this.myVues = {};
        this.menuData = [];
        this.applyVueMethods();
        this.applyJQueryMethods();
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

            for (let key in this.$data) {
                if (log) console.log((key, ' exists ', json.hasOwnProperty(key)));
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
            //console.log('for menu', menu);
            return url;
        };

        Vue.prototype.$getMenuForPlaylist = function (playlist, json = null) {
            let menu = $page.menu.getMenu(playlist);
            return menu;
        };

        Vue.prototype.$loadListMenu = function (menu, event) {
            let curArticle = $(event.target).closest('article');
            let playlistArticle = $('article[name=playlist-container]');
            let forceReload = !$(playlistArticle).is(curArticle);

            if (!$player.isReady || !forceReload &&
                typeof menu.PLAYLIST !== 'undefined' &&
                menu.PLAYLIST === $page.PLAYLIST
            )
                return;

            let showPage = function (success) {
                // DOM updated                
                if (typeof menu.PLAYLIST !== 'undefined') {
                    if (success) {
                        $page.setCurrentPlaylist(menu.PLAYLIST);
                        $(playlistArticle).attr('id', menu.PLAYLIST);
                    }
                    $page.setLoading(curArticle);
                    if (forceReload) {
                        location.href = '#' + menu.PLAYLIST;
                    }
                } else {
                    $page.setLoading(curArticle);
                    location.href = '#' + menu.PAGE;
                }
            };

            try {
                $page.setLoading(curArticle, true);

                if (typeof menu.PLAYLIST !== 'undefined') {
                    let pageNum = 1;
                    if (
                        'undefined' !== typeof $player.currentTrackData.track &&
                        $player.currentTrackData.track !== null &&
                        $player.currentTrackData.track.PLAYLIST === menu.PLAYLIST
                    ) {
                        let curNr = $player.currentTrackData.track.NR;
                        let curPage = (curNr / PageController.TRACKS_PER_PAGE) | 0;
                        if ((curNr % PageController.TRACKS_PER_PAGE) > 0) curPage++;
                        if (!isNaN(curPage)) pageNum = curPage;
                    }

                    $playlist.loadPlaylistPage(pageNum, null, showPage, menu.PLAYLIST);
                } else {
                    showPage(true);
                }

                // usage as a promise (2.1.0+, see note below)
                /**
                 Vue.nextTick()
                 .then(function () {
                                    // DOM updated
                                    
                                });
                 **/
            } catch (e) {
                console.error(e);
                //showPage(false);
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
                    return this.search;
                default:
                    return this.headphones;
            }

        };

        return icons;
    }

    initMyVues() {
        this.myVues = {
            base: new LibvueMainpage(),
            playlist: new LibvuePlaylist(),
            youtube: new LibvueVideo(),
            userlist: new LibvueUser(),

            updateAll: function (json) {
                this.base.update(json.base);
                this.playlist.update(json.playlist);
                this.youtube.update(json.youtube);
                this.userlist.update(json.userlist);
                this.youtube.header.update({
                    LOGO: PageController.icons.getPlaylistIcon(this.playlist.menu.$data.PLAYLIST).big,
                    TEXT: this.playlist.header.title.TEXT
                });
            }
        };
    }

    init() {

        this.initMyVues();
        location.hash = '';

        let request = 'php/json/JsonHandler.php?api=page&data=page';
        $.getJSON(request, function (json) {
            //console.log(JSON.stringify(json.data.value));

            $page.setMainPageLoading(true);
            $page.myVues.updateAll(json.data.value);
            $page.menu.updateData(json.data.value.playlist);

            $page.setMainPageLoading();

            $page.isReady = true;
            if ($player.autoPlay && $player.isReady &&
                !$player.isPlaying() && !$player.isPaused()) {
                $player.loadNextSong();
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
        
        if (playlist === this.PLAYLIST) return;

        this.PLAYLIST = playlist;

        
        $page.myVues.playlist.menu.$data.PLAYLIST = this.PLAYLIST;
        $page.myVues.playlist.header.menu.$data.PLAYLIST = this.PLAYLIST;
        $page.myVues.playlist.header.title.$data.PLAYLIST = this.PLAYLIST;
        $page.myVues.youtube.header.$data.PLAYLIST = this.PLAYLIST;
    }

    isCurrentPlaylist(playlist) {
        return (
            typeof playlist !== 'undefined' &&
            this.PLAYLIST === null && playlist === 'lastfm' ||
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


                if (!raw) return encodeURIComponent(this.artist) + ' ' + encodeURIComponent(this.title);
                else return this.artist + ' ' + this.title;
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
                    typeof json.data.value !== 'undefined' &&
                    json.data.value.length > 0 &&
                    typeof json.data.value[0].video_id !== 'undefined' &&
                    json.data.value[0].video_id.trim().length > 0
                ) {
                    this.videoId = json.data.value[0].video_id;
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

    saveChartUser(lfmuser = null) {
        if (typeof lfmuser === 'undefined' || lfmuser === null) return;

        $.ajax('php/json/JsonHandler.php?api=vars&action=saveuserchart', {
            dataType: 'json',
            method: 'POST',
            data: {
                LASTFM_USER: lfmuser
            }
        }).done(function (json) {
            for (let cnt in $page.myVues.userlist.content.$data.USER) {
                let user = $page.myVues.userlist.content.$data.USER[cnt];

                if (user.NAME === json.data.value.username) {
                    user.PLAYCOUNT = json.data.value.playcount;
                    user.LASTPLAY = json.data.value.lastplay;

                    let diff = parseInt(user.NR) - parseInt(json.data.value.nr);
                    user.PLAYCOUNT_CHANGE = diff > 0 ?
                        diff + PageController.PLAYCOUNT_UP : PageController.PLAYCOUNT_UP;
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

        $.ajax('php/json/JsonHandler.php?api=vars&action=savetrackchart', {
            dataType: 'json',
            method: 'POST',
            data: {
                artist: needle.artist,
                title: needle.title
            }
        }).done(function (json) {

            for (let cnt = 0; cnt < $page.myVues.playlist.content.$data.TRACKS.length; cnt++) {
                let track = $page.myVues.playlist.content.$data.TRACKS[cnt];
                if (
                    track.ARTIST === json.data.value.artist &&
                    track.TITLE === json.data.value.title
                ) {
                    track.LASTPLAY = json.data.value.lastplay;
                    if ($page.myVues.playlist.menu.$data.PLAYLIST === 'topsongs') {
                        track.PLAYCOUNT = json.data.value.playcount;

                        let diff = parseInt(track.NR) - parseInt(json.data.value.nr);
                        track.PLAYCOUNT_CHANGE = diff > 0 ?
                            diff + PageController.PLAYCOUNT_UP : PageController.PLAYCOUNT_UP;
                    }
                }
            }

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

    saveVideo(needle, callback = null) {

        if (!needle.isValid(true)) {
            if (callback !== null) {
                callback(false);
            }
            return;
        }

        $.ajax('php/json/JsonHandler.php?api=vars&action=savealternative', {
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
                    uTrack.VIDEO_ID = json.data.value.videoId;
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

        $.ajax('php/json/JsonHandler.php?api=vars&action=deletealternative', {
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
                if(curTrack!==null) {
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