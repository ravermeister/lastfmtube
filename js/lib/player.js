//copyright 2013 by Jonny Rimkus a.k.a Ravermeister

var player;
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var startvideo = ''; //'9RMHHwJ9Eqk';

function onYouTubeIframeAPIReady() {

    if ((typeof window['start_track'] !== 'undefined') && start_track.videoId != '') {
        startvideo = start_track.videoId;
    }
    if (typeof ytplayerwidth === 'undefined') {
        ytplayerwidth = '100%';
    }
    if (typeof ytplayerheight === 'undefined') {
        ytplayerheight = ($(document).height() - 325)+'px';
    }

    player = new YT.Player('player', {

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
}