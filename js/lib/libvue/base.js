class VueBase extends DefaultLibVue {

    constructor(page) {
        super(page);

        let Vue = this.Vue;

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
                    URL: '',
                    NAME: '',
                    ARGS: '',
                    PLAYLIST: ''
                }]
            },
            methods: {
                loadMenu(menu) {
                    if (!player.isReady) return;
                    page.setPageLoading(true);
                    let playlist = 'default';

                    
                    if (typeof menu.ARGS !== 'undefined' && ('PLAYLIST' in menu.ARGS)) {
                        playlist = menu.ARGS['PLAYLIST'];
                    }

                    let showPage = function (success) {
                        page.setPageLoading();
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
                }
            }
        });
    }


    update(json) {
        
        if(!this.isUndefined(json)) {
            this.content.$data.PAGE_HEADER = json.TITLE;
            this.content.$data.PAGE_WELCOME = json.TEXT;            
        }        

        if(!this.isUndefined(json.MENU)) {
            this.menu.$data.MENUS = json.MENU;    
        }        
    }
}