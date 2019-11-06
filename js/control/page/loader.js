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
				location: '',
				selector: 'header',
				element: $('header[id='+this.selector+']')
			},
			
			userlist: {
				topuser: {
					value: 'userlist.topuser',
					location: '/topuser',
					selector: 'userlist-topuser-container',
					element: $('header[id='+this.selector+']')					
				}
			},
			
			video: {
				youtube: {
					value: 'video.youtube',
					location: '/video',
					selector: 'video-youtube-container',
					element: $('header[id='+this.selector+']')		
				}
			},
			
			playlist: {
				lastfm: {
					value: 'playlist.lastfm',
					path: '/lastfm',
					selector: 'playlist-lastfm-container',
					element: $('article[id='+this.selector+']')
				},
				
				search: {
					value: 'playlist.search',
					path: '/search',
					selector: 'playlist-search-container',
					element: $('article[id='+this.selector+']')
				},
					
				topsongs: {
					value: 'playlist.topsongs',
					path: '/topsongs',
					selector: 'playlist-topsongs-container',
					element: $('article[id='+this.selector+']')
				},
				
				user: {
					value: 'playlist.user',
					path: '/userlist',
					selector: 'playlist-user-container',
					element: $('article[id='+this.selector+']')
				}
			},
			
			
			
			getByValue: function(aValue) {
				switch(aValue) {
					case 'playlist.lastfm':
						return this.playlist.lastfm;
					case 'playlist.search':
						return this.playlist.search;
					case 'playlist.topsongs':
						return this.playlist.topsongs;
					case 'playlist.user':
						return this.playlist.user;
					case 'userlist.topuser':
						return this.userlist.topuser;
					case 'video.youtube':
						return this.video.youtube;
					case 'base':
						return this.base;
					default:
						return null;
				}
			},
			
			getByLocation: function() {
				switch(location.pathname) {
					case this.userlist.topuser.location:
						return this.userlist.topuser;
					case this.playlist.lastfm.location:
						return this.playlist.lastfm.location;
					case this.playlist.topsongs.location:
						return this.playlist.topsongs;
					case this.playlist.user.location:
						return this.playlist.user;
					case this.playlist.search.location:
						return this.playlist.search;
					case this.video.youtube.location:
						return this.video.youtube;
					default:
						return this.base;
				}
			}, 
			
			getByMenu: function(menu) {
				switch(menu) {
					case $page.menu.youtube:
						return this.video.youtube;
					case $page.menu.search:
						return this.playlist.search;
					case $page.menu.lastfm:
						return this.playlist.lastfm;
					case $page.menu.userlist:
						return this.playlist.user;
					case $page.menu.topsongs:
						return this.playlist.topsongs;
					case $page.menu.topuser:
						return this.userlist.topuser;
					default: 
						return null;
				}
			}
		}
		
	}
	
	setLoading(currentPage = null, active = false) {
		
		if(currentPage === null) {
			currentPage = this.currentPage;
		}
		
		if(currentPage === null || $(this.pages.base.element).is(currentPage.element)) {			
			$page.myVues.main.logo.$data.PAGE_LOADER = active ?
					$page.icons.loader.bigger : $page.icons.diamond.bigger;
			return this.pages.base;
		} else if ($(this.pages.userlist.topuser.element).is(currentPage.element)) {
            this.myVues.userlist.topuser.header.title.$data.LOADING = active;
            return this.pages.userlist.topuser;
        } else if ($(this.pages.playlist.user.element).is(currentPage.element)) {
            this.myVues.playlist.user.header.title.$data.LOADING = active;
            return this.pages.playlist.user;
        } else if ($(this.pages.playlist.lastfm.element).is(currentPage.element)) {
            this.myVues.playlist.lastfm.header.title.$data.LOADING = active;
            return this.myVues.playlist.lastfm;
        } else if ($(this.pages.playlist.search.element).is(currentPage.element)) {
            this.myVues.playlist.search.header.title.$data.LOADING = active;
            return this.myVues.playlist.search; 
        } else if ($(this.pages.video.youtube.element).is(currentPage.element)) {
            this.myVues.video.youtube.header.title.$data.LOADING = active;
            return this.myVues.video.youtube; 
        }
	}

	isCurrentPage(page) {
		if(page === null || page === '') return false;		
		return this.currentPage === page;
	}
	
	loadMenu(menu = null, pageNum = 1, searchNeedle = null) {
		let page = this.pages.getByMenu(menu);
		if(page === null) return;
		
		this.loadPage(page, pageNum, searchNeedle);
	}
	
	loadPage(page = null, pageNum = 1, searchNeedle = null) {

		if(thePage === null) return;	

		let lastPage = this.currentPage;
		
        let self = this;
        this.setLoading(lastPage, true);
        
		let finished = function(vue, data){
			self.setLoading(lastPage);
			console.log('page loaded')
			self.setLocation('#'+thePage.selector);
			if(vue !== null && data !== null) {				
				vue.update(data);
			}
		};  
		
		switch(thePage.value) {
// Topsongs
			case this.pages.playlist.topsongs.value:
				$playlist.loadTopSongs(pageNum, function(result, data){
					if(result) {						
						finished($page.myVues.playlist.topsongs, data);
					}
				});
			break;
// User Playlist
			case this.pages.playlist.user.value:
				$playlist.loadCustomerList(pageNum, function(result, data){
					if(result) {						
						finished($page.myVues.playlist.user, data);
					}
				});
			break;
// Last.fm Playlist
			case this.pages.playlist.lastfm.value:
				$playlist.loadLastFmList(pageNum, null, function(result, data){
					if(result) {						
						finished($page.myVues.playlist.lastfm, data);
					}
				});
			break;
// Search Result List
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
// YouTube Player View
			case this.pages.video.youtube.value:				
					finished();
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
    
    
    initURL() {
    	let page = this.pages.getByLocation();
    	if(page === null) {
    		console.log('unkown url: ', location.href);
    		return;
    	} else if(page === this.pages.base) {
    		page = this.pages.video.youtube;
    	}

    	this.setLoading();
    	this.setLocation('#'+page.selector);
    }
    
    setLocation(href) {
    	location.href = href;
    }
}