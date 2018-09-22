class LibvueUser {

    constructor() {

        this.title = new Vue({
            el: '#page-user>.page-header-title>h2',
            data: {
                HEADER: '',
                TEXT: '',
                LOGO: ''
            },

            methods: {
                update: function (json) {
                    this.$applyData(json);
                },
            }
        });
        
        this.menu = new Vue({
            el: '#page-user>.page-header-nav',
            data: {
                PLAYLIST: 'page-playlist'
            },
            computed: {
                MENUS: function () {
                    return this.$getMenuForPlaylist(this.PLAYLIST);
                }
            },
            
            methods: {
                update: function (json) {
                    this.$applyData(json);
                },
            }
        }); 
    }


    update(json) {
        console.log('update userlist with json ', json);
        this.title.update(json.HEADER);
        this.menu.update(json.HEADER_MENU);
    }
}
