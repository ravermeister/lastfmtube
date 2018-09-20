class LibvueVideo  {


    
    constructor() {

        this.header = new Vue({
            el: '#video>h2',
            data: {
                PLAYLIST_NAME: 'Playlist',
                PLAYLIST_URL: '#page-playlist',
                PLAYLIST_ID: 'default',
                NOW_PLAYING: '',
            },

            methods: {
                update: function (json) {
                    this.$applyData(json);
                },

                loadPlaylist: function (playlist) {
                    $page.setCurrentPlayList(playlist);
                    $page.myVues.playlist.update({});
                    location.href = '#page-playlist';
                }
            }
        });
    }
    
    
    update(json) {
        this.header.update(json);
    }
}
