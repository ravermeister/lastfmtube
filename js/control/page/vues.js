/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class VueController {
	
	constructor() {
		VueController.vueMethodsApplied = false;
	}
	

    static applyVueMethods() {
    	
    	if(VueController.vueMethodsApplied === true) return;
    	
        Vue.prototype.$applyData = function (json, log = false) {

            if (typeof this === 'undefined' || this === null) {
                console.error('Error, vue instance not found. Json: ', json, ', Vue: ', this);
                return;
            }

            if (log) {
                console.log('updateData', 'vue: ', this.$data, ' json: ', json);
            }
            if ('undefined' === typeof json) return;

            for (let key in this.$data) {
                if (log) console.log(key, ' exists ', (json.hasOwnProperty(key)));
                if (json.hasOwnProperty(key)) {
                    if (log) console.log('old: ' + this.$data[key] + ' | new ' + json[key]);
                    this.$data[key] = json[key];
                }
            }

            if (log) console.log('after update: ', this.$data);
        };
        Vue.prototype.$url2 = function (page, playlist, log) {
            let url = '';

            if (typeof page !== 'undefined') url = '#' + page;
            else if (typeof playlist !== 'undefined') url = '#' + playlist;
            else url = '';

            if (log) console.log('url', url, 'page', page, 'playlist', playlist);
            return url;
        };
        Vue.prototype.$url = function (menu, log = false) {
        	 console.log('for menu', menu);
            return this.$url2(menu.PAGE, menu.PLAYLIST, log);
        };

        Vue.prototype.$getMenuForPlaylist = function (playlist) {
            return $page.menu.getMenu(playlist);
        };

        Vue.prototype.$loadListMenu = function (menu, event) {
            let curArticle = $(event.target).closest('article');
            let playlistArticle = $('article[name=' + menu.PAGE + ']');
            let forceReload = !$(playlistArticle).is(curArticle);
                        
            if (!$player.isReady || !forceReload &&
                typeof menu.LDATA !== 'undefined' &&
                menu.LDATA === $page.PLAYLIST
            ) {
                return;
            }
            let showPage = function (success) {
                // DOM updated
                if (typeof menu.LDATA !== 'undefined') {
                    $page.setLoading(curArticle);
                    if (success) {

                        if (menu.PAGE === 'playlist-container') {
                            $page.setCurrentPlaylist(menu.LDATA);
                        }
                        $(playlistArticle).attr('id', menu.LDATA);
                    }

                    if (forceReload) {
                        location.replace('#' + menu.LDATA);
                    }
                } else {
                    $page.setLoading(curArticle);
                    location.replace('#' + menu.PAGE);
                }
            };

            try {
                $page.setLoading(curArticle, true);

                if (typeof menu.LDATA !== 'undefined') {
                    let pageNum = 1;
                    if (
                        'undefined' !== typeof $player.currentTrackData.track &&
                        $player.currentTrackData.track !== null &&
                        $player.currentTrackData.track.PLAYLIST === menu.LDATA
                    ) {
                        let curNr = $player.currentTrackData.track.NR;
                        if (
                            'undefined' !== typeof $player.currentTrackData.track.PLAYCOUNT_CHANGE &&
                            parseInt($player.currentTrackData.track.PLAYCOUNT_CHANGE) > 0
                        ) {
                            curNr = parseInt(curNr) - parseInt($player.currentTrackData.track.PLAYCOUNT_CHANGE);
                        }

                        let curPage = (curNr / $page.settings.general.tracksPerPage) | 0;
                        if ((curNr % $page.settings.general.tracksPerPage) > 0) curPage++;
                        if (!isNaN(curPage)) pageNum = curPage;
                    }

                    $page.loadList(pageNum, null, showPage, menu.LDATA);
                } else {
                    showPage(true);
                }

                // usage as a promise (2.1.0+, see note below)
                /**
				 * Vue.nextTick() .then(function () { // DOM updated
				 * 
				 * });
				 */
            } catch (e) {
                console.error(e);
                // showPage(false);
            }
        };
                
        VueController.vueMethodsApplied = true;
    }
	
	static createVues(){
		VueController.applyVueMethods();
		return {
            main: new LibvueMainpage(),
            
            playlist: {
            	lastfm: new LibvuePlaylist('playlist-lastfm-container'),
            	user: new LibvuePlaylist('playlist-user-container'),
            	search: new LibvuePlaylist('playlist-search-container')
            },
            video: {
            	youtube: new LibvueVideo('video-youtube-container'),
            },
            userlist: {
            	topuser: new LibvueUser('userlist-topuser-container'),
            },

            updateAll: function (json) {            	
                this.main.update(json);                
                this.playlist.lastfm.update(json);
                this.playlist.user.update(json);
                this.playlist.search.update(json);                
                this.video.youtube.update(json);
                this.userlist.topuser.update(json);
            }
        };
	}
	
	
}