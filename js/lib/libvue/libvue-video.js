class LibvueVideo {


    constructor() {

        this.header = new Vue({
            el: '#page-video>h2',
            data: {
                NOW_PLAYING: '',
                PLAYLIST_NAME: 'noname',
                PAGE: $page.PAGE_PLAYLIST
            },

            methods: {
                update: function (json) {
                    this.$applyData(json);
                }
            }
        });

        this.menu = new Vue({
            el: '#page-video>#player-menu',
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
                    $playlist.addUserTrack($player.CURRENT_TRACK);
                    if ($page.PLAYLIST === 'userlist') {
                        $playlist.loadUserPlayListPage($page.myVues.playlist.menu.$data.CUR_PAGE);
                    }
                },
                search: function () {
                    console.log('open search for current song');
                }
            }
        });
    }


    update(json) {
        this.header.update(json);
    }
}

