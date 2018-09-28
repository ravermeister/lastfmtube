class LibvueVideo {


    constructor() {

        // noinspection JSUnusedGlobalSymbols
        this.header = new Vue({
            el: '#page-video>h2',
            data: {
                NOW_PLAYING: '',
                PLAYLIST_NAME: 'noname',
                PAGE: $page.PAGE_PLAYLIST
            },
            computed: {
                
                PLAYLIST_LOGO: function () {
                    let icon = $page.icons.getPlaylistIcon(this.$data.PAGE);
                    if (icon !== null) return icon.big;
                    return $page.icons.diamond.big;
                }
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
                    $(elem).attr('class', $page.icons.search.animatedBig);
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

