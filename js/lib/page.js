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

        if (typeof json.HEADER_MENU !== 'undefined') json = json.HEADER_MENU;

        if (typeof json.YTPLAYER.TEXT !== 'undefined') this.youtube.TEXT = json.YTPLAYER.TEXT;
        if (typeof json.YTPLAYER.PAGE !== 'undefined') this.youtube.PAGE = json.YTPLAYER.PAGE;
        if (typeof json.YTPLAYER.PLAYLIST !== 'undefined') this.youtube.PLAYLIST = json.YTPLAYER.PLAYLIST;

        if (typeof json.LASTFM.TEXT !== 'undefined') this.lastfm.TEXT = json.LASTFM.TEXT;
        if (typeof json.LASTFM.PAGE !== 'undefined') this.lastfm.PAGE = json.LASTFM.PAGE;
        if (typeof json.LASTFM.PLAYLIST !== 'undefined') this.lastfm.PLAYLIST = json.LASTFM.PLAYLIST;

        if (typeof json.USERLIST.TEXT !== 'undefined') this.userlist.TEXT = json.USERLIST.TEXT;
        if (typeof json.USERLIST.PAGE !== 'undefined') this.userlist.PAGE = json.USERLIST.PAGE;
        if (typeof json.USERLIST.PLAYLIST !== 'undefined') this.userlist.PLAYLIST = json.USERLIST.PLAYLIST;

        if (typeof json.TOPSONGS.TEXT !== 'undefined') this.topsongs.TEXT = json.TOPSONGS.TEXT;
        if (typeof json.TOPSONGS.PAGE !== 'undefined') this.topsongs.PAGE = json.TOPSONGS.PAGE;
        if (typeof json.TOPSONGS.PLAYLIST !== 'undefined') this.topsongs.PLAYLIST = json.TOPSONGS.PLAYLIST;

        if (typeof json.TOPUSER.TEXT !== 'undefined') this.topuser.TEXT = json.TOPUSER.TEXT;
        if (typeof json.TOPUSER.PAGE !== 'undefined') this.topuser.PAGE = json.TOPUSER.PAGE;
        if (typeof json.TOPUSER.PLAYLIST !== 'undefined') this.topuser.PLAYLIST = json.TOPUSER.PLAYLIST;

    }

    getMenu(playlist) {
        let list = [];
        switch (playlist) {
            case 'youtube':
            case 'video':
            case 'page-video':
                list = [
                    this.lastfm,
                    this.userlist,
                    this.topsongs,
                    this.topuser
                ];
                break;
            case 'lastfm':
            case 'default':
            case 'page-playlist':
                list = [
                    this.youtube,
                    this.userlist,
                    this.topsongs,
                    this.topuser
                ];
                break;
            case 'topuser':
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


        this.PLAYLIST = null;
        this.PAGE = null;
        this.PAGE_PLAYLIST = 'page-playlist';
        this.PAGE_VIDEO = 'page-video';
        this.PAGE_USER = 'page-user';
        this.TRACKS_PER_PAGE = 25; //in settings.ini
        this.PLAY_CONTROL = null;
        this.QUICKPLAY_TRACK = null;
        this.icons = this.initIcons();
        this.menu = new Menu(this.icons);
        this.myVues = {};
        this.menuData = [];
        this.applyVueMethods();
    }

    applyVueMethods() {

        Vue.prototype.$applyData = function (json, log = false) {

            if (typeof this === 'undefined' || this == null) {
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
        Vue.prototype.$url2 = function(page, playlist, log) {
            let url = '';

            if (typeof page !== 'undefined') url = '#' + page;
            else if (typeof playlist !== 'undefined') url = '#' + playlist;
            else url = '';

            if(log) console.log('url', url, 'page', page, 'playlist', playlist);
            return url;
        };
        Vue.prototype.$url = function (menu, log = false) {
            let url = this.$url2(menu.PAGE, menu.PLAYLIST, log);
            //console.log('for menu', menu);
            return url;
        };

        Vue.prototype.$isUndefined = function (val) {
            return (typeof val === 'undefined') ? true : false;
        };

        Vue.prototype.$getMenuForPlaylist = function (playlist, json = null) {
            let menu = $page.menu.getMenu(playlist);
            return menu;
        };

        Vue.prototype.$isUndefined = function (val) {
            return (typeof val === 'undefined') ? true : false;
        };

        Vue.prototype.$loadListMenu = function (menu, event) {

            if (!$player.isReady) return;
            let page = (typeof menu.PLAYLIST !== 'undefined') ? menu.PLAYLIST : menu.PAGE;
            if (page == $player.PLAYLIST) return;

            let oldlist = $page.PLAYLIST;
            let newlist = (typeof menu.PLAYLIST !== 'undefined') ? menu.PLAYLIST : oldlist;

            let showPage = function (success) {
                // DOM updated
                $page.setCurrentPlaylist(success ? newlist : oldlist);
                $page.setPlaylistLoading(false, success ? newlist : oldlist);
            };

            try {
                $page.setPlaylistLoading(true);

                if (typeof menu.PLAYLIST !== 'undefined') {
                    let curArticle = $(event.target).closest('article');
                    let playlistArticle = $('.playlist-container');
                    
                    $(playlistArticle).attr('id', menu.PLAYLIST);
                    if(!$(playlistArticle).is(curArticle)) {
                        location.href = '#' + menu.PLAYLIST;
                    }
                } else {
                    location.href = '#' + menu.PAGE;
                }

                $playlist.loadPlaylistPage(1, null, showPage, newlist);

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

    initIcons() {
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
            icons.user
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
            if (playlist == null) return this.diamond.big;
            switch (playlist) {
                case 'topsongs':
                    return this.star;
                case 'topuser':
                    return this.trophy;
                case 'userlist':
                    return this.user;
                case 'youtube':
                    return this.youtube;
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
            }
        };
    }

    init() {

        this.initMyVues();
        history.pushState('', document.title, window.location.pathname);

        let request = 'php/json/JsonHandler.php?api=page&data=page';
        $.getJSON(request, function (json) {
            //console.log(JSON.stringify(json.data.value));

            $page.setPageLoading(true);
            $page.myVues.updateAll(json.data.value);
            $page.menu.updateData(json.data.value.playlist);
            $page.setCurrentPlaylist();
            $page.setPageLoading();

            console.log('init page success');
        }).fail(function (xhr, status, error) {
            //var err = eval("(" + xhr.responseText + ")");
            console.log(xhr.responseText);
        });
    }
    
    setCurrentPage(page = null) {
        if(page==null) return;
        this.PAGE = page;
    }

    setCurrentPlaylist(playlist = null) {

        if (playlist == this.PLAYLIST) return;
        this.PLAYLIST = playlist;

        this.myVues.youtube.header.$data.PAGE = this.PLAYLIST == null ? this.PAGE_PLAYLIST : this.PLAYLIST;
        this.myVues.playlist.header.menu.$data.PLAYLIST = this.PLAYLIST == null ? this.PAGE_PLAYLIST : this.PLAYLIST;
        this.myVues.userlist.header.menu.$data.PLAYLIST = this.PLAYLIST == null ? this.PAGE_PLAYLIST : this.PLAYLIST;
        
    }
    
    isCurrentPlaylist(playlist) {
        return (
            typeof playlist !== 'undefined' &&
            this.PLAYLIST == null && playlist == 'lastfm' || 
            this.PLAYLIST === playlist 
        );
    }

    setPageLoading(active = false) {
        this.myVues.base.logo.$data.PAGE_LOADER = active ? this.icons.loader.bigger : this.icons.diamond.bigger;
    }

    setPlaylistLoading(active = false, playlist = null) {
        if (playlist == null) playlist = this.PLAYLIST == null ? this.PAGE_PLAYLIST : this.PLAYLIST;
        let curIcon = this.icons.getPlaylistIcon(playlist);
        this.myVues.playlist.header.title.$data.LOGO = active ? curIcon.animatedBig : curIcon.big;
    }

    createNeedle(track) {
        return {
            artist: track.ARTIST,
            title: track.TITLE,
            videoId: track.VIDEO_ID,
            asVar: function (raw = false) {
                if (!raw) return encodeURIComponent(this.artist) + ' ' + encodeURIComponent(this.title);
                else return this.artist + ' ' + this.title;
            },
            isValid: function (checkVideo = false) {
                if(checkVideo) {
                    return (
                        typeof this.videoId !== 'undefined' && 
                        this.videoId !== null && 
                        this.videoId.trim().length > 0
                    );    
                }
                
                return this.asVar().trim().length > 0;
            },            
            applyData: function(json) {
                if(
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

    clone(src) {
        return Object.assign({}, src);
    }

    resetTrack(track) {
        track.PLAY_CONTROL = false;
        track.SHOWPLAY = false;
        track.NOWPLAYING = false;
        track.LOADING = false;
    }

}