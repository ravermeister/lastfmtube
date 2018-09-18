class VueYoutube extends DefaultLibVue {

    doInit(json) {
        let Vue = this.Vue;
        
        this.header = new Vue({
            el: '#page-ytplayer>h2',
            data: {
                PLAYLIST_NAME: 'Playlist',
                PLAYLIST_URL: '#page-playlist'
            }
        });        
    }

    doUpdate(json) {
        
    }
}