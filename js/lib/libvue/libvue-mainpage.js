class LibvueMainpage {

    constructor() {

        this.logo = new Vue({
            el: 'header>.logo',
            data: {
                PAGE_LOADER: 'fa fa-spinner faa-spin animated fa-3x'
            }
        });

        this.content = new Vue({
            el: 'header>.content',
            data: {
                PAGE_HEADER: 'Last.fm Youtbe Radio',
                PAGE_WELCOME: 'under construction'
            }
        });

        this.menu = new Vue({
            el: 'header>nav',
            data: {
                TITLE: '',
                TEXT: '',
                MENUS: [{
                    NAME: '',
                    ARGS: '',
                    PLAYLIST: ''
                }]
            },
            methods: {
                loadMenu(menu, event) {                        
                    if (!$player.isReady) return;
                    $page.setPageLoading(true);
                    let url = ($(event.target).attr('href'));
                    
                    let showPage = function (success) {
                        // usage as a promise (2.1.0+, see note below)
                        Vue.nextTick()
                            .then(function () {
                                $page.setPageLoading();
                                if (!success) return;
                                location.href = url;
                                // DOM updated
                            })
                    };
                    
                    
                    if (menu.PLAYLIST != null) {
                        $page.setCurrentPlayList(menu.PLAYLIST);
                        $playlist.loadPlaylistPage(1, null, showPage, menu.PLAYLIST);
                        return;
                    }
                    showPage(true);
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