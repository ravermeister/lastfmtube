/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class LibvuePlayerHeader {
	
	static createVue(elementId) {
		return new Vue({
            el: '#'+elementId+'>h2',
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
                    if(menu === null) {
                    	console.log('playlist >>', playlist);
                    	return '';                    	
                    }
                    return menu.TEXT;
                },
                LOGO: function () {
                    let playlist = this.PLAYLIST === null ? 'lastfm' :
                        this.PLAYLIST;
                    let icon = $page.icons.getPlaylistIcon(playlist);
                    if(icon === null) return ''; 
                    
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
                	let page = $page.loader.pages.getByValue(playlist);
                	console.log(page, '<<<< page | playlist >>>>', playlist);
                	$page.loader.loadPage(page);
                }
            }
        });
	}
}