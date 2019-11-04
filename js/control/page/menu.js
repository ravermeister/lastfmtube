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
    		console.log('>>>>', menu);
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
        	this.youtube.PAGE.HREF = createHref(this.youtube);  
        }

        if ('undefined' !== typeof json.LASTFM.TEXT) this.lastfm.TEXT = json.LASTFM.TEXT;
        if ('undefined' !== typeof json.LASTFM.PAGE) {
        	this.lastfm.PAGE = json.LASTFM.PAGE;
        	this.lastfm.PAGE.HREF = createHref(this.lastfm);  

        }

        if ('undefined' !== typeof json.USERLIST.TEXT) this.userlist.TEXT = json.USERLIST.TEXT;
        if ('undefined' !== typeof json.USERLIST.PAGE) {
        	this.userlist.PAGE = json.USERLIST.PAGE;
        	this.userlist.PAGE.HREF = createHref(this.userlist);  

        }

        if ('undefined' !== typeof json.TOPSONGS.TEXT) this.topsongs.TEXT = json.TOPSONGS.TEXT;
        if ('undefined' !== typeof json.TOPSONGS.PAGE) {
        	this.topsongs.PAGE = json.TOPSONGS.PAGE;
        	this.topsongs.PAGE.HREF = createHref(this.topsongs);  

        }
        
        if ('undefined' !== typeof json.TOPUSER.TEXT) this.topuser.TEXT = json.TOPUSER.TEXT;
        if ('undefined' !== typeof json.TOPUSER.PAGE) {
        	this.topuser.PAGE = json.TOPUSER.PAGE; 
        	this.topuser.PAGE.HREF = createHref(this.topuser);  

        }
    }

    getMenuItem(playlist) {
        switch (playlist) {
            case 'youtube':
            case 'video':
            case 'video-container':
                return this.youtube;
            case 'topuser':
                return this.topuser;
            case 'topsongs':
                return this.topsongs;
            case 'userlist':
                return this.userlist;
            case 'search':
            	if(this.pageControl.SEARCH_RETURN_PLAYLIST !== null) {
            		return this.getMenuItem(this.pageControl.SEARCH_RETURN_PLAYLIST);
            	}
                return this.search;
            default:
            case 'lastfm':
            case 'default':
            case 'playlist-container':
                return this.lastfm;
        }
    }

    getMenu(playlist) {

        let list = [];
        switch (playlist) {
            case 'youtube':
            case 'video':
            case 'video-youtube-container':
            case 'video.youtube':
                list = [
                    this.lastfm,
                    this.userlist,
                    this.topsongs,
                    this.topuser
                ];
                break;
            case 'lastfm':
            case 'default':
            case 'playlist-lastfm-container':
            case 'playlist.lastfm':
                list = [
                    this.youtube,
                    this.userlist,
                    this.topsongs,
                    this.topuser
                ];
                break;
            case 'topuser':
            case 'user.topuser':
            case 'user-topuser-container':
            case 'search':
                list = [
                    this.youtube,
                    this.lastfm,
                    this.topsongs,
                    this.userlist
                ];
                break;
            case 'topsongs':
                list = [
                    this.youtube,
                    this.lastfm,
                    this.userlist,
                    this.topuser
                ];
                break;
            case 'userlist':
                list = [
                    this.youtube,
                    this.lastfm,
                    this.topsongs,
                    this.topuser
                ];
                break;
            default:
                list = [];
                break;
        }

        return list;
    }
}