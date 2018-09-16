class PageController {


    constructor(storages, vue) {


        this.vue = vue;
        this.storage = storages.localStorage;
        this.vueMap = Array();
        this.PLAYLIST = null;
        this.TRACKS_PER_PAGE = 25; //in settings.ini
        this.PLAY_CONTROL = null;
        this.QUICKPLAY_TRACK = null;
    }

    init() {

        let vueMap = this.vueMap;
        let request = 'php/json/JsonHandler.php?api=page&data=page';
        let page = this;

        $.getJSON(request, function (json) {
            //console.log(JSON.stringify(json.data.value));
            for (let key in json.data.value) {
                switch (key) {
                    case 'PLAYLIST_NAV':
                        vueMap[key] = page.initPlayListNav(json.data.value[key]);
                        break;
                    case 'PLAYLIST_HEADER':
                        vueMap[key] = page.initPlayListHeader(json.data.value[key]);
                        break;
                        break;
                    case 'PLAYLIST_TRACKS':
                        vueMap[key] = page.initPlayListTracks(json.data.value[key]);
                        break;
                    default:
                        vueMap[key] = page.initDefaultVue(json.data.value[key]);
                        break;
                }
            }

            page.setCurrentPlayList();

            if (vueMap['PLAYLIST_TRACKS'].$data.TRACKS.length > 0) {
                player.loadSong(vueMap['PLAYLIST_TRACKS'].$data.TRACKS[0]);
            }

            vueMap['HEADER_LOGO'].$data.PAGE_LOADING = false;


            let loaderElem = vueMap['HEADER_LOGO'].$refs.PAGE_LOADER;
            $(loaderElem)
                .removeClass('fa-spinner fa-spin animated')
                .addClass('fa-diamond');


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


        this.vueMap['YTPLAYER_HEADER'].$data.PLAYLIST_NAME = name;
        this.vueMap['YTPLAYER_HEADER'].$data.PLAYLIST_URL = '#page-playlist';
        this.vueMap['PLAYLIST_HEADER'].$data.PLAYLIST = playlist;

        page.PLAYLIST = playlist;
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
                loadPage: function (url) {
                    page.loadPlaylistPage(1, null, function () {
                        if (page.PLAYLIST != null && page.PLAYLIST == 'search') {
                            page.loadPlaylistPage(1, null, function () {
                                location.href = '#page-playlist';
                            }, url);
                        } else {
                            location.href = '#page-playlist';
                        }

                    });
                },

                loadPlayList: function (list) {
                    let oldList = 'default';
                    if(page.PLAYLIST!=null) oldList = page.PLAYLIST;
                    let iconClasses = '';
                    switch(oldList) {
                        case 'userlist' :
                            iconClasses = '';
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
                    let icon = $('#page-playlist>.playlist-header-container>h2>.playlist-header-ico')
                                    .removeClass('').addClass();

                    
                    
                    page.loadPlaylistPage(1, null, null, list, function () {

                    });
                }
            }
        });
    }

    initPlayListNav(json) {
        return new this.vue({
            el: json.el,
            data: json.data,

            methods: {
                loadPage: function (user, pageNum) {
                    page.loadPlaylistPage(pageNum, user);
                },

                loadNextPage: function (user, pageNum, maxPages) {
                    pageNum++;
                    if (pageNum > maxPages) pageNum = 1;
                    page.loadPlaylistPage(pageNum, user);
                },

                loadPrevPage: function (user, pageNum, maxPages) {
                    pageNum--;
                    if (pageNum <= 0) pageNum = maxPages;
                    page.loadPlaylistPage(pageNum, user);
                }
            }
        });
    }

    initPlayListTracks(json) {
        return new this.vue({
            el: json.el,
            data: json.data,

            methods: {
                togglePlayControl: function (track) {
                    if (page.PLAY_CONTROL != null && page.PLAY_CONTROL != track) {
                        page.PLAY_CONTROL.PLAY_CONTROL = false;
                    }

                    if (page.PLAYLIST != null && page.PLAYLIST == 'search') {
                        page.vueMap['PLAYLIST_NAV'].$data.LASTFM_USER_NAME = track.VIDEO_ID;
                    }

                    track.PLAY_CONTROL = !track.PLAY_CONTROL;
                    page.PLAY_CONTROL = track;
                },

                playTrack: function (track) {
                    player.loadSong(track);
                },

                togglePlay: function (track) {

                    if (player.CURRENT_TRACK == track) {
                        if (player.isPlaying()) {
                            player.ytPlayer.pauseVideo();
                        } else if (player.isPaused()) {
                            player.ytPlayer.playVideo();
                        } else {
                            console.log('unbekannter zustand für play/pause');
                            console.log(track_icon);
                        }
                    } else if (page.QUICKPLAY_TRACK == track) {
                        player.loadSong(track);
                    } else {
                        console.log('unbekannter track');
                        console.log(track);
                    }


                },

                showPlay: function (track, show) {
                    if (player.isCurrentTrack(track)) {
                        return;
                    }
                    track.PLAYSTATE = show ? 'stop' : '';
                    page.QUICKPLAY_TRACK = show ? track : null;
                },

                addToUserList: function (event, track) {

                    $(event.target).removeClass('fas fa-headphones')
                        .addClass('fa-spinner faa-spin animated');

                    track = page.clone(track);
                    page.resetTrack(track);

                    let tracks = page.getUserTracks();
                    track.PLAYLIST = 'userlist';
                    track.NR = tracks.length + 1;
                    tracks.push(track);
                    page.setUserTracks(tracks);


                    $(event.target).removeClass('fa-spinner faa-spin animated')
                        .addClass('fas fa-check');
                    setTimeout(function () {
                        $(event.target).removeClass('fas fa-check')
                            .addClass('fas fa-headphones');
                    }, 500);

                },

                removeFromUserList: function (trackList, track) {

                    let storage = page.storage;
                    if (!storage.isSet('userlist.tracks')) return;

                    let removeTrack = function (tracks, track, callBack) {
                        let trackIndex = tracks.indexOf(track);
                        if (trackIndex < 0) {
                            for (let cnt = 0; cnt < tracks.length; cnt++) {
                                let curTrack = tracks[cnt];
                                if (parseInt(curTrack.NR) == parseInt(track.NR)) {
                                    trackIndex = cnt;
                                    break;
                                }
                            }
                            if (trackIndex < 0) return;
                        }

                        tracks.splice(trackIndex, 1);
                        for (let cnt = trackIndex; cnt < tracks.length; cnt++) {
                            tracks[cnt].NR = cnt + 1;
                        }

                        if (callBack != null) {
                            callBack(trackIndex);
                        }
                    };

                    let storedTracks = page.getUserTracks();
                    removeTrack(storedTracks, track);
                    storage.set('userlist.tracks', storedTracks);

                    removeTrack(trackList, track, function (trackIndex) {

                        if (trackList.length > trackIndex) {
                            trackList[trackIndex].PLAY_CONTROL = true;
                        } else if (trackList.length > 0) {
                            trackList[trackList.length - 1].PLAY_CONTROL = true;
                        } else {
                            let curPage = page.vueMap['PLAYLIST_NAV'].$data.CUR_PAGE;
                            page.loadPlaylistPage(curPage);
                        }

                    });
                },

                searchVideos(event, track) {

                    let needle = page.createNeedle(track);
                    let request = 'php/json/JsonHandler.php?api=videos&data=search&size=25&needle=' + needle.asVar();
                    let setLoading = function (isLoading) {
                        if (isLoading) {
                            $(event.target)
                                .removeClass('fa-search')
                                .addClass('fa-spinner faa-spin animated');
                        } else {
                            $(event.target)
                                .removeClass('fa-spinner faa-spin animated')
                                .addClass('fa-search');
                        }
                    };
                    let cleanTitle = function (str, needle) {
                        let pattern = new RegExp(needle, 'gi');
                        return str.replace(pattern, '');
                    };

                    setLoading(true);
                    $.getJSON(request, function (json) {
                        setLoading(false);
                        let tracks = Array();

                        for (let cnt = 0; cnt < json.data.value.length; cnt++) {
                            let video = json.data.value[cnt];

                            tracks[cnt] = {
                                NR: (cnt + 1),
                                ARTIST: track.ARTIST,
                                TITLE: video['title'], //cleanTitle(video['title'], track.ARTIST),
                                VIDEO_ID: video['video_id'],
                                LASTPLAY: '',
                                PLAY_CONTROL: false,
                                PLAYLIST: 'search'
                            };
                        }
                        page.loadSearchResult(track, tracks, 1, function () {
                            page.vueMap['PLAYLIST_HEADER'].$data.URL = page.PLAYLIST;
                            page.PLAYLIST = 'search';
                        });
                    }).fail(function (xhr) {
                        setLoading(false);
                        console.error('failed to search videos for track');
                        console.error(track);
                        console.error(xhr.responseText);
                    });

                },

                saveAlternative(track, video = null) {
                    let needle = page.createNeedle(page.vueMap['PLAYLIST_TRACKS'].$data.SEARCH_TRACK);
                    needle.videoId = video != null ? video : track.VIDEO_ID;
                    let request = 'php/json/JsonHandler.php?api=vars';

                    $.post(request, {
                        name: needle.asVar(true),
                        value: needle.videoId
                    }, function (json) {
                        //console.log('successful saved alternative video');                        
                    }, 'json').fail(function (xhr) {
                        console.error('error saving youtube alternative video');
                        console.error(xhr.responseText);
                    });
                },

                deleteAlternative(event, track, tracks) {

                    let needle = page.createNeedle(track);
                    let request = 'php/json/JsonHandler.php?api=vars&name=' + needle.asVar();
                    let cleanTracks = function (cleanTrack, trackList) {
                        let videoId = cleanTrack.VIDEO_ID;
                        for (let cnt = 0; cnt < trackList.length; cnt++) {
                            let curTr = trackList[cnt];

                            if (curTr.TITLE == cleanTrack.TITLE && curTr.ARTIST == cleanTrack.ARTIST && curTr.VIDEO_ID == videoId) {
                                curTr.VIDEO_ID = '';
                            }
                        }
                    };

                    $.ajax({
                        url: request,
                        type: 'DELETE',
                        dataType: 'json',
                        success: function (json) {
                            cleanTracks(track, tracks);
                        },
                        fail: function (xhr) {
                            console.error('error deleting youtube alternative');
                            console.error(xhr.responseText);
                        }
                    });
                }
            }
        });

        console.log('init playlist');
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

    load(menu) {
        if (!player.isReady) return;

        let playlist = 'default';
        if (typeof menu.ARGS !== 'undefined' && ('PLAYLIST' in menu.ARGS)) {
            playlist = menu.ARGS['PLAYLIST'];
        }


        this.vueMap['HEADER_LOGO'].$data.PAGE_LOADING = true;
        let loaderElem = this.vueMap['HEADER_LOGO'].$refs.PAGE_LOADER;
        $(loaderElem).removeClass('fa-diamond').addClass('fa-spinner fa-spin animated');

        let showPage = function (success) {
            $(loaderElem).removeClass('fa-spinner fa-spin animated').addClass('fa-diamond');

            if (!success) return;
            window.location.href = menu.URL;
        };


        if (playlist != null && playlist == this.PLAYLIST) {
            showPage(true);
        } else {
            if (playlist != null) {
                this.PLAYLIST = playlist;
            }
            this.loadPlaylistPage(1, null, showPage);
        }
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
        let vueMap = page.vueMap;
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

            vueMap['PLAYLIST_HEADER'].$data.TEXT = json.data.value['PLAYLIST_HEADER'].data.TEXT;
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
        }).fail(function (xhr) {
            console.error('error loading page');
            console.log(xhr.responseText);

            if (callBack != null) {
                callBack(false);
            }
        });
    }

}