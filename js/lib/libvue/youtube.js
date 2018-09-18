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
                PLAYLIST_ID: 'default'
            },
            
            methods: {
                update: controller.updateData,

                loadPlaylist: function (playlist) {
                    
                    console.log(playlist);
                    page.setCurrentPlayList(playlist);            
                    console.log('after set: '+page.PLAYLIST)
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
