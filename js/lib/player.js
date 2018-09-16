class ChartTimer {

}

class PlayerController {

    constructor() {
        this.ytPlayer = null;
        this.isReady = false;
        this.CURRENT_TRACK = null;
        this.CURRENT_TRACK_NR = null;
        this.ytStatus = new Object();

        this.ytStatus.UNSTARTED = new Object();
        this.ytStatus.UNSTARTED.ID = -1;
        this.ytStatus.UNSTARTED.NAME = 'unstarted';

        this.ytStatus.ENDED = new Object();
        this.ytStatus.ENDED.ID = 0;
        this.ytStatus.ENDED.NAME = 'ended';

        this.ytStatus.PLAYING = new Object();
        this.ytStatus.PLAYING.ID = 1;
        this.ytStatus.PLAYING.NAME = 'playing';

        this.ytStatus.PAUSED = new Object();
        this.ytStatus.PAUSED.ID = 2;
        this.ytStatus.PAUSED.NAME = 'paused';

        this.ytStatus.BUFFERING = new Object();
        this.ytStatus.BUFFERING.ID = 3;
        this.ytStatus.BUFFERING.NAME = 'buffering';

        this.ytStatus.CUED = new Object();
        this.ytStatus.CUED.ID = 5;
        this.ytStatus.CUED.NAME = 'vide cued';


        this.icon_loading = '<i class="fa fa-spinner faa-spin animated"></i>';
        this.icon_playing = '<i class="fa fa-play faa-flash animated" style="cursor: pointer"></i>';
        this.icon_pause = '<i class="fa fa-pause" style="cursor: pointer"></i>';
        this.icon_play = '<i class="fa fa-play" style="cursor: pointer"></i>';
        this.icon_search = '<i class="icon fa-search"></i>';
    }

    initPlayer() {
        
        let startvideo = '';//'9RMHHwJ9Eqk';
        let ytplayerwidth = '100%';
        let ytplayerheight = ($(document).height() - 325) + 'px';

        let player = this;

        window.onYouTubeIframeAPIReady = function () {
            
            let nowPlaying = function(track) {
                page.vueMap['YTPLAYER_HEADER'].$data.NOW_PLAYING = player.ytPlayer.getVideoData().title;
            };

            let onReady = function (event) {
                player.isReady = true;
                console.log('youtube player ready');
            };

            let onStateChange = function (event) {

                switch (event.data) {
                    case player.ytStatus.UNSTARTED.ID:
                        break;
                    case player.ytStatus.ENDED.ID:
                        player.loadNextSong();
                        break;

                    case player.ytStatus.PLAYING.ID:
                        if (player.CURRENT_TRACK != null) {
                            player.CURRENT_TRACK.NR = player.icon_playing;
                        }
                        nowPlaying(player.CURRENT_TRACK);
                        break;

                    case player.ytStatus.PAUSED.ID:
                        if (player.CURRENT_TRACK != null) {
                            player.CURRENT_TRACK.NR = player.icon_pause;
                        }
                        break;

                    case player.ytStatus.BUFFERING.ID:
                        if (player.CURRENT_TRACK != null) {
                            player.CURRENT_TRACK.NR = player.icon_loading;
                        }
                        break;

                    case player.ytStatus.CUED.ID:
                        break;
                }
            };
            let onError = function (event) {
                console.log('youtube player error');
            };


            player.ytPlayer = new YT.Player('player', {

                height: ytplayerheight,
                width: ytplayerwidth,
                videoId: startvideo,
                crossDomain: true,

                playerVars: {
                    'allowfullscreen': 1,
                    'allowscriptaccess': 'always',
                    'webkitallowfullscreen': 1,
                    'mozallowfullscreen': 1,
                    'autoplay': 1,
                    'html5': 1,
                    'enablejsapi': 1,
                    'fs': 1
                },

                events: {
                    'onReady': onReady,
                    'onStateChange': onStateChange,
                    'onError': onError
                }
            });
        };
    }


