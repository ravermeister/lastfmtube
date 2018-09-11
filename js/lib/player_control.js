class PlayerController {

    constructor() {
        this.ytPlayer = null;
        this.playlist = null;
    }

    initPlayer() {

        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        var startvideo = '';//'9RMHHwJ9Eqk';
        var ytplayerwidth = '100%';
        var ytplayerheight = ($(document).height() - 325) + 'px';
        var controller = this;

        window.onYouTubeIframeAPIReady = function () {

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
                }

                /*
                ,
                events: {
                    'onReady': onYouTubePlayerReady,
                    'onStateChange': playerStateChange,
                    'onError': playerStateError
                }*/
            });
        };
    }
    setPlaylist(list) {
        switch (list) {
            case 'user':
                this.playlist = 'user';
                break;
            case 'charts':
                this.playlist = 'charts';
                break;
            default:
                this.playlist = 'default';
                break;
        }
    }

    loadSong(artist, song) {
        //console.log(artist);
        //console.log(song);
        //console.log(this.ytPlayer);
        if (this.ytPlayer == null) return;

        var needle = new Object();
        needle.artist = artist;
        needle.title = song;
        //console.log(needle);

        console.log('TODO: handle search variables');
        var vars_request_url = './php/edit_env_vars.php?action=get&key=' + encodeURIComponent(needle.artist + ' ' + needle.title);

        $.ajax(vars_request_url, {
            dataType: 'text'
        }).done(function (vars_data) {
            vars_data = stripCRLF(vars_data);

            if (vars_data == '' || vars_data != 'undefined') {
                var search_request_url = './php/do_search.php?needle=' + encodeURIComponent(needle.artist + ' ' + needle.title);
                $.ajax(search_request_url, {
                    dataType: 'json'
                }).done(function (search_data) {
                    if (search_data.length > 0 && search_data[0].video_id != '' && search_data[0].video_id != 'undefined') {
                        needle.videoId = search_data[0].video_id;
                    } else {
                        console.log('load next video');
                    }
                });
            } else needle.videoId = vars_data;

            this.ytPlayer.loadVideoById(needle.videoId);
        });
    }
}