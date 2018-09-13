class PlayerController {

    constructor() {
        this.ytPlayer = null;
        this.currentTrack = null;
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

        this.icon_loading = $('<li class="fa fa-spinner faa-spin animated"></li>');
        this.icon_play = $('<i class="fa fa-play faa-flash animated" style="cursor: pointer"></i>');
        this.icon_pause = $('<i class="fa fa-pause" style="cursor: pointer"></i>');

    }

    initPlayer() {

        let tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        let startvideo = '';//'9RMHHwJ9Eqk';
        let ytplayerwidth = '100%';
        let ytplayerheight = ($(document).height() - 325) + 'px';

        let controller = this;
        let pageControl = page;

        window.onYouTubeIframeAPIReady = function () {

            let onReady = function (event) {
                console.log('youtube player ready');
            };
            let onStateChange = function (event) {


                switch (event.data) {
                    case controller.ytStatus.UNSTARTED.ID:
                        console.log(controller.ytStatus.UNSTARTED.NAME);
                        break;
                    case controller.ytStatus.ENDED.ID:
                        console.log(controller.ytStatus.ENDED.NAME);
                        if (controller.currentTrack == null) return;

                        console.log(controller.currentTrack);
                        console.log(controller.currentTrack.element);

                        let rows = $(controller.currentTrack.nr.element).parent().parent().children();
                        //let index = $(controller.currentTrack.element).parent().find('tr').index(controller.currentTrack.element);
                        console.log(rows);
                        /**
                         let trackElem = $(controller.currentTrack.element).next();

                         console.log((controller.currentTrack.element));
                         console.log(trackElem);

                         let track = new Object();
                         track.ARTIST = $(trackElem).find('.TRACK_ARTIST').text();
                         track.TITLE = $(trackElem).find('.TRACK_TITLE').text();
                         track.videoId = '';

                         controller.loadSong(track, trackElem);
                         **/
                        break;

                    case controller.ytStatus.PLAYING.ID:
                        console.log(controller.ytStatus.PLAYING.NAME);
                        if (controller.currentTrack == null) return;

                        controller.currentTrack.nr.element.unbind('click');
                        $(controller.currentTrack.nr.element).click(function () {
                            let elem = $(this).find('i').first();
                            if ($(controller.icon_play).is(elem)) {
                                controller.ytPlayer.pauseVideo();
                                $(this).html(controller.icon_pause);
                            } else if ($(controller.icon_pause).is(elem)) {
                                controller.ytPlayer.playVideo();
                                $(this).html(controller.icon_play);
                            }
                        });

                        $(controller.currentTrack.nr.element).html(controller.icon_play);
                        break;

                    case controller.ytStatus.PAUSED.ID:
                        console.log(controller.ytStatus.PAUSED.NAME);
                        break;

                    case controller.ytStatus.BUFFERING.ID:
                        console.log(controller.ytStatus.BUFFERING.NAME);
                        break;

                    case controller.ytStatus.CUED.ID:
                        console.log(controller.ytStatus.CUED.NAME);
                        break;
                }
            };
            let onError = function (event) {
                console.log('youtube player error');
            };

            controller.ytPlayer = new YT.Player('player', {

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
                    'playerapiid': 'lastfmplayer'
                },

                events: {
                    'onReady': onReady,
                    'onStateChange': onStateChange,
                    'onError': onError
                }
            });
        };
    }


    resetCurrentTrack() {
        if (this.currentTrack == null) return;

        $(this.currentTrack.nr.element)
            .text(this.currentTrack.nr.text)
            .unbind('click');
    }


    setCurrentTrack(track) {

        this.resetCurrentTrack();

        let trackNr = $(track).find('.TRACK_NR');
        this.currentTrack = new Object();
        this.currentTrack.elemnt = track;

        this.currentTrack.nr = new Object();
        this.currentTrack.nr.element = trackNr;
        this.currentTrack.nr.attrClass = $(trackNr).attr('class');
        this.currentTrack.nr.text = $(trackNr).text();

        //console.log('set curtrack: '+this.currentTrack.nr.text);
        //console.log(trackNr);
        //console.log($(trackNr).html());
    }

    isCurrentTrackNr(trackNr) {
        if (this.currentTrack == null) return false;
        return this.currentTrack.nr.text == trackNr;
    }

    loadSong(track, elems) {

        if (typeof track === 'undefined') {
            console.log('TRACK is undefined!');
            return;
        }

        if (typeof elems !== 'undefined' && elems !== null) {
            if (typeof elems.TRACK_CONTROL_ROW !== 'undefined') {
                this.setCurrentTrack($(elems.TRACK_CONTROL_ROW).prev());
            }
        }

        this.loadSongByTitle(track.ARTIST, track.TITLE);
    }

    loadSongByTitle(artist, title) {
        //console.log(artist);
        //console.log(title);
        //console.log(this.ytPlayer);
        if (this.ytPlayer == null) return;

        let needle = new Object();
        needle.artist = artist;
        needle.title = title;
        needle.videoId = null;
        needle.asVar = function () {
            return encodeURIComponent(artist) + ' ' + encodeURIComponent(title);
        };


        let request = './php/json/JsonHandler.php?api=vars&data=search&name=' + needle.asVar();
        let player = this;

        if (this.currentTrack != null) {
            $(this.currentTrack.nr.element).html(this.icon_loading);
        }

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
            this.ytPlayer.loadVideoById(needle.videoId);
        } else {
            console.error('invalid parameter for loadVideoByNeedle');
            console.error(needle);
        }
    }
}