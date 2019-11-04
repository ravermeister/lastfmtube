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
    	
    	let href = function(menu) {
    		console.log('>>>>', menu);
    		let page = null;
    		if(menu !== null && menu.PAGE !== null) {
    			page = pageControl.loader.pages.getByValue(menu.PAGE);    			
    		}else {
    			page = pageControl.loader.pages.base;
    		}
    		
    		return '#'+page.selector;
    	};
    	
        this.youtube = {
            LOGO: icons.youtube.big,
            TEXT: 'YouTube',
            PAGE: 'video',
            HREF: href(this)
        };

        this.search = {
            LOGO: icons.search.big,
            TEXT: 'Search',
            PAGE: 'playlist',
            HREF: href(this)
        };

        this.lastfm = {
            LOGO: icons.headphones.big,
            TEXT: 'Last.fm',
            PAGE: 'playlist',
            HREF: href(this)
        };

        this.userlist = {
            LOGO: icons.user.big,
            TEXT: 'My Songs',
            PAGE: 'playlist',
            HREF: href(this)
        };

        this.topsongs = {
            LOGO: icons.star.big,
            TEXT: 'Top Songs',
            PAGE: 'playlist',
            HREF: href(this)
        };

        this.topuser = {
            LOGO: icons.trophy.big,
            TEXT: 'Top User',
            PAGE: 'playlist',
            HREF: href(this)
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

        if ('undefined' !== typeof json.YTPLAYER.TEXT) this.youtube.TEXT = json.YTPLAYER.TEXT;
        if ('undefined' !== typeof json.YTPLAYER.PAGE) this.youtube.PAGE = json.YTPLAYER.PAGE;

        if ('undefined' !== typeof json.LASTFM.TEXT) this.lastfm.TEXT = json.LASTFM.TEXT;
        if ('undefined' !== typeof json.LASTFM.PAGE) this.lastfm.PAGE = json.LASTFM.PAGE;

        if ('undefined' !== typeof json.USERLIST.TEXT) this.userlist.TEXT = json.USERLIST.TEXT;
        if ('undefined' !== typeof json.USERLIST.PAGE) this.userlist.PAGE = json.USERLIST.PAGE;

        if ('undefined' !== typeof json.TOPSONGS.TEXT) this.topsongs.TEXT = json.TOPSONGS.TEXT;
        if ('undefined' !== typeof json.TOPSONGS.PAGE) this.topsongs.PAGE = json.TOPSONGS.PAGE;
        
        if ('undefined' !== typeof json.TOPUSER.TEXT) this.topuser.TEXT = json.TOPUSER.TEXT;
        if ('undefined' !== typeof json.TOPUSER.PAGE) this.topuser.PAGE = json.TOPUSER.PAGE;        
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