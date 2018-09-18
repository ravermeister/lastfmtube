class VueYoutube extends DefaultLibVue {

    constructor(page) {
        super(page);
        let Vue = this.Vue;
        let controller = this;
        
        this.header = new Vue({
            el: '#page-ytplayer>h2',
            data: {
                PLAYLIST_NAME: 'Playlist',
                PLAYLIST_URL: '#page-playlist',
                PLAYLIST_ID: 'default',
                NOW_PLAYING: '', 
            },
            
            methods: {
                update: controller.updateData,

                loadPlaylist: function (playlist) {
                    
                    page.setCurrentPlayList(playlist);
                    page.myVues.playlist.update({});
                    location.href = '#page-playlist';
                }                
            }
        });
    }
    
    
    update(json) {
        this.header.update(json);
    }
}
