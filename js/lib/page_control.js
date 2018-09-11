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

    showPlayListControl(track){
        console.log(track);
        /**
        // Define a new component called button-counter
        Vue.component('playlist-control', {
            data: function () {
                return {
                    count: 0
                }
            },
            template: '                        <tr>\n' +
                '                            <td>&nbsp;</td>\n' +
                '                            <td colspan="3" style="vertical-align: middle; ">\n' +
                '                                <ul class="icons" style="display: inline">\n' +
                '                                    <li><a href="#" class="icon fa-play"><span class="label">Twitter</span></a></li>\n' +
                '                                    <li><a href="#" class="icon fa-plus"><span class="label">Facebook</span></a></li>\n' +
                '                                </ul>\n' +
                '                            </td>\n' +
                '                        </tr>'

        })
         **/
    }
}