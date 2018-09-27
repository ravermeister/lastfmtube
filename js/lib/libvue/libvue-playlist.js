class LibvuePlaylist {

    constructor() {

        let control = this;

        this.header = {
            title: new Vue({
                el: '#page-playlist>.page-header-title>h2',
                data: {
                    TEXT: '',
                    LOGO: ''
                },

                methods: {
                    update: function (json) {
                        if (!this.$isUndefined(json.HEADER)) {
                            this.$applyData(json.HEADER);
                        }

                        if (this.$data.PLAYLIST === 'search') return;

                        if (typeof $page.myVues.youtube !== 'undefined') {
                            $page.myVues.youtube.header.PLAYLIST_NAME = this.$data.TEXT;
                        }
                    }
                }
            }),

            menu: new Vue({
                el: '#page-playlist>.page-header-nav',
                data: {
                    PLAYLIST: 'page-playlist'
                },
                computed: {
                    MENUS: function () {
                        return this.$getMenuForPlaylist(this.PLAYLIST);
                    }
                },

                methods: {}
            })
        };

        this.menu = new Vue({
            el: '#page-playlist>.page-nav',
            data: {
                LASTFM_USER_NAME_LABEL: 'User',
                LASTFM_USER_NAME: '',
                CUR_PAGE_LABEL: 'Page',
                PAGES_OF_LABEL: 'of',
                MAX_PAGES: 0,
                CUR_PAGE: 0,
                PLAYLIST_LOAD: 'Load',
                PLAYLIST: 'undefined',

                SAVED_VIDEO_ID: '',
                SEARCH_VIDEO_ID: '',
                SEARCH_NEEDLE: null,
                SEARCH_RESULT: []
            },

            computed: {


                /**
                 * @return {string}
                 */
                SAVED_TITLE: function () {
                    return this.SAVED_VIDEO_ID !== null &&
                    this.SAVED_VIDEO_ID.length > 0 &&
                    this.SAVED_VIDEO_ID === this.SEARCH_VIDEO_ID ?
                        'Saved' : '&nbsp;';
                }
            },

            methods: {

                loadPage: function (user, pageNum) {
                    if (this.PLAYLIST === 'search') {
                        let start = (pageNum - 1) * $page.TRACKS_PER_PAGE;
                        let end = pageNum * $page.TRACKS_PER_PAGE;
                        let tracks = [];
                        if (this.$data.SEARCH_RESULT.length > start) {
                            tracks = this.$data.SEARCH_RESULT.slice(start, end);
                        }

                        $page.myVues.playlist.content.update({
                            TRACKS: tracks
                        });
                        this.$data.CUR_PAGE = pageNum;
                        return;
                    }

                    $playlist.loadPlaylistPage(pageNum, user);
                },

                loadNextPage: function (user, pageNum, maxPages) {
                    pageNum++;
                    if (pageNum > maxPages) pageNum = 1;
                    this.loadPage(user, pageNum);
                },

                loadPrevPage: function (user, pageNum, maxPages) {
                    pageNum--;
                    if (pageNum <= 0) pageNum = maxPages;
                    this.loadPage(user, pageNum);
                },

                update: function (json) {

                    if (!this.$isUndefined(json.LIST_MENU)) {
                        this.$applyData(json.LIST_MENU);
                    }

                    if (typeof $page.myVues.youtube.header !== 'undefined') {
                        $page.myVues.youtube.header.$data.PLAYLIST_ID = this.$data.PLAYLIST;
                    }

                    $('#playlist_lastfmuser, #playlist_page, #search_videourl')
                        .unbind('mouseup')
                        .bind('mouseup',
                            function () {
                                var $this = $(this);
                                $this.select();
                            });
                },

                normalizeYouTubeUrl(event) {
                    let field = $(event.target);
                    let url = $(field).val();
                    let videoId = $.urlParam('v', url);
                    if (videoId === null) {
                        let vidsep = url.indexOf('/', (url.indexOf('//') + 2)) + 1;
                        if (vidsep > 0) {
                            let vidend = url.indexOf('?');
                            if (vidend < vidsep) vidend = url.length;
                            videoId = url.substr(vidsep, (vidend - vidsep));
                        } else videoId = '';
                    }

                    $(field).val(videoId);
                },

                setVideo(videoId) {
                    let callback = function(success) {
                        if(success) {
                            this.$data.SAVED_VIDEO_ID = videoId;
                            return;
                        }
                        console.log('error saving video id');
                    };

                    this.$data.SEARCH_NEEDLE.videoId = videoId;
                    $page.saveVideo(this.$data.SEARCH_NEEDLE, callback);
                }
            }
        });


        this.content = new Vue({
            el: '#page-playlist>.page-content',
            data: {
                TRACK_NR: 'Nr',
                TRACK_ARTIST: 'Artist',
                TRACK_TITLE: 'Title',
                TRACK_LASTPLAY: 'Lastplay',
                TRACKS: [{
                    NR: '',
                    ARTIST: '',
                    TITLE: '',
                    LASTPLAY: '',
                    VIDEO_ID: '',
                    PLAY_CONTROL: '',
                    PLAYLIST: '',
                    PLAYSTATE: ''
                }]
            },

            methods: {

                showPlay: function (track, show) {
                    if ($player.isCurrentTrack(track)) {
                        return;
                    }
                    track.PLAYSTATE = show ? 'stop' : '';
                    $page.QUICKPLAY_TRACK = show ? track : null;

                },

                addToUserList: function (event, track) {
                    $playlist.addUserTrack(track);
                },

                removeFromUserList: function (tracks, track) {
                    let isLast = tracks.length === 1;
                    let curPage = $page.myVues.playlist.menu.$data.CUR_PAGE;
                    let curIndex = tracks.indexOf(track);

                    $playlist.removeUserTrack(track);
                    $playlist.loadUserPlayListPage(curPage);

                    tracks = $page.myVues.playlist.content.$data.TRACKS;
                    if (tracks.length > 0) {
                        if (tracks.length > curIndex) {
                            this.togglePlayControl(tracks[curIndex]);
                        } else {
                            this.togglePlayControl(tracks[tracks.length - 1]);
                        }
                    }
                },

                clearUserList: function () {
                    $playlist.setUserTracks();
                    $playlist.loadUserPlayListPage();
                },

                togglePlay: function (track) {

                    if ($player.isCurrentTrack(track)) {
                        if ($player.isPlaying()) {
                            $player.ytPlayer.pauseVideo();
                        } else if ($player.isPaused()) {
                            $player.ytPlayer.playVideo();
                        } else {
                            console.log('unbekannter zustand für play/pause');
                            console.log(track_icon);
                        }
                    } else if ($page.QUICKPLAY_TRACK === track) {
                        $player.errorLoopCount = 0;
                        $player.loadSong(track);
                    } else {
                        console.log('unbekannter track');
                        console.log(track);
                    }
                },

                togglePlayControl: function (track) {
                    if ($page.PLAY_CONTROL !== null && $page.PLAY_CONTROL !== track) {
                        $page.PLAY_CONTROL.PLAY_CONTROL = false;
                    }
                    if (track.PLAYLIST === 'search') {
                        $page.myVues.playlist.menu.$data.SEARCH_VIDEO_ID = track.VIDEO_ID;
                    }

                    track.PLAY_CONTROL = !track.PLAY_CONTROL;
                    $page.PLAY_CONTROL = track;
                },

                update: function (json) {
                    if (!this.$isUndefined(json.LIST_HEADER)) {
                        this.$applyData(json.LIST_HEADER);
                    }

                    if (!this.$isUndefined(json.TRACKS)) {
                        let newTracks = [];
                        if ($player.CURRENT_TRACK != null) {

                            for (let cnt = 0; cnt < json.TRACKS.length; cnt++) {
                                let track = json.TRACKS[cnt];
                                if ($player.isCurrentTrack(track)) {
                                    track = $player.CURRENT_TRACK;
                                }
                                newTracks[cnt] = track;
                            }
                        } else newTracks = json.TRACKS;

                        this.$data.TRACKS = newTracks;
                    }

                },

                trackInfo: function (track) {
                    let title = 'last Played: ' + track.LASTPLAY;
                    if (typeof track.PLAYCOUNT !== 'undefined') {
                        title = 'Playcount: ' + track.PLAYCOUNT + ' | ' + title;
                    }
                    return title;
                },

                playTrack: function (track) {
                    $player.errorLoopCount = 0;
                    $player.loadSong(track);
                },

                searchVideos: function (event, track) {
                    $page.setPlaylistLoading(true);
                    let callBack = function (success) {
                        $page.setPlaylistLoading();
                    };
                    $player.searchSong(track, callBack);
                }
            }
        });

    }


    getTracks(json) {
        let pdata = null;
        if (!$page.$isUndefined(json.playlist.LIST.HEADER))
            pdata = json.playlist.LIST.HEADER;
        if (!$page.$isUndefined(json.playlist.LIST.CONTENT))
            pdata.TRACKS = json.playlist.LIST.CONTENT;
        return pdata === null ? {} : pdata;
    }


    update(json, ignoreTitle = false) {
        this.content.update(json);
        this.menu.update(json);

        if (ignoreTitle) return;
        this.header.title.update(json);
    }

}