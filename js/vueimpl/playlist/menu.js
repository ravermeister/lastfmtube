/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class LibvuePlaylistMenu {
	
	static createVue(elementId){
		return new Vue({
            el: '#'+elementId+'>.page-nav',
            data: {
                LASTFM_USER_NAME_LABEL: 'User',
                LASTFM_USER_NAME: '',
                CUR_PAGE_LABEL: 'Page',
                PAGES_OF_LABEL: 'of',
                MAX_PAGES: 0,
                CUR_PAGE: 0,
                PLAYLIST_LOAD: 'Load',
                PLAYLIST: '',
                SORTBY: {
                	LABEL: 'Sort by',
                	VALUES: ['Playcount', 'Date'],
                	SELECTED: 'Playcount',                	
                },

                SAVED_VIDEO_ID: '',
                SEARCH_VIDEO_ID: '',
                SEARCH_NEEDLE: null,
                SEARCH_RESULT: []
            },

            computed: {

                /**
				 * @return {string}
				 */
                SAVED_TITLE: function () {
                    return this.SAVED_VIDEO_ID !== null &&
                    this.SAVED_VIDEO_ID.length > 0 &&
                    this.SAVED_VIDEO_ID === this.SEARCH_VIDEO_ID ?
                        'Saved' : '&nbsp;';
                }
            },

            methods: {            	
            	sortBy: function(event) { 
            		let sortBy = $(event.target).children('option:selected').val();
            		this.SORTBY.SELECTED = sortBy;
                    $page.loader.loadPage($page.loader.pageInfo.currentPage.value, {
                    	pnum: this.$data.CUR_PAGE,
                    	sortby: sortBy
                    });         		
            		return true;
            		
            	},
                loadPage: function (user, pageNum) {
                	let sortBy = $(this.$el).find('#topsongs-sortby')
                		.children('option:selected').val(); 

                	pageNum = parseInt(pageNum);
                	let maxPages = parseInt(this.$data.MAX_PAGES);                	
                	if(pageNum < 0) {
                		pageNum = 1;
                	} else if(pageNum > maxPages) {
                		pageNum = maxPages;
                	} else if(pageNum === this.$data.CUR_PAGE) {
                		return;
                	}

                    $page.loader.loadPage($page.loader.pageInfo.currentPage.value, {
                    	pnum: pageNum,
                    	lfmuser: user,
                    	sortby: sortBy
                    });
                },

                loadNextPage: function (user = null, pageNum = null, maxPages = null) {
                	if(user === null) user = this.$data.LASTFM_USER_NAME;
                	if(pageNum === null) pageNum = parseInt(this.$data.CUR_PAGE);
                	if(maxPages === null) maxPages = parseInt(this.$data.MAX_PAGES);                	
                    
                	pageNum++;
                    if (pageNum > maxPages) pageNum = 1;
                    this.loadPage(user, pageNum);
                },

                loadPrevPage: function (user = null, pageNum = null, maxPages = null) {
                	if(user === null) user = this.$data.LASTFM_USER_NAME;
                	if(pageNum === null) pageNum = parseInt(this.$data.CUR_PAGE);
                	if(maxPages === null) maxPages = parseInt(this.$data.MAX_PAGES);   
                	
                    pageNum--;
                    if (pageNum <= 0) pageNum = maxPages;
                    this.loadPage(user, pageNum);
                },

                update: function (json) {
                    if ('undefined' !== typeof json.LIST_MENU) {
                        this.$applyData(json.LIST_MENU);
                        this.SEARCH_VIDEO_ID = this.SAVED_VIDEO_ID;
                    } else if('undefined' !== typeof json.content &&
                    		'undefined' !== typeof json.content.PAGE_NAVIGATION) {
                    	this.$applyData(json.content.PAGE_NAVIGATION);
                    }
                    this.$applyData(json);
                },

                selectOnMouseUp: function (event) {

                    let value = $(event.target).val().trim();
                    if (value !== null && value !== '') {
                        $(event.target).trigger('select');
                    }
                },

                normalizeYouTubeUrl: function (event) {

                    let field = $(event.target);
                    let url = $(field).val();
                    if (!LibvuePlaylist.YOUTUBE_URL_REGEX.test(url)) {
                        $(field).val('');
                        return;
                    }

                    let videoId = $.urlParam('v', url);
                    if (videoId === null) {
                        videoId = url.replace(LibvuePlaylist.YOUTUBE_URL_REGEX, '');
                    }

                    if (this.SEARCH_VIDEO_ID === videoId) this.$forceUpdate();
                    else this.SEARCH_VIDEO_ID = videoId;
                    $(field).trigger('blur');
                    $player.playerWindow.ytPlayer.loadVideoById(videoId);
                },

                setVideo: function (track = null, vid) {
                	let needle = null;
                	if(track === null && this.$data.SEARCH_NEEDLE !== null) {
                		
                		needle = $page.createNeedle(
                				track, 
                				this.$data.SEARCH_NEEDLE.artist, 
                				this.$data.SEARCH_NEEDLE.title, 
                				vid
                		);                		
                	} else {                		
                		needle = $page.createNeedle(track, '', '', vid);
                	}
                	
                    $playlist.saveVideo(needle);
                },

                unsetVideo: function (event, track) {
                    let needle = $page.createNeedle(track);
                    $playlist.deleteVideo(needle);
                }
            }
        });
	}
}