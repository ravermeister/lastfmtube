/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class LibvuePlayerHeader {
	
	static createVue() {
		return new Vue({
            el: '#video-container>h2',
            data: {
                PLAYLIST: null,
                CURRENT_TRACK: null,
                SEARCH_TRACK: null,
                LOADING: false
            },
            computed: {
                TEXT: function () {
                    let playlist = this.PLAYLIST === null ? 'lastfm' :
                        this.PLAYLIST;
                    let menu = $page.menu.getMenuItem(playlist);
                    return menu.TEXT;
                },
                LOGO: function () {
                    let playlist = this.PLAYLIST === null ? 'lastfm' :
                        this.PLAYLIST;
                    let icon = PageController.icons.getPlaylistIcon(playlist);
                    return this.LOADING ? icon.animatedBig : icon.big;
                },
                /**
                 * @return {string}
                 */
                TRACK_NR: function () {
                    let playlist = this.PLAYLIST === null ? 'lastfm' :
                        this.PLAYLIST;
                    if(this.PLAYLIST === 'search') {
                    	if($page.SEARCH_RETURN_PLAYLIST !== null) {
                    		playlist = $page.SEARCH_RETURN_PLAYLIST;
                    	} else {
                    		return '';
                    	}
                    }
                    if ((this.CURRENT_TRACK === null || this.CURRENT_TRACK.PLAYLIST !== playlist)) {
                        return '';
                    }

                    let tnr = '#' + this.CURRENT_TRACK.NR;
                    if ('undefined' !== typeof this.CURRENT_TRACK.PLAYCOUNT_CHANGE) {
                        tnr += ' ';
                        if (parseInt(this.CURRENT_TRACK.PLAYCOUNT_CHANGE) > 0) {
                            tnr += this.CURRENT_TRACK.PLAYCOUNT_CHANGE;
                        }
                        tnr += '▲';
                    }
                    return tnr;
                }
            },
            methods: {


                update: function (json) {
                    this.$applyData(json);
                },

                loadMenu: function (playlist, event) {

                    if ('search' === playlist) {
                    	/**
						 * menu typeof undefined is a dirty hack we should find
						 * a better way to prevent the search result from
						 * showing up again...
						 */
                    	if((typeof menu) === 'undefined') {
                    		playlist = $page.SEARCH_RETURN_PLAYLIST;
                    	} else {                    		
                    		let vue = this;
                    		this.$data.LOADING = true;
                    		let callback = function (success) {
                    			vue.$data.LOADING = false;
                    			location.href = '#' + menu.PLAYLIST;
                    		};
                    		$player.searchSong(this.$data.SEARCH_TRACK, callback);
                    		return;
                    	}
                    }
                    
                    if ('video' === playlist) playlist = $page.PLAYLIST;
                    if (playlist === null) playlist = 'lastfm';
                    if(playlist === $page.PLAYLIST) {
                        location.href = '#' + playlist;
                    } else {
                        let menu = $page.menu.getMenuItem(playlist);
                        this.$loadListMenu(menu, event);
                    }
                }
            }
        });
	}
}