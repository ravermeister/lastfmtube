class PlayerController {

    constructor() {
        this.ytPlayer = null;
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

        this.icon_loading = '<li class="fa fa-spinner faa-spin animated"></li>';
        this.icon_playing = '<i class="fa fa-play faa-flash animated" style="cursor: pointer"></i>';
        this.icon_pause = '<i class="fa fa-pause" style="cursor: pointer"></i>';
        this.icon_play = '<i class="fa fa-play" style="cursor: pointer"></i>';
    }

    initPlayer() {

        let tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        let startvideo = '';//'9RMHHwJ9Eqk';
        let ytplayerwidth = '100%';
        let ytplayerheight = ($(document).height() - 325) + 'px';

        let player = this;

        window.onYouTubeIframeAPIReady = function () {

            let onReady = function (event) {
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
                        break;

                    case player.ytStatus.PAUSED.ID:
                        break;

                    case player.ytStatus.BUFFERING.ID:
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

                playerVars: {
                    'allowfullscreen': 1,
                    'allowscriptaccess': 'always',
                    'webkitallowfullscreen': 1,
                    'mozallowfullscreen': 1,
                    'autoplay': 1,
                    'html5': 1,
                    'enablejsapi': 1,
                    'fs': 1,
                    'playerapiid': 'lastfmtube'
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
        console.log('load next song');
    }

    loadPreviousSong() {
        console.log('load prev song');
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


        let needle = new Object();
        needle.artist = track.ARTIST;
        needle.title = track.TITLE;
        needle.videoId = null;
        needle.asVar = function () {
            return encodeURIComponent(this.artist) + ' ' + encodeURIComponent(this.title);
        };


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

}