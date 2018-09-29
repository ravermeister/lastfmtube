class LibvueUser {

    constructor() {
        this.header = {
            title: new Vue({
                el: '#user-container>.page-header-title>h2',
                data: {
                    HEADER: '',
                    TEXT: '',
                    TYPE: '',
                    LOADING: false
                },
                
                computed: {
                    LOGO: function () {
                        let icon = PageController.icons.getPlaylistIcon(this.$data.TYPE);
                        return this.$data.LOADING ? icon.animatedBig : icon.big;
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
                el: '#user-container>.page-header-nav',
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
            el: '#user-container>.page-content',
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
                    PLAY_CONTROL: '',
                    PLAYCOUNT_CHANGE: ''
                }]
            },

            methods: {
                update: function (json) {
                    if (typeof json.LIST_HEADER !== 'undefined') {
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
                            let article = $('article[name=playlist-container]');
                            user.PLAY_CONTROL = '';
                            $page.myVues.userlist.header.title.$data.LOADING = false;
                            location.href = '#' + $(article).attr('id');
                            return;
                        }
                        user.PLAY_CONTROL = '';
                        $page.myVues.userlist.header.title.$data.LOADING = false;
                        
                    };
                    
                    user.PLAY_CONTROL = 'loading';
                    $page.myVues.userlist.header.title.$data.LOADING = true;
                    $playlist.loadDefaultPlayListPage(1, user.NAME, openurl, 'lastfm');
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
