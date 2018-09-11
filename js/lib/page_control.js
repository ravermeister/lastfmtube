class PageController {

    constructor(vue) {
        this.vue = vue;
        this.vueMap = new Array();
    }

    init() {

        var vue = this.vue;
        var vueMap = this.vueMap;

        $.getJSON(
            'php/json/JsonHandler.php?api=page&data=page'
        ).done(function (json) {
            //console.log(JSON.stringify(json.data.value));
            for (var key in json.data.value) {
                vueMap[key] = new vue(json.data.value[key]);
            }
        });

    }

    loadPlayListPage(list, pageOffset=0) {
        var vue = this.vue;
        var vueMap = this.vueMap;
        var lfmUser = $('#playlist_lastfmuser').val();
        var lfmPage = parseInt($('#playlist_page').val()) + parseInt(pageOffset);


        $.getJSON(
            'php/json/JsonHandler.php?api=page&data=playlist&type=' + list + '&user=' + lfmUser + '&page=' + lfmPage
        ).done(function (json) {
            vueMap['PLAYLIST_HEADER'].LASTFM_USER_NAME = json.data.value['PLAYLIST_HEADER'].data.LASTFM_USER_NAME;
            vueMap['PLAYLIST_HEADER'].LASTFM_USER_URL = json.data.value['PLAYLIST_HEADER'].data.LASTFM_USER_URL;
            vueMap['PLAYLIST_NAV'].CUR_PAGE = json.data.value['PLAYLIST_NAV'].data.CUR_PAGE;
            vueMap['PLAYLIST_NAV'].LASTFM_USER_NAME = json.data.value['PLAYLIST_NAV'].data.LASTFM_USER_NAME;
            vueMap['PLAYLIST_TRACKS'].TRACKS = json.data.value['PLAYLIST_TRACKS'].data.TRACKS;
        });
    }

    showPlayerControl(track, clear) {
        var vueMap = this.vueMap;

        track.PLAY_CONTROL = !track.PLAY_CONTROL;
        if(clear) {
            for(var cnt = 0; cnt<vueMap['PLAYLIST_TRACKS'].TRACKS.length; cnt++) {
                if(track.NR==vueMap['PLAYLIST_TRACKS'].TRACKS[cnt].NR)
                    continue;
                vueMap['PLAYLIST_TRACKS'].TRACKS[cnt].PLAY_CONTROL = false;
            }
        }


    }
}