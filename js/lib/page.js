class PageController {


    constructor(storages, vue) {


        this.vue = vue;
        this.storage = storages.localStorage;
        this.vueMap = Array();
        this.PLAYLIST = null;
        this.TRACKS_PER_PAGE = 25; //in settings.ini
        this.PLAY_CONTROL = null;
        this.QUICKPLAY_TRACK = null;
        this.QUICKPLAY_TRACK_NR = null;
        this.MENULOADER_CLASS = $('#page-menuloader').attr('class');

    }

    init() {

        let vueMap = this.vueMap;
        let request = '/dev/lastfmtube/php/json/JsonHandler.php?api=page&data=page';
        let page = this;

        $.getJSON(request, function (json) {
            //console.log(JSON.stringify(json.data.value));
            for (let key in json.data.value) {
                switch (key) {
                    case 'PLAYLIST_NAV':
                        vueMap[key] = page.initPlayListNav(json.data.value[key]);
                        break;
                    case 'PLAYLIST_TRACKS':
                        vueMap[key] = page.initPlayListTracks(json.data.value[key]);
                        break;
                    default:
                        vueMap[key] = page.initDefaultVue(json.data.value[key]);
                        break;
                }
            }
            console.log('init page success');
        }).fail(function (xhr, status, error) {
            //var err = eval("(" + xhr.responseText + ")");
            console.log(xhr.responseText);
        });
    }


    initDefaultVue(json) {
        return new this.vue({
            el: json.el,
            data: json.data
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

                    track.PLAY_CONTROL = !track.PLAY_CONTROL;
                    page.PLAY_CONTROL = track;
                },

                playTrack: function (track) {
                    player.loadSong(track);
                },

                togglePlay: function (track) {

                    if (player.CURRENT_TRACK == track) {

                        let track_icon = $(track.NR).prop('outerHTML');

                        if (track_icon === player.icon_playing) {
                            player.ytPlayer.pauseVideo();
                        } else if (track_icon === player.icon_pause) {
                            player.ytPlayer.playVideo();
                        } else {
                            console.log('unbekannter zustand für play/pause');
                            console.log(track_icon);
                        }
                    } else if (page.QUICKPLAY_TRACK == track) {
                        page.QUICKPLAY_TRACK.NR = page.QUICKPLAY_TRACK_NR;
                        player.loadSong(track);
                    } else {
                        console.log('unbekannter track');
                        console.log(track);
                    }


                },

                showPlay: function (track, show) {
                    if (track == player.CURRENT_TRACK) {
                        return;
                    }

                    if (show) {
                        page.QUICKPLAY_TRACK = track;
                        page.QUICKPLAY_TRACK_NR = track.NR;
                        track.NR = player.icon_play;
                    } else {
                        track.NR = page.QUICKPLAY_TRACK_NR;
                        page.QUICKPLAY_TRACK = null;
                        page.QUICKPLAY_TRACK_NR = null;
                    }
                },

                addToUserList: function (track) {
                    track = page.clone(track);

                    let tracks = page.getUserTracks();

                    track.PLAY_CONTROL = false;
                    track.PLAYLIST = 'userlist';
                    track.NR = tracks.length+1;
                    tracks.push(track);
                    page.setUserTracks(tracks);
                },

                removeFromUserList: function (trackList, track) {

                    let storage = page.storage;
                    if (!storage.isSet('userlist.tracks')) return;

                    let removeTrack = function(tracks, track) {
                        let trackIndex = tracks.indexOf(track);
                        if(trackIndex<0) {
                            for(let cnt=0;cnt<tracks.length;cnt++) {
                                let curTrack = tracks[cnt];
                                if(parseInt(curTrack.NR) == parseInt(track.NR)) {
                                    trackIndex = cnt;
                                    break;
                                }
                            }
                            if(trackIndex<0) return;
                        }

                        tracks.splice(trackIndex, 1);
                        for(let cnt=trackIndex;cnt<tracks.length;cnt++) {
                            tracks[cnt].NR = cnt+1;
                        }
                    };

                    let storedTracks = page.getUserTracks();
                    removeTrack(storedTracks, track);
                    storage.set('userlist.tracks', storedTracks);
                    removeTrack(trackList, track);

                    let curPage = page.vueMap['PLAYLIST_NAV'].$data.CUR_PAGE;
                    page.loadPlaylistPage(curPage);
                }
            }
        });
    }

    clone(src) {
        return Object.assign({}, src);
    }

    getUserTracks(){
        let storage = this.storage;
        if (!storage.isSet('userlist.tracks')) storage.set('userlist.tracks', new Array());
        return storage.get('userlist.tracks');
    }

    setUserTracks(tracks) {
        let storage = this.storage;
        storage.set('userlist.tracks', tracks);
    }

    updateUserListPages(pageNum = null){
        let tracksPerPage = this.TRACKS_PER_PAGE;
        let tracks = this.getUserTracks();
        let pageCount =  parseInt(tracks.length/tracksPerPage);
        if((tracks.length%tracksPerPage) > 0) pageCount++;

        let vueMap = this.vueMap;
        vueMap['PLAYLIST_HEADER'].$data.LASTFM_USER_NAME = 'My Playlist';
        vueMap['PLAYLIST_HEADER'].$data.LASTFM_USER_URL = '';

        if(pageNum!=null) {
            if(pageNum>pageCount) pageNum = pageCount;
            else if(pageNum<1) pageNum = 1;
            vueMap['PLAYLIST_NAV'].$data.CUR_PAGE = pageNum;
        } else pageNum = parseInt(vueMap['PLAYLIST_NAV'].$data.CUR_PAGE);

        vueMap['PLAYLIST_NAV'].$data.MAX_PAGES = pageCount;
        vueMap['PLAYLIST_NAV'].$data.LASTFM_USER_NAME = '';
        vueMap['PLAYLIST_NAV'].$data.PLAYLIST = 'userlist';

        return pageNum;
    }

    load(menu) {
        if(!player.isReady) return;

        let playlist = 'default';
        if (typeof menu.ARGS !== 'undefined' && ('PLAYLIST' in menu.ARGS)) {
            playlist = menu.ARGS['PLAYLIST'];
        }
        if (playlist != null && playlist == this.PLAYLIST) return;

        let menuloader = $('#page-menuloader');
        menuloader.attr('class',$(player.icon_loading).attr('class'));

        this.PLAYLIST = playlist;
        this.loadPlaylistPage(1,null,function () {
            menuloader.attr('class',page.MENULOADER_CLASS);
            location.href=menu.URL;
        });
    }

    loadPlaylistPage(pageNum = 1, user = null, callBack = null) {

        switch (this.PLAYLIST) {
            case 'userlist':
                this.loadUserPlayListPage(pageNum, callBack);
                break;
            case 'topsongs':
                this.loadTopSongsPlayListPage(pageNum, callBack);
                break;
            default:
                this.loadDefaultPlayListPage(pageNum, user, callBack);
        }
    }

    loadTopSongsPlayListPage(pageNum = 1, callBack = null) {
        let vueMap = this.vueMap;
        let request = 'php/json/JsonHandler.php?api=page&data=playlist' +
            '&type=topsongs' +
            '&page=' + pageNum
        ;

        $.getJSON(request, function (json) {

            vueMap['PLAYLIST_HEADER'].$data.LASTFM_USER_NAME = 'Top Songs'
            vueMap['PLAYLIST_HEADER'].$data.LASTFM_USER_URL = '';

            vueMap['PLAYLIST_NAV'].$data.CUR_PAGE = json.data.value['PLAYLIST_NAV'].data.CUR_PAGE;
            vueMap['PLAYLIST_NAV'].$data.MAX_PAGES = json.data.value['PLAYLIST_NAV'].data.MAX_PAGES;


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
                    newCurTrack.NR = player.icon_playing;
                }
            }

            vueMap['PLAYLIST_TRACKS'].$data.TRACKS = tracks;

            if (callBack != null) {
                callBack();
            }
        }).fail(function (xhr) {
            console.error('error loading topsongs');
            console.log(xhr.responseText);
        });
    }

    loadUserPlayListPage(pageNum = 1, callBack = null) {
        let vueMap = this.vueMap;
        let tracks = this.getUserTracks();
        let tracksPerPage = this.TRACKS_PER_PAGE;
        pageNum = this.updateUserListPages(pageNum);
        let endIndex = pageNum*tracksPerPage;
        let startIndex = endIndex-tracksPerPage;

        if(endIndex>=tracks.length) {
            tracks = tracks.slice(startIndex);
        } else {
            tracks = tracks.slice(startIndex,endIndex);
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
                newCurTrack.NR = player.icon_playing;
            }
        }

        vueMap['PLAYLIST_TRACKS'].$data.TRACKS = tracks;

        if (callBack != null) {
            callBack();
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

            vueMap['PLAYLIST_HEADER'].$data.LASTFM_USER_NAME = json.data.value['PLAYLIST_HEADER'].data.LASTFM_USER_NAME;
            vueMap['PLAYLIST_HEADER'].$data.LASTFM_USER_URL = json.data.value['PLAYLIST_HEADER'].data.LASTFM_USER_URL;

            vueMap['PLAYLIST_NAV'].$data.CUR_PAGE = json.data.value['PLAYLIST_NAV'].data.CUR_PAGE;
            vueMap['PLAYLIST_NAV'].$data.LASTFM_USER_NAME = json.data.value['PLAYLIST_NAV'].data.LASTFM_USER_NAME;


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
                    newCurTrack.NR = player.icon_playing;
                }
            }

            vueMap['PLAYLIST_TRACKS'].$data.TRACKS = json.data.value['PLAYLIST_TRACKS'].data.TRACKS;

            if (callBack != null) {
                callBack();
            }
        }).fail(function (xhr) {
            console.error('error loading page');
            console.log(xhr.responseText);
        });
    }

}