class PageController {

    constructor(vue) {
        this.vue = vue;
        this.vueMap = new Array();
        this.quickPlay = $('<i class="icon fa-play" style="cursor: pointer;"></i>');

    }

    init() {
        let vue = this.vue;
        let vueMap = this.vueMap;
        let request = 'php/json/JsonHandler.php?api=page&data=page';
        $.getJSON(request).done(function (json) {
            //console.log(JSON.stringify(json.data.value));
            for (let key in json.data.value) {
                vueMap[key] = new vue(json.data.value[key]);
            }
        });

    }

    loadPlayListPage(list, pageOffset = 0) {

        let vueMap = this.vueMap;
        let lfmUser = $('#playlist_lastfmuser').val();
        let lfmPage = parseInt($('#playlist_page').val()) + parseInt(pageOffset);

        let request = 'php/json/JsonHandler.php?api=page&data=playlist' +
            '&type=' + list +
            '&user=' + lfmUser +
            '&page=' + lfmPage
        ;

        $.getJSON(request, {
            dataType: 'json'
        }).done(function (json) {
            vueMap['PLAYLIST_HEADER'].LASTFM_USER_NAME = json.data.value['PLAYLIST_HEADER'].data.LASTFM_USER_NAME;
            vueMap['PLAYLIST_HEADER'].LASTFM_USER_URL = json.data.value['PLAYLIST_HEADER'].data.LASTFM_USER_URL;
            vueMap['PLAYLIST_NAV'].CUR_PAGE = json.data.value['PLAYLIST_NAV'].data.CUR_PAGE;
            vueMap['PLAYLIST_NAV'].LASTFM_USER_NAME = json.data.value['PLAYLIST_NAV'].data.LASTFM_USER_NAME;
            vueMap['PLAYLIST_TRACKS'].TRACKS = json.data.value['PLAYLIST_TRACKS'].data.TRACKS;
        });
    }

    getVue(vueKey) {
        return (typeof this.vueMap[vueKey] !== 'undefined') ? this.vueMap[vueKey] : null;
    }

    showQuickPlay(TRACK, elem, show) {

        if(player.isCurrentTrackNr(TRACK.NR)) return;
        $(elem).unbind('click');
        if (show) {
            $(elem).click(function () {
                $(elem).html(TRACK.NR);
                player.setCurrentTrack($(elem).closest('tr'));
                player.loadSong(TRACK);
            }).html(this.quickPlay);

        } else {
            $(elem).html(TRACK.NR);
        }
    }


    togglePlayerControl(trackData, clear) {
        let vueMap = this.vueMap;
        let wasActive = trackData.PLAY_CONTROL;
        if (clear) {
            for (let cnt = 0; cnt < vueMap['PLAYLIST_TRACKS'].TRACKS.length; cnt++) {
                vueMap['PLAYLIST_TRACKS'].TRACKS[cnt].PLAY_CONTROL = false;
            }
        }

        trackData.PLAY_CONTROL = !wasActive;
    }
}