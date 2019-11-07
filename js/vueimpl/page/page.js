/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
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
                MENUS: []
            },

            methods: {

                loadMenu(menu, event) {
                    // if (!$player.isReady) return;
                    $page.loader.loadMenu(menu);
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
        	this.menu.$data.MENUS = $page.menu.getMenu('default');
        }
        
        if ('undefined' !== typeof json.listmenu) {
        	json = json.listmenu;
        }
    }
}