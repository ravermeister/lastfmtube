/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class Menu {

    constructor(pageControl) {
    	
    	this.pageControl = pageControl;
    	    	
        this.youtube = {
            LOGO: pageControl.icons.youtube.big,
            TEXT: 'YouTube',
            PAGE: 'video',
            HREF: ''
        };

        this.search = {
            LOGO: pageControl.icons.search.big,
            TEXT: 'Search',
            PAGE: 'playlist',
            HREF: ''
        };

        this.lastfm = {
            LOGO: pageControl.icons.headphones.big,
            TEXT: 'Last.fm',
            PAGE: 'playlist',
            HREF: ''
        };

        this.userlist = {
            LOGO: pageControl.icons.user.big,
            TEXT: 'My Songs',
            PAGE: 'playlist',
            HREF: ''
        };

        this.topsongs = {
            LOGO: pageControl.icons.star.big,
            TEXT: 'Top Songs',
            PAGE: 'playlist',
            HREF: ''
        };

        this.topuser = {
            LOGO: pageControl.icons.trophy.big,
            TEXT: 'Top User',
            PAGE: 'playlist',
            HREF: ''
        };

        this.defaultMenu = [
            this.youtube,
            this.lastfm,
            this.userlist,
            this.topsongs,
            this.topuser
        ];

    }

    updateData(json) {
    	
        if ('undefined' !== typeof json.listmenu) json = json.listmenu;

        let self = this;
    	let createHref = function(menu) {

    		let page = null;
    		if(menu !== null && menu.PAGE !== null) {
    			page = self.pageControl.loader.pages.getByValue(menu.PAGE);    			
    		}else {
    			page = self.pageControl.loader.pages.base;
    		}
    		
    		return '#'+page.selector;
    	};
        
        if ('undefined' !== typeof json.YTPLAYER.TEXT) this.youtube.TEXT = json.YTPLAYER.TEXT;
        if ('undefined' !== typeof json.YTPLAYER.PAGE) {
        	this.youtube.PAGE = json.YTPLAYER.PAGE;
        	this.youtube.HREF = createHref(this.youtube);  
        }

        if ('undefined' !== typeof json.LASTFM.TEXT) this.lastfm.TEXT = json.LASTFM.TEXT;
        if ('undefined' !== typeof json.LASTFM.PAGE) {
        	this.lastfm.PAGE = json.LASTFM.PAGE;
        	this.lastfm.HREF = createHref(this.lastfm);  

        }

        if ('undefined' !== typeof json.USERLIST.TEXT) this.userlist.TEXT = json.USERLIST.TEXT;
        if ('undefined' !== typeof json.USERLIST.PAGE) {
        	this.userlist.PAGE = json.USERLIST.PAGE;
        	this.userlist.HREF = createHref(this.userlist);  

        }

        if ('undefined' !== typeof json.TOPSONGS.TEXT) this.topsongs.TEXT = json.TOPSONGS.TEXT;
        if ('undefined' !== typeof json.TOPSONGS.PAGE) {
        	this.topsongs.PAGE = json.TOPSONGS.PAGE;
        	this.topsongs.HREF = createHref(this.topsongs);  

        }
        
        if ('undefined' !== typeof json.TOPUSER.TEXT) this.topuser.TEXT = json.TOPUSER.TEXT;
        if ('undefined' !== typeof json.TOPUSER.PAGE) {
        	this.topuser.PAGE = json.TOPUSER.PAGE; 
        	this.topuser.HREF = createHref(this.topuser);  
        }
        
        
    }

    getMenuItem(menuId) {
    	/**
    	 * BUG:
    	 * ?????????????????????????????????
    	 * when the menu is retrieved an old method Vue.prototype.$url is triggered
    	 * ?????????????????????????????????
    	 */
        switch (menuId) {
            case 'youtube':
            case 'video':
            case 'video-container':
            case this.pageControl.loader.pages.video.youtube.value:
                return this.youtube;
            case 'topuser':
            case this.pageControl.loader.pages.userlist.topuser.value:
                return this.topuser;
            case 'topsongs':
            case this.pageControl.loader.pages.playlist.topsongs.value:
                return this.topsongs;
            case 'userlist':
            case this.pageControl.loader.pages.playlist.user.value:
                return this.userlist;
            case 'search':
            case this.pageControl.loader.pages.playlist.search.value:
            	if(this.pageControl.SEARCH_RETURN_PLAYLIST !== null) {
            		return this.getMenuItem(this.pageControl.SEARCH_RETURN_PLAYLIST);
            	}
                return this.search;
            case 'lastfm':
            case this.pageControl.loader.pages.playlist.lastfm.value:
                return this.lastfm;
        	default: 
                return null;
        }
    }

    getMenu(menuId) {

        switch (menuId) {
        	case 'all':
            case 'default':
            	return this.defaultMenu;
            case 'youtube':
            case 'video':
            case 'video-youtube-container':
            case 'video.youtube':
                return [
                    this.lastfm,
                    this.userlist,
                    this.topsongs,
                    this.topuser
                ];
            case 'lastfm':
            case 'playlist-lastfm-container':
            case 'playlist.lastfm':
            	return [
                    this.youtube,
                    this.userlist,
                    this.topsongs,
                    this.topuser
                ];
            case 'topuser':
            case 'user.topuser':
            case 'user-topuser-container':
            case 'search':
            	return [
                    this.youtube,
                    this.lastfm,
                    this.topsongs,
                    this.userlist
                ];
            case 'topsongs':
            case 'playlist.topsongs':
            case 'playlist-topsongs-container':
                return [
                    this.youtube,
                    this.lastfm,
                    this.userlist,
                    this.topuser
                ];
            case 'userlist':
            case 'playlist-user-container':
            case 'playlist.user':
                return [
                    this.youtube,
                    this.lastfm,
                    this.topsongs,
                    this.topuser
                ];
            default:
                return null;
        }
    }
}