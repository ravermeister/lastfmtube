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
                CURRENT_TRACK: new TrackData(),
                SEARCH_TRACK: new TrackData(),
                LOADING: false
            },
            computed: {
                TEXT: function () {
                    let playlist = this.PLAYLIST === null ? 'playlist.lastfm' :
                        this.PLAYLIST;

                    if(this.CURRENT_TRACK !== null && 
	                	this.CURRENT_TRACK.PLAYLIST !== null && 
	                	'playlist.search' !== this.CURRENT_TRACK.PLAYLIST &&
	                	'undefined' !== this.CURRENT_TRACK.PLAYLIST) {
	                	
	                	playlist = this.CURRENT_TRACK.PLAYLIST;
                    }
                    
                    let menu = $page.menu.getMenuItem(playlist);
                    return menu.TEXT;
                },
                LOGO: function () {
                    let playlist = this.PLAYLIST === null ? 'playlist.lastfm' :
                        this.PLAYLIST;
                    
                    if(this.CURRENT_TRACK !== null && 
	                	this.CURRENT_TRACK.PLAYLIST !== null && 
	                	'playlist.search' !== this.CURRENT_TRACK.PLAYLIST) {
	                	
	                	playlist = this.CURRENT_TRACK.PLAYLIST;
                    }

                    let icon = $page.icons.getPageIcon(playlist); 
                    return this.LOADING ? icon.animatedBig : icon.big;
                },
                /**
				 * @return {string}
				 */
                TRACK_NR: function () {
                    let playlist = this.PLAYLIST === null ? 'playlist.lastfm' :
                        this.PLAYLIST;
                    if(this.PLAYLIST === 'playlist.search') {
                    	if($page.SEARCH_RETURN_PLAYLIST !== null) {
                    		playlist = $page.SEARCH_RETURN_PLAYLIST;
                    	} else {
                    		return '';
                    	}
                    } 
                    
                    if(this.CURRENT_TRACK !== null && 
	                	this.CURRENT_TRACK.PLAYLIST !== null && 
	                	'playlist.search' !== this.CURRENT_TRACK.PLAYLIST) {
	                	
	                	playlist = this.CURRENT_TRACK.PLAYLIST;
                    }


                    if ((this.CURRENT_TRACK === null || this.CURRENT_TRACK.PLAYLIST !== playlist)) {
                    	console.log('will not update track nr!');
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

                    if(this.CURRENT_TRACK !== null && 
	                	this.CURRENT_TRACK.PLAYLIST !== null && 
	                	'playlist.search' !== this.CURRENT_TRACK.PLAYLIST) {

	                	let page = $page.loader.pages.getByValue(this.CURRENT_TRACK.PLAYLIST);
	                	let curNr = this.CURRENT_TRACK.NR;
	                	let tracksPerPage = $page.settings.general.tracksPerPage;
	                	let pageNum = parseInt(curNr / tracksPerPage);
	                	if((curNr % tracksPerPage) > 0) pageNum++;
	                	
	                	$page.loader.loadPage(page, {
	                		pnum: pageNum
	                	});
                    } else {
                    	let page = $page.loader.pageInfo.lastPlaylist;
                    	$page.loader.loadPage(page.value, page.data);
                    }

                }
            }
        });
	}
}