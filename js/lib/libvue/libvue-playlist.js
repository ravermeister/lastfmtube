class LibvuePlaylist {

    constructor() {
        let control = this;

        this.header = {
            title: new Vue({
                el: '#page-playlist>.playlist-header-title',
                data: {
                    HEADER: '',
                    TEXT: '',
                    URL: '',
                    URL_TARGET: '',
                    PLAYLIST: '',
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
                        TEXT: '',
                        URL: '',
                        PLAYLIST: ''
                    }]
                },

                methods: {
                    update: function (json) { 
                        
                        if (this.staticMenus != null) {
                            this.$applyData({
                                MENUS: control.getListMenu(this.staticMenus)
                            });
                        } else if (!LibvueDefault.isUndefined(json.HEADER_MENU)) {
                            this.staticMenus = json.HEADER_MENU;
                            
                            this.$applyData({
                                MENUS: control.getListMenu(json.HEADER_MENU)
                            });
                        }

                    },
                    
                    refreshMenu: function() {
                        if(this.staticMenus == null) return;
                        
                        this.$applyData({
                            MENUS: control.getListMenu(this.staticMenus, $page.PLAYLIST)
                        });
                    },

                    isPlaylistMenu: function (menu) {
                        return menu.URL == '#page-playlist';
                    },

                    loadMenu: function (menu) {
    
                        if (this.isPlaylistMenu(menu) && !$player.isReady) return;
                        else if (menu.PLAYLIST == $player.PLAYLIST) return;

                        let oldlist = $page.PLAYLIST;
                        let newlist = menu.PLAYLIST;
                        let vue = this;
                        
                        let showPage = function (success) {
                            if(!vue.isPlaylistMenu(menu)) {
                                $page.setPlaylistLoading();                                
                            } else {
                                location.href = menu.URL+'-'+Date.now();
                                $page.setCurrentPlayList(success ? newlist : oldlist);
                                $page.setPlaylistLoading(false, success ? newlist : oldlist);                                
                            }
                            return false;
                        };

                        try {
                            $page.setPlaylistLoading(true);
                            $playlist.loadPlaylistPage(1, null, showPage, newlist);
                        } catch (e) {
                            console.error(e);
                            showPage(false);
                        }
                    },
                }
            })
        };

        this.menu = new Vue({
            el: '#page-playlist>.playlist-nav',
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
            el: '#page-playlist>.playlist-content',
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


    getListMenu(json, list = null) {

        if (list == null) list = $page.PLAYLIST;        
        
        switch (list) {

            default:
                return [];

            case 'topuser':
                return [{
                    LOGO: $page.icons.youtube.big,
                    TEXT: json.YTPLAYER.TEXT,
                    URL: '#page-ytplayer',
                    PLAYLIST: 'youtube'
                }, {
                    LOGO: $page.icons.headphones.big,
                    TEXT: json.DEFAULT.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'default'
                }, {
                    LOGO: $page.icons.user.big,
                    TEXT: json.USERLIST.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'userlist'
                }, {
                    LOGO: $page.icons.star.big,
                    TEXT: json.TOPSONGS.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'topsongs'
                }];
                
            case 'default':
                return [{
                    LOGO: $page.icons.youtube.big,
                    TEXT: json.YTPLAYER.TEXT,
                    URL: '#page-ytplayer',
                    PLAYLIST: 'youtube'
                }, {
                    LOGO: $page.icons.user.big,
                    TEXT: json.USERLIST.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'userlist'
                }, {
                    LOGO: $page.icons.star.big,
                    TEXT: json.TOPSONGS.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'topsongs'
                }, {
                    LOGO: $page.icons.trophy.big,
                    TEXT: json.TOPUSER.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'topuser'
                }];

            case 'topsongs':
                return [{
                    LOGO: $page.icons.youtube.big,
                    TEXT: json.YTPLAYER.TEXT,
                    URL: '#page-ytplayer',
                    PLAYLIST: 'youtube'
                }, {
                    LOGO: $page.icons.headphones.big,
                    TEXT: json.DEFAULT.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'default'
                }, {
                    LOGO: $page.icons.user.big,
                    TEXT: json.USERLIST.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'userlist'
                }, {
                    LOGO: $page.icons.trophy.big,
                    TEXT: json.TOPUSER.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'topuser'
                }];


            case 'userlist':
                return [{
                    LOGO: $page.icons.youtube.big,
                    TEXT: json.YTPLAYER.TEXT,
                    URL: '#page-ytplayer',
                    PLAYLIST: 'youtube'
                }, {
                    LOGO: $page.icons.headphones.big,
                    TEXT: json.DEFAULT.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'default'
                }, {
                    LOGO: $page.icons.star.big,
                    TEXT: json.TOPSONGS.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'topsongs'
                }, {
                    LOGO: $page.icons.trophy.big,
                    TEXT: json.TOPUSER.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'topuser'
                }];
        }
    }


    update(json) {
        this.content.update(json);
        this.menu.update(json);
        this.header.title.update(json);
        this.header.menu.update(json);
    }

}