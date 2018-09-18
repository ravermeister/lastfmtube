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


class PageController {


    constructor(Vue, Storages) {

        this.storage = Storages.localStorage;
        this.Vue = Vue;
        this.PLAYLIST = null;
        this.TRACKS_PER_PAGE = 25; //in settings.ini
        this.PLAY_CONTROL = null;
        this.QUICKPLAY_TRACK = null;
        this.icons = this.initIcons();
        this.myVues = this.initVue();
    }

    initVue() {

        return {
            base: new VueBase(this),
            playlist: new VuePlaylist(this),
            youtube: new VueYoutube(this),            

            updateAll: function (json) {
                this.base.update(json.base);
                this.playlist.update(json.playlist);
                this.youtube.update(json.youtube);
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
                case 'default':
                    return this.headphones;
            }

        };

        return icons;
    }

    init() {

        let request = 'php/json/JsonHandler.php?api=page&data=page';
        let page = this;


        $.getJSON(request, function (json) {
            //console.log(JSON.stringify(json.data.value));


            page.setPageLoading(true);
            page.myVues.updateAll(json.data.value);
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
            case 'topuser':
                name = 'Top User';
                break;            
        }

        this.myVues.youtube.header.$data.PLAYLIST_NAME = name;
        if(playlist !== 'youtube') {            
            this.myVues.youtube.header.$data.PLAYLIST_ID = playlist;
        }

        this.PLAYLIST = playlist;
    }

    setPageLoading(active = false) {
        this.myVues.base.logo.$data.PAGE_LOADER = active ? this.icons.loader.bigger : this.icons.diamond.bigger;
    }

    setPlaylistLoading(active = false) {        
        let curIcon = this.icons.getPlaylistIcon(this.PLAYLIST == null ? 'default' : this.PLAYLIST);
        this.myVues.playlist.header.title.$data.LOGO = active ? curIcon.animatedBig : curIcon.big;
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
                    if (this.PLAYLIST == null) return this.icons.headphones.big;
                    switch (this.PLAYLIST) {
                        case 'topsongs':

                            break;
                    }
                },


                loadPlayList: function (list) {
                    let oldList = 'default';
                    if (this.PLAYLIST != null) oldList = this.PLAYLIST;

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
                    this.loadPlaylistPage(1, null, null, list, function () {
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
        let vueMap = this.vueMap;
        let tracks = this.getUserTracks();
        let pageCount = parseInt(tracks.length / tracksPerPage);
        if ((tracks.length % tracksPerPage) > 0) pageCount++;

        if (pageNum != null) {
            if (pageNum > pageCount) pageNum = pageCount;
            else if (pageNum < 1) pageNum = 1;
        } else pageNum = parseInt(this.myVues.playlist.menu.$data.CUR_PAGE);


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
        
        let control = this;
        let request = 'php/json/JsonHandler.php?api=page&data=playlist' +
            '&type=topsongs' +
            '&page=' + pageNum
        ;

        $.getJSON(request, function (json) {

            if (player.CURRENT_TRACK != null) {
                let newCurTrack = null;
                for (let cnt = 0; cnt < json.data.value.TRACKS.length; cnt++) {
                    let track = json.data.value.TRACKS[cnt];

                    if (player.isCurrentTrack(track)) {
                        newCurTrack = track;
                        break;
                    }
                }

                if (newCurTrack != null) {
                    player.setCurrentTrack(newCurTrack);
                }
            }
            
            control.myVues.playlist.update(json.data.value);
            
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
        })
    }

    loadUserPlayListPage(pageNum = 1, callBack = null) {
        
        let tracks = this.getUserTracks();
        let tracksPerPage = this.TRACKS_PER_PAGE;
        pageNum = this.updateUserListPages(pageNum);
        let pageCount = parseInt(tracks.length / tracksPerPage);
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

        this.myVues.playlist.update({
            HEADER: {
                PLAYLIST:  'userlist',
                TEXT: 'My Playlist',
                URL: ''
            },

            LIST_MENU: {
                CUR_PAGE: pageNum,
                MAX_PAGES: pageCount,
                LASTFM_USER_NAME :'',
                PLAYLIST: 'userlist'
            },

            TRACKS: tracks
        })
        
        if (callBack != null) {
            callBack(true);
        }
    }

    loadDefaultPlayListPage(pageNum = 1, user = null, callBack = null) {
        
        let request = null;
        let control = this;
        
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


            //this.myVues.playlist.header.title.update(json.data.value.HEADER);


            if (player.CURRENT_TRACK != null) {
                let newCurTrack = null;
                for (let cnt = 0; cnt < json.data.value.TRACKS.length; cnt++) {
                    let track = json.data.value.TRACKS[cnt];

                    if (player.isCurrentTrack(track)) {
                        newCurTrack = track;
                        break;
                    }
                }

                if (newCurTrack != null) {
                    player.setCurrentTrack(newCurTrack);
                }
            }

            control.myVues.playlist.update(json.data.value);
            //control.myVues.playlist.content.update(json.data.value);

            if (callBack != null) {
                callBack(true);
            }

        }).fail(function (xhr) {
            console.error('error loading page');
            console.log(xhr.responseText);

            if (callBack != null) {
                callBack(false);
            }
        });
    }

}