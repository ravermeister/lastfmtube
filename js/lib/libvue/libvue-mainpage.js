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
                    LDATA: '',
                    PAGE: ''
                }]
            },

            methods: {

                loadMenu(menu, event) {
                    // if (!$player.isReady) return;
                    $page.load(menu.PAGE, menu.LDATA);
                }
            }
        });
    }


    update(json) {
        if ('undefined' !== typeof json.content) {
            this.content.$data.PAGE_HEADER = json.content.TITLE;
            this.content.$data.PAGE_WELCOME = json.content.TEXT;
        }

        if ('undefined' !== typeof json.basemenu) {
        	console.log('>>>>>');
        	console.log(json.basemenu);
            this.menu.$data.MENUS = json.basemenu;
        }
    }
}