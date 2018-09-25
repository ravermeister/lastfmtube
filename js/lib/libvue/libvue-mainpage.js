class LibvueMainpage {

    constructor() {

        this.logo = new Vue({
            el: '#header>.logo',
            data: {
                PAGE_LOADER: 'fa fa-spinner faa-spin animated fa-3x'
            }
        });

        this.content = new Vue({
            el: '#header>.content',
            data: {
                PAGE_HEADER: 'Last.fm Youtbe Radio',
                PAGE_WELCOME: 'under construction'
            }
        });

        this.menu = new Vue({
            el: '#header>nav',
            data: {
                TITLE: '',
                TEXT: '',
                MENUS: [{
                    NAME: '',
                    PLAYLIST: '',
                    PAGE: '',
                }]
            },
            
            methods: {
                
                loadMenu(menu, event) {                        
                    //if (!$player.isReady) return;
                    
                    let isPlayList = typeof menu.PLAYLIST !== 'undefined';
                    let playlistLoaded = function (success) {
                        if(isPlayList) {
                            $page.setCurrentPlaylist(menu.PLAYLIST);
                            $page.setMainPageLoading();
                            location.href='#' + menu.PLAYLIST;                            
                        } else {
                            $page.setCurrentPage(menu.PAGE);
                            $page.setMainPageLoading();
                            location.href='#' + menu.PAGE;
                        }                         
                    };
                    
                    $page.setMainPageLoading(true);                    
                    if(isPlayList) {
                        let article = $('.playlist-container');
                        $(article).attr('id', menu.PLAYLIST);
                        
                        if(!$page.isCurrentPlaylist()) {
                            let lfmuser = $page.myVues.playlist.menu.$data.LASTFM_USER_NAME;
                            if(typeof lfmuser === 'undefined' || lfmuser === null) {
                                try {
                                    lfmuser = $(article).find('#playlist_lastfmuser').val();
                                }catch (e) {}
                            }

                            $playlist.loadPlaylistPage(1, lfmuser, playlistLoaded, menu.PLAYLIST);
                            return;
                        }                        
                    }

                    playlistLoaded(true);                    
                },
            }
        });
    }


    update(json) {

        if (!Vue.prototype.$isUndefined(json)) {
            this.content.$data.PAGE_HEADER = json.TITLE;
            this.content.$data.PAGE_WELCOME = json.TEXT;
        }

        if (!Vue.prototype.$isUndefined(json.MENU)) {
            this.menu.$data.MENUS = json.MENU;
        }
    }
}