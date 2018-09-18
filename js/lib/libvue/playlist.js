class VuePlaylist extends DefaultLibVue {

    constructor(page) {
        super(page);
        this.staticMenus = null;
            
            
        let control = this;
        let Vue = this.Vue;
        
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
                    update: control.updateData
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
                    update: control.updateData,

                    loadMenu: function (menu) {
                        if (!player.isReady) return; 
                        page.setPlaylistLoading(true);
                        
                        let playlist = menu.PLAYLIST;
                        let showPage = function (success) {
                            page.setPlaylistLoading();
                            if (!success) return;
                            window.location.href = menu.URL;
                        };

                        if (playlist != null && playlist == page.PLAYLIST) {
                            showPage(true);
                        } else {
                            if (playlist != null) {
                                page.setCurrentPlayList(playlist);
                                page.loadPlaylistPage(1, null, showPage);
                                return;
                            }
                            showPage(true);
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
                },

                update: control.updateData
            },

            mounted: function () {
                $(this.$el).find('#playlist_page, #playlist_lastfmuser', 'playlist_videourl').focus(function () {
                    var $this = $(this);
                    $this.select();

                    // Work around Chrome's little problem
                    $this.mouseup(function () {
                        // Prevent further mouseup intervention
                        $this.unbind('mouseup');
                        return false;
                    });
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
                    if (player.isCurrentTrack(track)) {
                        return;
                    }
                    track.PLAYSTATE = show ? 'stop' : '';
                    page.QUICKPLAY_TRACK = show ? track : null;
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

                update: control.updateData
            }
        });
    }


    getTracks(json) {
        let pdata = null;
        if (!this.isUndefined(json.playlist.LIST.HEADER))
            pdata = json.playlist.LIST.HEADER;
        if (!this.isUndefined(json.playlist.LIST.CONTENT))
            pdata.TRACKS = json.playlist.LIST.CONTENT;
        return pdata == null ? {} : pdata;
    }


    getPlaylistMenu(json) {

        let curPlaylist = page.PLAYLIST == null || page.PLAYLIST.length <= 0 ? 'default' : page.PLAYLIST;
        console.log()
        switch (curPlaylist) {
            case 'default':
                return [{
                    LOGO: page.icons.youtube.big,
                    TEXT: json.YTPLAYER.TEXT,
                    URL: '#page-ytplayer',
                    PLAYLIST: 'youtube'
                }, {
                    LOGO: page.icons.user.big,
                    TEXT: json.USERLIST.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'userlist'
                }, {
                    LOGO: page.icons.star.big,
                    TEXT: json.TOPSONGS.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'topsongs'
                }, {
                    LOGO: page.icons.trophy.big,
                    TEXT: json.TOPUSER.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'topuser'
                }];

            case 'topsongs':
                return [{
                    LOGO: page.icons.youtube.big,
                    TEXT: json.YTPLAYER.TEXT,
                    URL: '#page-ytplayer',
                    PLAYLIST: 'youtube'
                }, {
                    LOGO: page.icons.user.big,
                    TEXT: json.USERLIST.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'userlist'
                }, {
                    LOGO: page.icons.headphones.big,
                    TEXT: json.DEFAULT.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'default'
                }, {
                    LOGO: page.icons.trophy.big,
                    TEXT: json.TOPUSER.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'topuser'
                }];

            case 'userlist':
                return [{
                    LOGO: page.icons.youtube.big,
                    TEXT: json.YTPLAYER.TEXT,
                    URL: '#page-ytplayer',
                    PLAYLIST: 'youtube'
                }, {
                    LOGO: page.icons.user.big,
                    TEXT: json.TOPSONGS.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'topsongs'
                }, {
                    LOGO: page.icons.headphones.big,
                    TEXT: json.DEFAULT.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'default'
                }, {
                    LOGO: page.icons.trophy.big,
                    TEXT: json.TOPUSER.TEXT,
                    URL: '#page-playlist',
                    PLAYLIST: 'topuser'
                }];
        }
    }

    update(json) {

        if (!this.isUndefined(json.HEADER)) {
            json.HEADER.LOGO = page.icons.getPlaylistIcon(json.HEADER.PLAYLIST);
            json.HEADER.LOGO = json.HEADER.LOGO.big;
            this.header.title.update(json.HEADER);
        }

        if(this.staticMenus!=null) {
            console.log('UPDATE STATIC !!!'+page.PLAYLIST);
            this.header.menu.update({
                MENUS: this.getPlaylistMenu(this.staticMenus)
            });
        } else if(!this.isUndefined(json.HEADER_MENU)) {
            this.staticMenus = json.HEADER_MENU;
            this.header.menu.update({
                MENUS: this.getPlaylistMenu(json.HEADER_MENU)
            });              
        }


        if (!this.isUndefined(json.LIST_MENU)) {
            this.menu.update(json.LIST_MENU);
        }

        if (!this.isUndefined(json.LIST_HEADER)) {
            this.content.update(json.LIST_HEADER);
        }

        if (!this.isUndefined(json.TRACKS)) {
            this.content.update(json);
        }

    }
}