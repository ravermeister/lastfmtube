class LibvueVideo {


    constructor() {

        // noinspection JSUnusedGlobalSymbols
        this.header = new Vue({
            el: '#video-container>h2',
            data: {
                PLAYLIST: null,
                CURRENT_TRACK: null,
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
                    if ($player.currentTrackData === null) return;
                    let elem = null;
                    if ($(event.target).prop('tagName').toUpperCase() === 'SPAN') {
                        elem = event.target;
                    } else {
                        elem = $(event.target).find('span');
                    }

                    let oldIcon = $(elem).attr('class');
                    $(elem).attr('class', PageController.icons.search.animatedBig);
                    $player.searchSong($player.currentTrackData.track, function () {
                        $(elem).attr('class', oldIcon);
                    }, true);
                }
            }
        });
    }


    update(json) {
        this.header.update(json);
    }
}

