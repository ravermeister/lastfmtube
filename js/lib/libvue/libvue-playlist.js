class LibvuePlaylist  {

    constructor() {

        let control = this;
        
        this.header = {
            title: new Vue({
                el: '#default>.playlist-header-title>h2',
                data: {
                    HEADER: '',
                    TEXT: '',
                    LOGO: ''
                },

                methods: {
                    update: function (json) {
                        if (!this.$isUndefined(json.HEADER)) {
                            json.HEADER.LOGO = $page.icons.getPlaylistIcon(json.HEADER.PLAYLIST);
                            json.HEADER.LOGO = json.HEADER.LOGO.big;
                            this.$applyData(json.HEADER);
                        }
                    }
                }
            }),

            menu: new Vue({
                el: '#page-playlist>.playlist-header-nav',
                data: {
                    MENUS: [{
                        LOGO: '',
                        TEXT: 'hey',
                        PLAYLIST: ''
                    },{
                        LOGO: '',
                        TEXT: 'was geht',
                        PLAYLIST: ''
                    }]
                },
                
                methods: {
                    update: function (json) {
                        
                        let playlist = 'default'; 
                        let menu = this.$getMenuForPlaylist(playlist, json);                        
                        
                        this.$applyData({
                            MENUS: menu
                        });
                        
                        console.log('this menus',this.$data.MENUS);
                    },
                    
                    refreshMenu: function() {
                        let playlist = 'default';
                        let menu = this.$getMenuForPlaylist(playlist);
                        
                        
                        this.$applyData({
                            MENUS: menu
                        });
                        
                        console.log('this menus',this.$data.MENUS);
                    },
                    
                    loadMenu: function (menu, event) {
                        
                        try {
                                                        
                            if (!$player.isReady) return;
                            else if (menu.PLAYLIST == $player.PLAYLIST) return;

                            let oldlist = $page.PLAYLIST;
                            let newlist = menu.PLAYLIST;

                            let showPage = function (success) {
                                $page.setCurrentPlayList(success ? newlist : oldlist);
                                $page.setPlaylistLoading(false, success ? newlist : oldlist);
                                console.log('load page ', '#' + menu.PAGE);
                                location.href='#'+menu.PAGE;
                            };
                            
                            $page.setPlaylistLoading(true);
                            Vue.nextTick()
                                .then(function () {
                                    // DOM updated
                                    $playlist.loadPlaylistPage(1, null, showPage, newlist);
                                });
                            
                            
                            // usage as a promise (2.1.0+, see note below)
                            /**
                            Vue.nextTick()
                                .then(function () {
                                    // DOM updated
                                    
                                });
                            **/
                        } catch (e) {
                            console.error(e);
                            showPage(false);
                        }
                    },
                }
            })
        };

        this.menu = new Vue({
            el: '#default>.playlist-nav',
            data: {
                LASTFM_USER_NAME_LABEL: 'User',
                LASTFM_USER_NAME: '',
                CUR_PAGE_LABEL: 'Page',
                PAGES_OF_LABEL: 'of',
                MAX_PAGES: 0,
                CUR_PAGE: 0,
                PLAYLIST_LOAD: 'Load',
                PLAYLIST: 'default'
            },

            methods: {
                loadPage: function (user, pageNum) {
                    $playlist.loadPlaylistPage(pageNum, user);
                },

                loadNextPage: function (user, pageNum, maxPages) {
                    pageNum++;
                    if (pageNum > maxPages) pageNum = 1;
                    $playlist.loadPlaylistPage(pageNum, user);
                },

                loadPrevPage: function (user, pageNum, maxPages) {
                    pageNum--;
                    if (pageNum <= 0) pageNum = maxPages;
                    $playlist.loadPlaylistPage(pageNum, user);
                },

                update: function (json) {
                    if (!this.$isUndefined(json.LIST_MENU)) {
                        this.$applyData(json.LIST_MENU);
                    }
                }
            },

            mounted: function () {
                $(this.$el).find('#playlist_page, #playlist_lastfmuser', '#playlist_videourl')
                    .unbind('mouseup')
                    .bind('mouseup', function () {
                        var $this = $(this);
                        $this.select();
                    });
            }
        });


        this.content = new Vue({
            el: '#default>.playlist-content',
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

                togglePlay: function (track) {

                    if ($player.CURRENT_TRACK == track) {
                        if ($player.isPlaying()) {
                            $player.ytPlayer.pauseVideo();
                        } else if ($player.isPaused()) {
                            $player.ytPlayer.playVideo();
                        } else {
                            console.log('unbekannter zustand für play/pause');
                            console.log(track_icon);
                        }
                    } else if ($page.QUICKPLAY_TRACK == track) {
                        $player.loadSong(track);
                    } else {
                        console.log('unbekannter track');
                        console.log(track);
                    }
                },

                togglePlayControl: function (track) {
                    if ($page.PLAY_CONTROL != null && $page.PLAY_CONTROL != track) {
                        $page.PLAY_CONTROL.PLAY_CONTROL = false;
                    }

                    if ($page.PLAYLIST != null && $page.PLAYLIST == 'search') {
                        $page.vueMap['PLAYLIST_NAV'].$data.LASTFM_USER_NAME = track.VIDEO_ID;
                    }

                    track.PLAY_CONTROL = !track.PLAY_CONTROL;
                    $page.PLAY_CONTROL = track;
                },

                update: function (json) {
                    if (!this.$isUndefined(json.LIST_HEADER)) {
                        this.$applyData(json.LIST_HEADER);
                    }
                    if (!this.$isUndefined(json.TRACKS)) {
                        this.$applyData(json);
                    }
                }
            }
        });

    }


    getTracks(json) {
        let pdata = null;
        if (!this.$isUndefined(json.playlist.LIST.HEADER))
            pdata = json.playlist.LIST.HEADER;
        if (!this.$isUndefined(json.playlist.LIST.CONTENT))
            pdata.TRACKS = json.playlist.LIST.CONTENT;
        return pdata == null ? {} : pdata;
    }

    
    update(json) {
        this.content.update(json);
        this.menu.update(json);
        this.header.title.update(json);
        this.header.menu.update(json);
    }

}