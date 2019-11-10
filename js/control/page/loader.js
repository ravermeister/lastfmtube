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
		let self = this;

		this.pageInfo = {
				currentPage: {
					value: null,
					data: null
				},
				
				lastPage: {
					value: null,
					data: null
				},
				
				lastPlaylist: {
					value: null,
					data: null
				},
				
				update: function(page, pageData) {							
					
					this.lastPage = this.currentPage;					
					if(self.pages.isPlaylist(this.lastPage.value)) {
						this.lastPlaylist = this.lastPage;
					}					
					
					this.currentPage = {
							value: page,
							data: pageData
					};
				} 
			};
		
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
			
			isPlaylist: function(page) {
				let isPlaylist = (page === this.playlist.lastfm ||
				page === this.playlist.topsongs ||
				page === this.playlist.user);
				
				return isPlaylist;
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
			currentPage = this.pageInfo.currentPage.value;
		}
				
		$page.myVues.main.logo.$data.PAGE_LOADER = active ?
				$page.icons.loader.bigger : $page.icons.diamond.bigger;	
		
		if(currentPage === null || 'undefined' === typeof currentPage) {
			return;
		}
		
		let vue = $page.myVues.forPage(currentPage);
		if(vue !== null) {	
			if('undefined' !== typeof vue.header.title) {				
				vue.header.title.$data.LOADING = active;
				// playlist etc.
			} else {
				vue.header.$data.LOADING = active;
				// youtube
			}
		}
	}

	isCurrentPage(page) {
		if(page === null || page === '') return false;		
		return this.pageInfo.currentPage.value === page;
	}
	
	loadMenu(menu = null, pageData) {
		let page = this.pages.getByMenu(menu);
		if(page === null) return;
		
		this.loadPage(page, pageData);
	}
	
	loadPage(page = null, pageData = null) {

		if(page === null) return;	
		let lastPage = this.pageInfo.currentPage;
		
        let self = this;
        this.setLoading(lastPage.value, true);
        
		let finished = function(vue = null, data = null){
			self.setLoading(lastPage.value);
			self.pageInfo.update(page, pageData);
			
			self.setLocation('#'+page.selector);
			if(vue !== null && data !== null) {		
				vue.update(data);
				if(page !== $page.loader.pages.playlist.search) {		
					$page.myVues.updateAll({
						PLAYLIST: page.value
					});
				}
			}
		};  
		
		let pageNum = pageData !== null && ('undefined' !== typeof pageData.pnum) ?
				pageData.pnum : 1;
		let needle = pageData !== null && ('undefined' !== typeof pageData.needle) ?
				pageData.needle : null;
		let lfmUser = pageData !== null && ('undefined' !== typeof pageData.lfmuser) ?
				pageData.lfmuser : null;
		let sortBy = pageData !== null && ('undefined' !== typeof pageData.sortby) ?
				pageData.sortby : null;
		
		switch(page.value) {
// Topsongs
			case this.pages.playlist.topsongs.value:
				$playlist.loader.loadTopSongs(pageNum, sortBy, function(result, data){
					if(result) {						
						finished($page.myVues.playlist.topsongs, data);
					}
				});
			break;
// User Playlist
			case this.pages.playlist.user.value:
				$playlist.loader.loadCustomerList(pageNum, function(result, data){
					if(result) {						
						finished($page.myVues.playlist.user, data);
					}
				});
			break;
// Last.fm Playlist
			case this.pages.playlist.lastfm.value:
				$playlist.loader.loadLastFmList(pageNum, lfmUser, function(result, data){
					if(result) {						
						finished($page.myVues.playlist.lastfm, data);
					}
				});
			break;
// Search Result List
			case this.pages.playlist.search.value:
				if(needle === null) {					
					if(this.isCurrentPage(page)) {
						needle = $page.myVues.playlist.search.menu.$data.SEARCH_NEEDLE;			        
					}
					if(needle === null) {								
						console.log('no search needle provided, abort load search ', pageData);
						return;
					}
				}
				$playlist.loader.loadSearchResult(needle, pageNum, function(result, data){
					if(result) {	
						data.SEARCH_NEEDLE = needle;	
						finished($page.myVues.playlist.search, data);												
					}
				});
			break;
			case this.pages.userlist.topuser.value:
				$playlist.loader.loadTopUser(pageNum, function(result, data){
					if(result) {						
						finished($page.myVues.playlist.user, data);
					}
				});
			break;
// Top Last.fm User
// YouTube Player View
			case this.pages.video.youtube.value:				
					finished();
			break;
		}	
	}

    searchSong(track, pageNum = 1) {
        let needle = $page.createNeedle(track.ARTIST, track.TITLE, track.VIDEO_ID);
        
        if (!needle.isValid()) {
            console.error('needle is invalid exit search');
            return;
        }
        
        
        
        this.loadPage(this.pages.playlist.search, {
        	needle: needle,
        	pnum: pageNum
        });
    }
    
    
    initURL() {
    	let page = this.pages.getByLocation();
    	if(page === null) {
    		console.log('unkown url: ', location.href);
    		return;
    	} else if(page === this.pages.base) {
    		page = this.pages.video.youtube;
    	}
    	this.loadPage(page);
    }
    
    setLocation(href) {
    	location.href = href;
    }
}