/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class PageLoader {

	constructor() {
		
		this.currentPage = null;
		
		this.pages = {
			
			base: {
				value: 'base',
				selector: 'header',
				element: $('header[id='+selector+']')
			},
			
			userlist: {
				topuser: {
					value: 'userlist.topuser',
					selector: 'userlist-topuser-container',
					element: $('header[id='+selector+']')					
				}
			},
			
			playlist: {
				lastfm: {
					value: 'playlist.lastfm',
					selector: 'playlist-lastfm-container',
					element: $('article[id='+selector+']')
				},
				
				search: {
					value: 'playlist.search',
					selector: 'playlist-search-container',
					element: $('article[id='+selector+']')
				},
					
				topsongs: {
					value: 'playlist.topsongs',
					selector: 'playlist-topsongs-container',
					element: $('article[id='+selector+']')
				},
				
				user: {
					value: 'playlist.user',
					selector: 'playlist-user-container',
					element: $('article[id='+selector+']')
				}
			},
			
			getByValue: function(aValue) {
				switch(aValue) {
					case 'playlist.lastfm':
						return this.pages.playlist.lastfm;
					case 'playlist.search':
						return this.pages.playlist.search;
					case 'playlist.topsongs':
						return this.pages.playlist.topsongs;
					case 'playlist.user':
						return this.pages.playlist.topsongs;
					case 'userlist.topuser':
						return this.pages.userlist.topuser;
					case 'base':
						return this.pages.base;
					default:
						return null;
				}
			},
		}
		
	}
	
	setLoading(currentPage = null, active = false) {
		
		if(currentPage === null) {
			currentPage = this.currentPage;
		}
		
		if(currentPage === null || $(this.pages.base.element).is(currentPage.element)) {			
			$page.myVues.main.logo.$data.PAGE_LOADER = active ?
					$page.icons.loader.bigger : $page.icons.diamond.bigger;
		} else if ($(this.pages.userlist.topuser.element).is(currentPage.element)) {
            this.myVues.userlist.topuser.header.title.$data.LOADING = active;
        } else if ($(this.pages.playlist.user.element).is(currentPage.element)) {
            this.myVues.playlist.user.header.title.$data.LOADING = active;
        } else if ($(this.pages.playlist.lastfm.element).is(currentPage.element)) {
            this.myVues.playlist.lastfm.header.title.$data.LOADING = active;
        } else if ($(this.pages.playlist.search.element).is(currentPage.element)) {
            this.myVues.playlist.search.header.title.$data.LOADING = active;
        } else if ($(this.pages.video.youtube.element).is(currentPage.element)) {
            this.myVues.video.youtube.header.title.$data.LOADING = active;
        }
	}

	isCurrentPage(page) {
		if(page === null || page === '') return false;		
		return this.currentPage === page;
	}
	
	loadPage(page = 'video', pageNum = 1, searchNeedle = null) {
		
		let thePage = this.pages.getByValue(page);
		if(thePage === null) return;	

		let lastPage = this.currentPage;
		
        let self = this;
        this.setLoading(lastPage, true);
        
		let finished = function(vue, data){
			self.setLoading(lastPage);
			location.href.replace('#'+thePage.selector);
			vue.update(data);
		};  
		
		switch(thePage.value) {
			case this.pages.playlist.topsongs.value:
				$playlist.loadTopSongs(pageNum, function(result, data){
					if(result) {						
						finished($page.myVues.playlist.topsongs, data);
					}
				});
			break;
			case this.pages.playlist.user.value:
				$playlist.loadCustomerList(pageNum, function(result, data){
					if(result) {						
						finished($page.myVues.playlist.user, data);
					}
				});
			break;
			case this.pages.playlist.lastfm.value:
				$playlist.loadLastFmList(pageNum, function(result, data){
					if(result) {						
						finished($page.myVues.playlist.lastfm, data);
					}
				});
			break;
			case this.pages.playlist.search.value:
				if(searchNeedle === null) {
					console.log('no search needle provided, abort load search');
					return;
				}
				
				$playlist.loadSearchResult(searchNeedle, function(result, data){
					if(result) {						
						finished($page.myVues.playlist.search, data);
					}
				});
			break;
		}	
	}
	
    searchSong(track) {
        let needle = $page.createNeedle(track.ARTIST, track.TITLE, track.VIDEO_ID);
        
        if (!needle.isValid()) {
            console.error('needle is invalid exit search');
            return;
        }

        
        this.loadPage('search', null, needle);
    }
}