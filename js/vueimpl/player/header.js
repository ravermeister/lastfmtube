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
		const { createApp } = Vue
		return createApp({
            el: '#'+elementId+'>h2',
            data() {
				return {
					PLAYLIST: null,
					CURRENT_TRACK: null,
					LOADING: false
				}
            },
            computed: {
                TEXT: function () {
                    let playlist = this.PLAYLIST === null ? 'playlist.lastfm' :
                        this.PLAYLIST;

                    if(this.CURRENT_TRACK !== null && 
	                	this.CURRENT_TRACK.PLAYLIST !== null && 
	                	'playlist.search' !== this.CURRENT_TRACK.PLAYLIST) {
	                	
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
                        return '';
                    }

                    let tnr = '#' + this.CURRENT_TRACK.NR;                   
                    if ('undefined' !== typeof this.CURRENT_TRACK.PLAYCOUNT_CHANGE) {
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
	                    let pageData = {};
	                	
	                	/**
	                	 * TODO: duplicate code: this is handled in control/page/loader.js#loadPage() too.
	                	 * we should merge this somehow. Maybe we can wrap it in a method into loader..
	                	 *  
						 * if playlist is topsongs, fetch sortBy option from
						 * current_track and decrease the position nr by
						 * playcount change if it was tracked
						 */
	                	if ($page.loader.pages.playlist.topsongs.value === this.CURRENT_TRACK.PLAYLIST) {
		                	let sortBy = this.CURRENT_TRACK.SORTBY;
		                	if(sortBy === null || 'undefined' === typeof sortBy 
		                		&& $page.loader.pageInfo.lastPlaylist.value === page) {	                		
		                		sortBy = $page.loader.pageInfo.lastPlaylist.data.sortby;
		                	}
		                	pageData.sortby = sortBy;
		                	
	                    	if('undefined' !== typeof this.CURRENT_TRACK.PLAYCOUNT_CHANGE) {
	                    		curNr -= this.CURRENT_TRACK.PLAYCOUNT_CHANGE;
	                    	}
	                	} 
	                    
	                	let tracksPerPage = $page.settings.general.tracksPerPage;
	                	let pageNum = parseInt(curNr / tracksPerPage);
	                	if((curNr % tracksPerPage) > 0) pageNum++;
	                	pageData.pnum = pageNum;

	                	$page.loader.loadPage(page, pageData);
                    } else {
                    	let page = $page.loader.pageInfo.lastPlaylist;
                    	$page.loader.loadPage(page.value, page.data);
                    }

                }
            }
        });
	}
}