    loadNextSong() {
        if (this.CURRENT_TRACK == null) return;
        let tracks = page.vueMap['PLAYLIST_TRACKS'].$data.TRACKS;
        let index = tracks.indexOf(this.CURRENT_TRACK);

        if ((index + 1) >= tracks.length) {
            let playlist = page.vueMap['PLAYLIST_NAV'];
            let curPage = playlist.$data.CUR_PAGE;
            let maxPages = playlist.$data.MAX_PAGES;
            let user = playlist.$data.LASTFM_USER_NAME;
            if ((curPage + 1) > maxPages) curPage = 1;
            else curPage++;

            page.loadPlaylistPage(user, curPage, 'default', function (success) {
                if (!success) return;

                let tracks = page.vueMap['PLAYLIST_TRACKS'].$data.TRACKS;
                player.loadSong(tracks[0]);
            });

            return;
        } else if (index < 0) {
            index = 0;
        } else {
            index++;
        }

        this.loadSong(tracks[index]);
    }

    loadPreviousSong() {
        if (this.CURRENT_TRACK == null) return;
        let tracks = page.vueMap['PLAYLIST_TRACKS'].$data.TRACKS;
        let index = tracks.indexOf(this.CURRENT_TRACK);

        if ((index - 1) < 0) {
            let playlist = page.vueMap['PLAYLIST_NAV'];
            let curPage = playlist.$data.CUR_PAGE;
            let maxPages = playlist.$data.MAX_PAGES;
            let user = playlist.$data.LASTFM_USER_NAME;
            if ((curPage - 1) > maxPages) curPage = maxPages;
            else curPage--;

            page.loadPlaylistPage(user, curPage, 'default', function (success) {
                if (!success) return;

                let tracks = page.vueMap['PLAYLIST_TRACKS'].$data.TRACKS;
                player.loadSong(tracks[tracks.length - 1]);
            });


            index = tracks.length - 1;
        } else if (index < 0) {
            index = 0;
        } else {
            index--;
        }

        this.loadSong(tracks[index]);
    }

    setCurrentTrack(track) {
        if (this.CURRENT_TRACK != null) {
            this.CURRENT_TRACK.NR = this.CURRENT_TRACK_NR;
            this.CURRENT_TRACK_NR = null;
        }
        this.CURRENT_TRACK_NR = track.NR;
        this.CURRENT_TRACK = track;
    }

    loadSong(track) {
        //console.log(artist);
        //console.log(title);
        //console.log(this.ytPlayer);
        if (this.ytPlayer == null) return;

        this.setCurrentTrack(track);
        track.NR = this.icon_loading;


        let needle = page.createNeedle(track);
        if(needle.videoId!=null && needle.videoId.length>0) {
            needle.videoId = vars.data.value.VALUE;
            player.loadVideoByNeedle(needle);
            return;
        }

        let request = './php/json/JsonHandler.php?api=vars&data=search&name=' + needle.asVar();
        let player = this;

        $.ajax(request, {
            dataType: 'json'
        }).done(function (vars) {

            if (!vars.data.value.EXISTS) {
                request = './php/json/JsonHandler.php?api=videos&data=search&needle=' + needle.asVar();
                $.ajax(request, {
                    dataType: 'json'
                }).done(function (search) {

                    needle.videoId = (search.data.value.length > 0 && search.data.value[0].video_id !== 'undefined') ?
                        search.data.value[0].video_id : '';

                    if (needle.videoId != null && needle.videoId.length == 0) {
                        console.log('load next song no video was found');
                        return;
                    }

                    player.loadVideoByNeedle(needle);
                });
            } else {
                needle.videoId = vars.data.value.VALUE;
                player.loadVideoByNeedle(needle);
            }
        });
    }

    loadVideoByNeedle(needle) {
        if (typeof needle !== 'undefined' && typeof needle.videoId !== 'undefined' && needle.videoId.length > 0) {

            player.ytPlayer.loadVideoById(needle.videoId);
        } else {
            console.error('invalid parameter for loadVideoByNeedle');
            console.error(needle);
        }
    }


    isCurrentTrack(track) {        
        return this.CURRENT_TRACK != null &&
            this.CURRENT_TRACK == track || (
                this.CURRENT_TRACK_NR == track.NR &&
                this.CURRENT_TRACK.PLAYLIST == track.PLAYLIST
            );
    }
}