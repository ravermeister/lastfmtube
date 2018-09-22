class LibvueVideo {


    constructor() {

        this.header = new Vue({
            el: '#page-video>h2',
            data: {
                NOW_PLAYING: '',
                PLAYLIST_NAME: 'noname',
                PAGE: $page.PAGE_PLAYLIST,
            },
            
            methods: {
                update: function (json) {
                    this.$applyData(json);
                },
            }
        });
    }
    
    
    update(json) {
        this.header.update(json);
    }
}

