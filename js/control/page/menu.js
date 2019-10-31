/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class Menu {

    constructor(icons) {

        this.youtube = {
            LOGO: icons.youtube.big,
            TEXT: 'YouTube',
            PAGE: 'video'
        };

        this.search = {
            LOGO: icons.search.big,
            TEXT: 'Search',
            PAGE: 'playlist',
            LDATA: 'search'
        };

        this.lastfm = {
            LOGO: icons.headphones.big,
            TEXT: 'Last.fm',
            PAGE: 'playlist'
        };

        this.userlist = {
            LOGO: icons.user.big,
            TEXT: 'My Songs',
            PAGE: 'playlist'
        };

        this.topsongs = {
            LOGO: icons.star.big,
            TEXT: 'Top Songs',
            PAGE: 'playlist'
        };

        this.topuser = {
            LOGO: icons.trophy.big,
            TEXT: 'Top User',
            PAGE: 'playlist'
        };
        
        this.live

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
        if ('undefined' !== typeof json.YTPLAYER.LDATA) this.youtube.LDATA = json.YTPLAYER.LDATA;

        if ('undefined' !== typeof json.LASTFM.TEXT) this.lastfm.TEXT = json.LASTFM.TEXT;
        if ('undefined' !== typeof json.LASTFM.PAGE) this.lastfm.PAGE = json.LASTFM.PAGE;
        if ('undefined' !== typeof json.LASTFM.LDATA) this.lastfm.LDATA = json.LASTFM.LDATA;

        if ('undefined' !== typeof json.USERLIST.TEXT) this.userlist.TEXT = json.USERLIST.TEXT;
        if ('undefined' !== typeof json.USERLIST.PAGE) this.userlist.PAGE = json.USERLIST.PAGE;
        if ('undefined' !== typeof json.USERLIST.LDATA) this.userlist.LDATA = json.USERLIST.LDATA;

        if ('undefined' !== typeof json.TOPSONGS.TEXT) this.topsongs.TEXT = json.TOPSONGS.TEXT;
        if ('undefined' !== typeof json.TOPSONGS.PAGE) this.topsongs.PAGE = json.TOPSONGS.PAGE;
        if ('undefined' !== typeof json.TOPSONGS.LDATA) this.topsongs.LDATA = json.TOPSONGS.LDATA;

        if ('undefined' !== typeof json.TOPUSER.TEXT) this.topuser.TEXT = json.TOPUSER.TEXT;
        if ('undefined' !== typeof json.TOPUSER.PAGE) this.topuser.PAGE = json.TOPUSER.PAGE;
        if ('undefined' !== typeof json.TOPUSER.LDATA) this.topuser.LDATA = json.TOPUSER.LDATA;

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
            	if($page.SEARCH_RETURN_PLAYLIST !== null) {
            		return this.getMenuItem($page.SEARCH_RETURN_PLAYLIST);
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
            case 'video-container':
                list = [
                    this.lastfm,
                    this.userlist,
                    this.topsongs,
                    this.topuser
                ];
                break;
            case 'lastfm':
            case 'default':
            case 'playlist-container':
                list = [
                    this.youtube,
                    this.userlist,
                    this.topsongs,
                    this.topuser
                ];
                break;
            case 'topuser':
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