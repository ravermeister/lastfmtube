class LibvueUser {

    constructor() {
        this.header = {
            title: new Vue({
                el: '#page-user>.page-header-title>h2',
                data: {
                    HEADER: '',
                    TEXT: '',
                    TYPE : '',    
                    LOGO: ''
                },
                
                methods: {
                    update: function (json) {
                        if(typeof json.HEADER !== 'undefined') {
                            this.$applyData(json.HEADER);
                            
                            let icon = $page.icons.getPlaylistIcon(this.$data.TYPE);
                            this.$data.LOGO = icon.big;
                        }
                    }
                }
            }),

            menu: new Vue({
                el: '#page-user>.page-header-nav',
                data: {
                    TYPE: '',
                },                
                computed: {
                    MENUS: function () {
                        return this.$getMenuForPlaylist(this.TYPE);
                    }
                },

                methods: {
                    update: function (json) {
                        if(typeof json.HEADER !== 'undefined') {
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
        this.header.menu.update(json);
    }
}
