class LibvueUser {

    constructor() {
        this.header = {
            title: new Vue({
                el: '#page-user>.page-header-title>h2',
                data: {
                    HEADER: '',
                    TEXT: '',
                    LOGO: ''
                },

                methods: {
                    update: function (json) {
                        if(typeof json.HEADER !== 'undefined') {
                            this.$applyData(json.HEADER);
                        }
                    }
                }
            }),

            menu: new Vue({
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
                    PLAYCOUNT: '1'
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
                    
                }
            }
        });
    }


    update(json) {
        this.content.update(json);
        this.header.title.update(json);
    }
}
