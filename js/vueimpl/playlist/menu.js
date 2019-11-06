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
                    $page.setLoading(PageController.article.playlist.dom(), true);
                    $page.loadList(this.$data.CUR_PAGE, null, function () {
                        $page.setLoading(PageController.article.playlist.dom());
                    });            		
            		return true;
            		
            	},
                loadPage: function (user, pageNum) {
                    if (this.$data.PLAYLIST === 'search') {
                        let start = (pageNum - 1) * $page.settings.general.tracksPerPage;
                        let end = pageNum * $page.settings.general.tracksPerPage;
                        let tracks = [];
                        if (this.$data.SEARCH_RESULT.length > start) {
                            tracks = this.$data.SEARCH_RESULT.slice(start, end);
                        }

                        $page.myVues.playlist.content.update({
                            TRACKS: tracks
                        });
                        this.$data.CUR_PAGE = pageNum;
                        return;
                    }

                    console.log('>>>', $page.loader.currentPage, 'user ', user);
                    $page.loader.loadPage($page.loader.currentPage, {
                    	pnum: pageNum,
                    	lfmuser: user
                    });
                },

                loadNextPage: function (user, pageNum, maxPages) {
                    pageNum++;
                    if (pageNum > maxPages) pageNum = 1;
                    this.loadPage(user, pageNum);
                },

                loadPrevPage: function (user, pageNum, maxPages) {
                    pageNum--;
                    if (pageNum <= 0) pageNum = maxPages;
                    this.loadPage(user, pageNum);
                },

                update: function (json) {

                    if ('undefined' !== typeof json.LIST_MENU) {
                        this.$applyData(json.LIST_MENU);
                        this.SEARCH_VIDEO_ID = this.SAVED_VIDEO_ID;
                    }
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

                setVideo: function (vid) {
                    $page.myVues.playlist.setVideo(vid);
                },

                unsetVideo: function (event, track) {
                    let needle = $page.createNeedle(track.ARTIST, track.TITLE, track.VIDEO_ID);
                    $page.myVues.playlist.unsetVideo(needle);
                }
            }
        });
	}
}