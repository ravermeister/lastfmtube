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
					case this.playlist.lastfm.value:
						return this.playlist.lastfm;
					case this.playlist.search.value:
						return this.playlist.search;
					case this.playlist.topsongs.value:
						return this.playlist.topsongs;
					case this.playlist.user.value:
						return this.playlist.user;
					case this.userlist.topuser.value:
						return this.userlist.topuser;
					case this.video.youtube.value:
						return this.video.youtube;
					case this.base.value:
						return this.base;
					default:
						return null;
				}
			},
			
			getByLocation: function() {
				let getHash = function(url)  {
					let idx = url.indexOf("#");
					return idx != -1 ? url.substring(idx+1) : "";
				};
				
				/**
				 * prefer the hashes over path values as we do not use path for
				 * now
				 */
				let path = location.pathname;
				let hash = getHash(location.href);
				if(hash.length > 0) path = hash;

// console.log('path: ', path);
				
				switch(path) {
					case this.userlist.topuser.location:
					case this.userlist.topuser.selector:					
						return this.userlist.topuser;
					case this.playlist.lastfm.location:
					case this.playlist.lastfm.selector:
						return this.playlist.lastfm;
					case this.playlist.topsongs.location:
					case this.playlist.topsongs.selector:
						return this.playlist.topsongs;
					case this.playlist.user.location:
					case this.playlist.user.selector:
						return this.playlist.user;
					case this.playlist.search.location:
					case this.playlist.search.selector:
						return this.playlist.search;
					case this.video.youtube.location:
					case this.video.youtube.selector:
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
	
	loadPage(page = null, pageData = null, autoPlay = false) {

		if(page === null) return;	
		let lastPage = this.pageInfo.currentPage;
		
        let self = this;
        this.setLoading(lastPage.value, true);
        
		let finished = function(vue = null, data = null, autoplay = false){
			
			let updateVueAndLoad = function(vue, data, autoplay){
				if(vue !== null && data !== null) {		
					vue.update(data);
					if($page.loader.pages.isPlaylist(page)) {
						$page.myVues.updateAll({
							PLAYLIST: page.value
						});
					}
				}
				if(autoplay) {
					$player.loadNextSong();
				}
			};
			
			self.setLoading(lastPage.value);
			self.pageInfo.update(page, pageData);			
			self.setLocation('#'+page.selector);

			if(lastPage.value === self.pages.video.youtube) {
				
				/**
				 * BUG, because the youtube player window updates too when the
				 * PLAYLIST var of the vue implementations are updated, 
				 * we will wait a little bit when the 
				 * player window is the current view, sothat the page navigation
				 * feels smooth.
				 */
				setTimeout(updateVueAndLoad, 300, vue, data, autoplay);
			} else {				
				updateVueAndLoad(vue, data, autoplay);
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
						finished($page.myVues.playlist.topsongs, data, autoPlay);
					}
				});
			break;
// User Playlist
			case this.pages.playlist.user.value:
				$playlist.loader.loadCustomerList(pageNum, function(result, data){
					if(result) {						
						finished($page.myVues.playlist.user, data, autoPlay);
					}
				});
			break;
// Last.fm Playlist
			case this.pages.playlist.lastfm.value:
				$playlist.loader.loadLastFmList(pageNum, lfmUser, function(result, data){
					if(result) {						
						finished($page.myVues.playlist.lastfm, data, autoPlay);
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
						finished($page.myVues.playlist.search, data, autoPlay);												
					}
				});
			break;
			case this.pages.userlist.topuser.value:
				$playlist.loader.loadTopUser(pageNum, function(result, data){
					if(result) {						
						finished($page.myVues.playlist.user, data, autoPlay);
					}
				});
			break;
// Top Last.fm User
// YouTube Player View
			case this.pages.video.youtube.value:				
					finished(null, null, autoPlay);
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
    	let loadDefaultPlaylist = false;
    	let self = this;
    	
    	if(page === null || page === this.pages.base || 
    		page === this.pages.playlist.search) {
    		
    		page = this.pages.video.youtube;
    		loadDefaultPlaylist = true;
    	} else if(page === this.pages.userlist.topuser || 
    			page === this.pages.video.youtube) {
    		loadDefaultPlaylist = true;
    	}
    	let pageData = {
    			pnum: 1
    	};
    	
    	if(loadDefaultPlaylist) {
			$playlist.loader.loadLastFmList(pageData.pnum, null, function(result, data){
				if(result) {
					$page.myVues.playlist.lastfm.update(data);		
					if(page !== $page.loader.pages.playlist.search) {		
						$page.myVues.updateAll({
							PLAYLIST: self.pages.playlist.lastfm.value
						});
					}
					
					self.pageInfo.update(self.pages.playlist.lastfm, pageData);
					self.loadPage(page, pageData, $player.autoPlay);
				}
			});
    	} else {
    		self.loadPage(page, pageData, $player.autoPlay);
    	}
    	
    }
    
    setLocation(href) {
    	location.href = href;
    }
}