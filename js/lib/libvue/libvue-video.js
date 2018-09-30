class LibvueVideo {


    constructor() {

        // noinspection JSUnusedGlobalSymbols
        this.header = new Vue({
            el: '#video-container>h2',
            data: {
                PLAYLIST: null,
                CURRENT_TRACK: null,
                SEARCH_TRACK: null,
                LOADING: false,
                TEXT: ''
            },
            computed: {
                MENU: function () {
                    let playlist = PageController.article.playlist.name;
                    if(this.CURRENT_TRACK !== null) playlist =  this.CURRENT_TRACK.PLAYLIST;
                    else if(this.PLAYLIST !== null) playlist =  this.PLAYLIST;
                    return {
                        PLAYLIST: playlist
                    };
                }, 
                
                LOGO: function () {
                    let playlist = PageController.article.playlist.name;
                    if(this.CURRENT_TRACK !== null) playlist =  this.CURRENT_TRACK.PLAYLIST;
                    else if(this.PLAYLIST !== null) playlist =  this.PLAYLIST;
                    
                    let icon = PageController.icons.getPlaylistIcon(playlist);                    
                    return this.$data.LOADING ? icon.animatedBig : icon.big;
                }
            },
            methods: {
                
                
                update: function (json) {                    
                    this.$applyData(json);
                },
                
                loadMenu: function (menu, event) {
                    if(menu.PLAYLIST === 'search') {
                        let vue = this;
                        this.$data.LOADING = true;
                        let callbak = function(success) {                            
                            vue.$data.LOADING = false;
                            location.href = '#' + menu.PLAYLIST;
                        };
                        $player.searchSong(this.$data.SEARCH_TRACK, callbak);
                        return;
                    }
                   
                    this.$loadListMenu(menu, event);
                }
            }
        });

        this.menu = new Vue({
            el: '#video-container>#player-menu',
            data: {
                PLAYSTATE: ''
            },
            methods: {
                togglePlay(play = null) {
                    if (play === true && !$player.isPlaying()) {
                        $player.ytPlayer.playVideo();
                    } else if (play === false && !$player.isPaused()) {
                        $player.ytPlayer.pauseVideo();
                    } else if ($player.isPlaying()) {
                        $player.ytPlayer.pauseVideo();
                    } else {
                        $player.ytPlayer.playVideo();
                    }
                },
                
                prev: function () {
                    $player.loadPreviousSong();
                },
                next: function () {
                    $player.loadNextSong();
                },
                addToUserList: function () {
                    $playlist.addUserTrack($player.currentTrackData.track);
                    if ($page.PLAYLIST === 'userlist') {
                        $playlist.loadUserPlayListPage($page.myVues.playlist.menu.$data.CUR_PAGE);
                    }
                },
                search: function (event) {
                    if ($page.myVues.youtube.header.SEARCH_TRACK === null) return;
                    
                    $page.myVues.youtube.header.$data.LOADING = true;
                    $player.searchSong($page.myVues.youtube.header.SEARCH_TRACK, function () {
                        $page.myVues.youtube.header.$data.LOADING = false;
                    }, true);
                }
            }
        });
    }


    update(json) {
        this.header.update(json);
    }
}

