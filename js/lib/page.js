class Icon {
    constructor(name) {
        this.name = name;
        this.big = this.name + ' fa-2x';
        this.bigger = this.name + ' fa-3x';
    }

    isIcon(elem, big = false) {
        return $(elem).hasClass(big ? this.big : this.name);
    }
}


class PageController {


    constructor(Vue, Storages) {

        this.storage = Storages.localStorage;
        this.PLAYLIST = null;
        this.TRACKS_PER_PAGE = 25; //in settings.ini
        this.PLAY_CONTROL = null;
        this.QUICKPLAY_TRACK = null;
        this.pageLoader = this.pageLoader = $('#page-loader');
        this.icons = this.initIcons();
        this.vue = this.initVue(Vue);
    }

    initVue(Vue) {
        

        return {
            base: new VueBase(Vue),
            playlist: new VuePlaylist(Vue),
            youtube: new VueYoutube(Vue),

            updateAll: function (Vue) {
                this.base.update(Vue);
                this.playlist.update(Vue);
                this.youtube.update(Vue);
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
            if (playlist == null) return this.headphones.big;
            switch (playlist) {

                case 'topsongs':
                    return this.star.big;
                case 'topuser':
                    return this.trophy.big;
                case 'userlist':
                    return this.user.big;
                case 'ytplayer':
                    return this.youtube.big;
                case 'default':
                    return this.headphones.big;
            }

        };

        return icons;
    }

    init() {

        let request = 'php/json/JsonHandler.php?api=page&data=page';
        let page = this;

        $.getJSON(request, function (json) {
            //console.log(JSON.stringify(json.data.value));
            page.vue.updateAll(json.data.value);

            page.pageLoader = page.vue.base.logo.$refs.pageLoader;
            page.setCurrentPlayList();
            page.setPageLoading();

            console.log('init page success');
        }).fail(function (xhr, status, error) {
            //var err = eval("(" + xhr.responseText + ")");
            console.log(xhr.responseText);
        });
    }

    setCurrentPlayList(playlist) {
        let name = 'Last.fm Playlist';
        if (playlist == null) playlist = 'default';

        switch (playlist) {
            case 'userlist':
                name = 'My Playlist';
                break;
            case 'topsongs':
                name = 'Top Songs';
                break;
        }

        this.vue.youtube.header.$data.PLAYLIST_NAME = name;


        page.PLAYLIST = playlist;
    }

    setPageLoading(active = false) {
        $(this.pageLoader)
            .removeClass(active ? this.icons.diamond.bigger : this.icons.loader.bigger)
            .addClass(active ? this.icons.loader.bigger : this.icons.diamond.bigger);
    }

    initDefaultVue(json) {
        return new this.vue({
            el: json.el,
            data: json.data
        });
    }

    initPlayListHeader(json) {

        return new this.vue({
            el: json.el,
            data: json.data,

            methods: {

                getLogo: function () {
                    if (page.PLAYLIST == null) return page.icons.headphones.big;
                    switch (page.PLAYLIST) {
                        case 'topsongs':

                            break;
                    }
                },


                loadPlayList: function (list) {
                    let oldList = 'default';
                    if (page.PLAYLIST != null) oldList = page.PLAYLIST;

                    let iconClasses = '';
                    let iconElem = $('#page-playlist>.playlist-header-container>h2>.playlist-header-ico');
                    let setLoading = function (isLoading) {
                        switch (oldList) {
                            case 'userlist' :
                                //iconElem.removeClass('').addClass();
                                //iconClasses = '';
                                break;
                            case 'topuser':
                                break;
                            case 'topsongs':
                                break;
                            case 'search':
                                break;
                            default:
                                break;
                        }
                    };

                    setLoading(true);
                    page.loadPlaylistPage(1, null, null, list, function () {
                        setLoading(false);
                    });
                }
            }
        });
    }

    createNeedle(track) {
        let needle = new Object();
        needle.artist = track.ARTIST;
        needle.title = track.TITLE;
        needle.videoId = track.videoId;
        needle.asVar = function (raw = false) {
            if (!raw) return encodeURIComponent(this.artist) + ' ' + encodeURIComponent(this.title);
            else return this.artist + ' ' + this.title;
        };

        return needle;
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

    getUserTracks() {
        let storage = this.storage;
        if (!storage.isSet('userlist.tracks')) storage.set('userlist.tracks', new Array());
        return storage.get('userlist.tracks');
    }

    setUserTracks(tracks) {
        let storage = this.storage;
        storage.set('userlist.tracks', tracks);
    }

    updateUserListPages(pageNum = null) {
        let tracksPerPage = this.TRACKS_PER_PAGE;
        let tracks = this.getUserTracks();
        let pageCount = parseInt(tracks.length / tracksPerPage);
        if ((tracks.length % tracksPerPage) > 0) pageCount++;

        let vueMap = this.vueMap;
        vueMap['PLAYLIST_HEADER'].$data.TEXT = 'My Playlist';
        vueMap['PLAYLIST_HEADER'].$data.URL = '';

        if (pageNum != null) {
            if (pageNum > pageCount) pageNum = pageCount;
            else if (pageNum < 1) pageNum = 1;
            vueMap['PLAYLIST_NAV'].$data.CUR_PAGE = pageNum;
        } else pageNum = parseInt(vueMap['PLAYLIST_NAV'].$data.CUR_PAGE);

        vueMap['PLAYLIST_NAV'].$data.MAX_PAGES = pageCount;
        vueMap['PLAYLIST_NAV'].$data.LASTFM_USER_NAME = '';
        vueMap['PLAYLIST_NAV'].$data.PLAYLIST = 'userlist';

        return pageNum;
    }


    loadPlaylistPage(pageNum = 1, user = null, callBack = null, playlist = null) {
        if (playlist == null) playlist = this.PLAYLIST;

        this.setCurrentPlayList(playlist);
        switch (playlist) {
            case 'userlist':
                this.loadUserPlayListPage(pageNum, callBack);
                break;
            case 'topsongs':
                this.loadTopSongsPlayListPage(pageNum, callBack);
                break;
            default:
                this.loadDefaultPlayListPage(pageNum, user, callBack);
                break;
        }
    }

    loadSearchResult(track, result, pageNum = 1, callBack = null) {
        let vueMap = this.vueMap;

        vueMap['PLAYLIST_HEADER'].$data.TEXT = 'Search Results';  //<br />' + track.ARTIST + '<br />' + track.TITLE;
        vueMap['PLAYLIST_HEADER'].$data.URL = '#page-playlist';
        vueMap['PLAYLIST_HEADER'].$data.URL_TARGET = '_self';
        vueMap['PLAYLIST_NAV'].$data.CUR_PAGE = pageNum;
        vueMap['PLAYLIST_NAV'].$data.MAX_PAGES = 1;
        vueMap['PLAYLIST_NAV'].$data.LASTFM_USER_NAME = track.VIDEO_ID;
        vueMap['PLAYLIST_NAV'].$data.PLAYLIST = 'search';

        vueMap['PLAYLIST_TRACKS'].$data.SEARCH_TRACK = track;
        vueMap['PLAYLIST_TRACKS'].$data.TRACKS = result;

        if (callBack != null) {
            callBack(true);
        }
    }

    loadTopSongsPlayListPage(pageNum = 1, callBack = null) {
        let vueMap = this.vueMap;
        let request = 'php/json/JsonHandler.php?api=page&data=playlist' +
            '&type=topsongs' +
            '&page=' + pageNum
        ;

        $.getJSON(request, function (json) {
            vueMap['PLAYLIST_HEADER'].$data.TEXT = 'Top Songs';
            vueMap['PLAYLIST_HEADER'].$data.URL = '';

            vueMap['PLAYLIST_NAV'].$data.CUR_PAGE = json.data.value['PLAYLIST_NAV'].data.CUR_PAGE;
            vueMap['PLAYLIST_NAV'].$data.MAX_PAGES = json.data.value['PLAYLIST_NAV'].data.MAX_PAGES;
            vueMap['PLAYLIST_NAV'].$data.PLAYLIST = 'topsongs';


            let tracks = json.data.value['PLAYLIST_TRACKS'].data.TRACKS;
            let tracksPerPage = this.TRACKS_PER_PAGE;

            if (player.CURRENT_TRACK != null) {
                let newCurTrack = null;
                for (let cnt = 0; cnt < tracks.length; cnt++) {
                    let track = tracks[cnt];

                    if (player.isCurrentTrack(track)) {
                        newCurTrack = track;
                        break;
                    }
                }

                if (newCurTrack != null) {
                    player.setCurrentTrack(newCurTrack);
                }
            }

            vueMap['PLAYLIST_TRACKS'].$data.TRACKS = tracks;

            if (callBack != null) {
                callBack(true);
            }
        }).fail(function (xhr) {
            console.error('error loading topsongs');
            console.log(request);
            console.log(xhr.responseText);

            if (callBack != null) {
                callBack(false);
            }
        });
    }

    loadUserPlayListPage(pageNum = 1, callBack = null) {

        let vueMap = this.vueMap;
        let tracks = this.getUserTracks();
        let tracksPerPage = this.TRACKS_PER_PAGE;
        pageNum = this.updateUserListPages(pageNum);
        let endIndex = pageNum * tracksPerPage;
        let startIndex = endIndex - tracksPerPage;

        if (endIndex >= tracks.length) {
            tracks = tracks.slice(startIndex);
        } else {
            tracks = tracks.slice(startIndex, endIndex);
        }

        if (player.CURRENT_TRACK != null) {
            let newCurTrack = null;
            for (let cnt = 0; cnt < tracks.length; cnt++) {
                let track = tracks[cnt];

                if (player.isCurrentTrack(track)) {
                    newCurTrack = track;
                    break;
                }
            }

            if (newCurTrack != null) {
                player.setCurrentTrack(newCurTrack);
            }
        }

        vueMap['PLAYLIST_TRACKS'].$data.TRACKS = tracks;

        if (callBack != null) {
            callBack(true);
        }
    }

    loadDefaultPlayListPage(pageNum = 1, user = null, callBack = null) {

        let request = null;

        if (user != null) {
            request = 'php/json/JsonHandler.php?api=page&data=playlist' +
                '&type=default' +
                '&user=' + user +
                '&page=' + pageNum
            ;
        } else {
            request = 'php/json/JsonHandler.php?api=page&data=playlist' +
                '&type=default' +
                '&page=' + pageNum
            ;
        }


        $.getJSON(request, function (json) {
            console.log('>>>>');
            console.log(json);
            /**
             this.vue.playlist.header.menu.$data.TEXT = json.data.value['PLAYLIST_HEADER'].data.TEXT;
             vueMap['PLAYLIST_HEADER'].$data.URL = json.data.value['PLAYLIST_HEADER'].data.URL;
             vueMap['PLAYLIST_HEADER'].$data.PLAYLIST = json.data.value['PLAYLIST_HEADER'].data.PLAYLIST;
             vueMap['PLAYLIST_HEADER'].$data.URL_TARGET = json.data.value['PLAYLIST_HEADER'].data.URL_TARGET;

             vueMap['PLAYLIST_NAV'].$data.CUR_PAGE = json.data.value['PLAYLIST_NAV'].data.CUR_PAGE;
             vueMap['PLAYLIST_NAV'].$data.MAX_PAGES = json.data.value['PLAYLIST_NAV'].data.MAX_PAGES;
             vueMap['PLAYLIST_NAV'].$data.LASTFM_USER_NAME = json.data.value['PLAYLIST_NAV'].data.LASTFM_USER_NAME;
             vueMap['PLAYLIST_NAV'].$data.PLAYLIST = 'default';

             if (player.CURRENT_TRACK != null) {
                let newCurTrack = null;
                for (let cnt = 0; cnt < json.data.value['PLAYLIST_TRACKS'].data.TRACKS.length; cnt++) {
                    let track = json.data.value['PLAYLIST_TRACKS'].data.TRACKS[cnt];

                    if (player.isCurrentTrack(track)) {
                        newCurTrack = track;
                        break;
                    }
                }

                if (newCurTrack != null) {
                    player.setCurrentTrack(newCurTrack);
                }
            }

             vueMap['PLAYLIST_TRACKS'].$data.TRACKS = json.data.value['PLAYLIST_TRACKS'].data.TRACKS;

             if (callBack != null) {
                callBack(true);
            }
             **/
        }).fail(function (xhr) {
            console.error('error loading page');
            console.log(xhr.responseText);

            if (callBack != null) {
                callBack(false);
            }
        });
    }

}