class VuePlaylist extends DefaultLibVue {

    
    doInit(json) {
        let Vue = this.Vue;
        let control = this;
        
        this.header = {
            title: new Vue({
                el: '#page-playlist>.playlist-header-title',
                data: function () {
                    return {
                        TEXT: json.playlist.HEADER.TEXT,
                        URL: json.playlist.HEADER.URL,
                        URL_TARGET: json.playlist.HEADER.URL_TARGET,
                        LOGO: page.icons.getPlaylistIcon(json.playlist.HEADER.PLAYLIST)
                    };
                }
            }),


            menu: new Vue({
                el: '#page-playlist>.playlist-header-nav',

                data: function () {

                    let curPlaylist = page.PLAYLIST == null ? 'default' : page.PLAYLIST;
                    switch (curPlaylist) {
                        case 'default':
                            return {
                                MENUS: control.getPlayListMenuDefault(json)
                            };

                    }
                }

            })
        };

        this.menu = new Vue({
            el: '#page-playlist>.playlist-nav',
            data: {
                LASTFM_USER_NAME_LABEL: json.playlist.LIST_MENU.LASTFM_USER_NAME_LABEL,
                LASTFM_USER_NAME: json.playlist.LIST_MENU.LASTFM_USER_NAME,
                CUR_PAGE_LABEL: json.playlist.LIST_MENU.CUR_PAGE_LABEL,
                PAGES_OF_LABEL: json.playlist.LIST_MENU.PAGES_OF_LABEL,
                MAX_PAGES: json.playlist.LIST_MENU.MAX_PAGES,
                CUR_PAGE: json.playlist.LIST_MENU.CUR_PAGE,
                PLAYLIST_LOAD: json.playlist.LIST_MENU.PLAYLIST_LOAD,
                PLAYLIST: json.playlist.LIST_MENU.PLAYLIST
            }
        });

        this.content = new Vue({
            el: '#page-playlist>.playlist-content',
            data: {
                TRACK_NR: json.playlist.LIST.HEADER.TRACK_NR,
                TRACK_ARTIST: json.playlist.LIST.HEADER.TRACK_ARTIST,
                TRACK_TITLE: json.playlist.LIST.HEADER.TRACK_TITLE,
                TRACK_LASTPLAY: json.playlist.LIST.HEADER.TRACK_LASTPLAY,
                TRACKS: json.playlist.LIST.CONTENT
            }
        })
    }
    
    doUpdate(json) {
        
    }


    getPlayListMenuDefault(json) {
        return [{
            LOGO: page.icons.youtube.big,
            TEXT: json.playlist.HEADER_MENU.YTPLAYER.TEXT,
            URL: '#page-ytplayer'
        }, {
            LOGO: page.icons.user.big,
            TEXT: json.playlist.HEADER_MENU.USERLIST.TEXT,
            URL: '#page-playlist'
        }, {
            LOGO: page.icons.star.big,
            TEXT: json.playlist.HEADER_MENU.TOPSONGS.TEXT,
            URL: '#page-playlist'
        }, {
            LOGO: page.icons.trophy.big,
            TEXT: json.playlist.HEADER_MENU.TOPUSER.TEXT,
            URL: '#page-playlist'
        }];
    }
}
