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
	
	setLoading(active = false) {
		
		if(this.currentPage === null || this.currentPage === this.pages.base) {			
			$page.myVues.main.logo.$data.PAGE_LOADER = active ?
					$page.icons.loader.bigger : $page.icons.diamond.bigger;
		}
		
        
        if ($(this.pages.userlist.topuser.element).is(currentPage.element)) {
            this.myVues.userlist.header.title.$data.LOADING = active;
        } else if ($(this.pages.playlist.user.element).is(currentPage.element)) {
            this.myVues.playlist.header.title.$data.LOADING = active;
        } else if ($(curArticle).is(PageController.article.video.dom())) {
            this.myVues.youtube.header.$data.LOADING = active;
        }
	}

	isCurrentPage(page) {
		if(page === null || page === '') return false;		
		return this.currentPage === page;
	}
	
	loadPage(page = 'video', callBack = null) {
		
		let thePage = this.pages.getByValue(page);
		if(thePage === null) return;		
        this.setLoading(true);
        
		switch(page) {
			case 'topsongs':

				
				
				$page.load('playlist-topsongs-container' ,'topsongs', function(){	
					$page.changeUrl('Top Songs', '/#topsongs');	
					if('function' === typeof callBack) {
						callBack();
					}
				});
			break;
		}
		
		this.setLoading();
		if(typeof callBack === 'function') {
			callBack(success);
		}
	}
}