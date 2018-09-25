class LibvueUser {

    constructor() {
        this.header = {
            title: new Vue({
                el: '#page-user>.page-header-title>h2',
                data: {
                    HEADER: '',
                    TEXT: '',
                    TYPE: ''
                },
                computed: {
                    LOGO: function () {                        
                        let icon = $page.icons.getPlaylistIcon(this.$data.TYPE); 
                        return icon.big;
                    }  
                },
                methods: {
                    update: function (json) {
                        if (typeof json.HEADER !== 'undefined') {
                            this.$applyData(json.HEADER);
                        }
                    }
                }
            }),

            menu: new Vue({
                el: '#page-user>.page-header-nav',
                data: {
                    TYPE: ''
                },
                computed: {
                    MENUS: function () {
                        return this.$getMenuForPlaylist(this.TYPE);
                    }
                },

                methods: {
                    update: function (json) {
                        if (typeof json.HEADER !== 'undefined') {
                            this.TYPE = json.HEADER.TYPE;
                        }
                    }
                }
            })
        };


        this.content = new Vue({
            el: '#page-user>.page-content',
            data: {
                USER_NR: 'Nr',
                USER_NAME: 'Name',
                USER_PLAYCOUNT: 'Played',
                USER_LASTPLAY: 'Last Played',

                USER: [{
                    NR: '1',
                    NAME: 'Ravermeister',
                    LASTPLAY: '',
                    PLAYCOUNT: '1',
                    PLAY_CONTROL: ''
                }]
            },

            methods: {
                update: function (json) {
                    if (!this.$isUndefined(json.LIST_HEADER)) {
                        this.$applyData(json.LIST_HEADER);
                    }

                    if (typeof json.USER !== 'undefined') {
                        this.$applyData(json);
                    }
                },

                loadUser: function (user) {
                    if (user.PLAY_CONTROL !== 'play') return;

                    let openurl = function (success) {
                        if (success) {
                            let article = $('.playlist-container');
                            user.PLAY_CONTROL = '';
                            location.href = '#' + $(article).attr('id');
                            return;
                        }
                        user.PLAY_CONTROL = '';
                    };
                    if($page.myVues.playlist.menu.$data.LASTFM_USER_NAME === user.NAME) {
                        openurl(true);
                        return;
                    }
                    
                    user.PLAY_CONTROL = 'loading';
                    $playlist.loadPlaylistPage(1, user.NAME, openurl);
                }
            }
        });
    }


    update(json) {
        this.content.update(json);
        this.header.title.update(json);
        this.header.menu.update(json);
    }
}
