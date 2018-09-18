class VueBase extends DefaultLibVue {

    
    doInit(json) {
        let Vue = this.Vue;
        
        this.logo = new Vue({
            el: 'header>.logo'
        });

        this.content = new Vue({
            el: 'header>.content',
            data: {
                PAGE_HEADER: json.base.TITLE,
                PAGE_WELCOME: json.base.TEXT
            }
        });

        this.menu = new Vue({
            el: 'header>nav',
            data: {
                MENUS: json.base.MENU
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
                            this.PLAYLIST = playlist;
                            page.loadPlaylistPage(1, null, showPage);
                            return;
                        }
                        showPage(true);
                    }
                }
            }
        });
        
        this.isReady = true;
    }

}