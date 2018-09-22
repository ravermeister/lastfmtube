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
                    if (!$player.isReady) return;

                    let playlistLoaded = function (success) {
                        if(typeof menu.PLAYLIST !== 'undefined') {
                            $page.setCurrentPage(menu.PLAYLIST);
                            $page.setPageLoading();
                            location.href='#' + menu.PLAYLIST;                            
                        } else {
                            $page.setPageLoading();
                            location.href='#' + menu.PAGE;
                        }                         
                    };
                    
                    $page.setPageLoading(true);
                    
                    if(typeof menu.PLAYLIST !== 'undefined') {
                        let article = $('.playlist-container');
                        $(article).attr('id', menu.PLAYLIST);
                        $playlist.loadPlaylistPage(1, null, playlistLoaded, menu.PLAYLIST);                        
                    } else {                                         
                        playlistLoaded(true);
                    }                    
                    
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