class PlaylistController {

    constructor() {
        this.userStore = Storages.localStorage;
    }

    loadTopUserPlayListPage(pageNum = 1, callBack = null, ignoreTitle = false) {

        let request = 'php/json/JsonHandler.php?api=topuser&data=playlist&page=' + pageNum;

        $.getJSON(request, function (json) {

            $page.myVues.userlist.update(json.data.value, ignoreTitle);

            try {
                if (typeof callBack === 'function') {
                    callBack(true);
                }
            } catch (e) {
                console.error('error in load default list callback function', e);
                console.error('Callback: ', callBack);
                console.error('page: ', pageNum, ' user: ', user, ' callback ', callBack);
            }
        }).fail(function (xhr, status, error) {
            if(typeof xhr === 'object' && xhr !== null) {
                console.error(
                    'request: ' , request,
                    '\n\nresponse: ', xhr.responseText,
                    '\n\nstatus: ',xhr.status,
                    '\n\nerror: ',xhr.statusText
                );
            } else {
                console.log('request: ', request, 'error');
            }
        });
    }

    loadPlaylistPage(pageNum = 1, user = null, callBack = null, playlist = null) {

        if (playlist === null) playlist = $page.PLAYLIST;

        let ignoreTitle = playlist === $page.PLAYLIST;
        let loadComplete = function (success) {
            let parentCallBack = callBack;

            if (typeof parentCallBack !== 'function') {
                $page.setCurrentPlaylist(playlist);
            } else {
                parentCallBack(success);
            }

            $page.setPlaylistLoading();
        };


        $page.setPlaylistLoading(true);

        switch (playlist) {
            case 'userlist':
                this.loadUserPlayListPage(pageNum, loadComplete, ignoreTitle);
                break;
            case 'topsongs':
                this.loadTopSongsPlayListPage(pageNum, loadComplete, ignoreTitle);
                break;
            case 'topuser':
                this.loadTopUserPlayListPage(pageNum, loadComplete, ignoreTitle);
                break;
            case 'video':
                if (typeof callBack === 'function') {
                    callBack(true);
                } else {
                    $playlist.setPlaylistLoading();
                }
                break;

            default:
                this.loadDefaultPlayListPage(pageNum, user, loadComplete, ignoreTitle);
                break;
        }
    }

    loadSearchResult(needle, result, pageNum = 1, callBack = null) {

        /**
         $page.myVues.playlist.header.$data.TEXT = 'Search Results';  //<br />' + track.ARTIST + '<br />' + track.TITLE;
         $page.myVues.playlist.header.$data.URL = '#page-playlist';
         $page.myVues.playlist.header.$data.URL_TARGET = '_self';
         $page.myVues.playlist.menu.$data.CUR_PAGE = pageNum;
         $page.myVues.playlist.menu.$data.MAX_PAGES = 1;
         $page.myVues.playlist.menu.$data.LASTFM_USER_NAME = needle.asVar(true);
         $page.myVues.playlist.menu.$data.PLAYLIST = 'search';
         $page.myVues.playlist.content.$data.SEARCH_NEEDLE = needle;
         $page.myVues.playlist.content.$data.TRACKS = result;
         **/
        console.log('TODO: show search result (update from json data)');
        if (typeof callBack === 'function') {
            callBack(true);
        }
    }

    loadTopSongsPlayListPage(pageNum = 1, callBack = null, ignoreTitle = false) {

        $.getJSON('php/json/JsonHandler.php?api=topsongs&data=playlist&page=' + pageNum, function (json) {

            $page.myVues.playlist.update(json.data.value, ignoreTitle);

            try {
                if (typeof callBack === 'function') {
                    callBack(true);
                }

            } catch (e) {
                console.error('error in load topsongs list callback function', e);
                console.error('Callback: ', callBack);
                console.error('page: ', pageNum, ' user: ', user, ' callback ', callBack);
            }
        }).fail(function (xhr, status, error) {
            if(typeof xhr === 'object' && xhr !== null) {
                console.error(
                    'request: ' , request,
                    '\n\nresponse: ', xhr.responseText,
                    '\n\nstatus: ',xhr.status,
                    '\n\nerror: ',xhr.statusText
                );
            } else {
                console.log('request: ', request, 'error');
            }

            try {
                if (typeof callBack === 'function') {
                    callBack(false);
                }
            } catch (e) {
                console.error('error in load topsongs list callback function', e);
                console.error('Callback: ', callBack);
                console.error('page: ', pageNum, ' user: ', user, ' callback ', callBack);
            } 
        });
    }

    loadUserPlayListPage(pageNum = 1, callBack = null, ignoreTitle = false) {

        let tracks = this.getUserTracks();

        let tracksPerPage = $page.TRACKS_PER_PAGE;
        pageNum = this.updateUserListPages(pageNum, tracks);
        let endIndex = pageNum * tracksPerPage;
        let startIndex = endIndex - tracksPerPage;

        if (endIndex < tracks.length) {
            tracks = tracks.slice(startIndex, endIndex);
        } else {
            tracks = tracks.slice(startIndex);
        }

        for (let cnt = 0; cnt < tracks.length; cnt++) {
            let track = tracks[cnt];
            track.NR = ((pageNum - 1) * tracksPerPage) + (cnt + 1);
        }
        
        $page.myVues.playlist.update({
            HEADER: {
                PLAYLIST: 'userlist',
                TEXT: 'My Songs',
                URL: ''
            },

            TRACKS: tracks
        }, ignoreTitle);


        if (typeof callBack === 'function') {
            callBack(true);
        }
    }

    isValidUser(user = null) {
        return user !== null && (user + '').trim().length > 0;
    }

    loadDefaultPlayListPage(pageNum = 1, user = null, callBack = null, ignoreTitle = false) {

        let request = null;

        if (this.isValidUser(user)) {
            request = 'php/json/JsonHandler.php?api=page&data=playlist' +
                '&type=default' +
                '&user=' + user +
                '&page=' + pageNum
            ;
        } else {
            request = 'php/json/JsonHandler.php?api=page&data=playlist' +
                '&type=default' +
                '&page=' + pageNum
            ;
        }
        
        $.getJSON(request, function (json) {

            try {

                $page.myVues.playlist.update(json.data.value, ignoreTitle);
                /**
                 Vue.nextTick()
                 .then(function () {
                        // DOM updated
                        $page.myVues.playlist.update(json.data.value, ignoreTitle);
                    });
                 **/

                if (typeof callBack === 'function') {
                    callBack(true);
                }
            } catch (e) {
                console.error('error in load default list callback function', e);
                console.error('Callback: ', callBack);
                console.error('page: ', pageNum, ' user: ', user, ' callback ', callBack);
            }
        }).fail(function (xhr, status, error) {
            if(typeof xhr === 'object' && xhr !== null) {
                console.error(
                    'request: ' , request,
                    '\n\nresponse: ', xhr.responseText,
                    '\n\nstatus: ',xhr.status,
                    '\n\nerror: ',xhr.statusText
                );
            } else {
                console.log('request: ', request, 'error');
            }

            if (typeof callBack === 'function') {
                callBack(false);
            }
        });
    }

    getUserTracks() {
        let userStore = this.userStore;
        if (!userStore.isSet('userlist.tracks')) userStore.set('userlist.tracks', new Array());
        return userStore.get('userlist.tracks');
    }

    setUserTracks(tracks = []) {
        this.userStore.set('userlist.tracks', tracks);
    }

    addUserTrack(track) {
        let tracks = this.getUserTracks();
        let newTrack = {
            NR: (tracks.length + 1),
            ARTIST: track.ARTIST,
            TITLE: track.TITLE,
            LASTPLAY: track.LASTPLAY,
            VIDEO_ID: track.VIDEO_ID,
            PLAY_CONTROL: '',
            PLAYLIST: 'userlist',
            PLAYSTATE: ''
        };


        tracks.push(newTrack);
        this.setUserTracks(tracks);
    }

    removeUserTrack(index = -1) {
        if (index < 0) return;
        let tracks = this.getUserTracks();
        if (index > tracks.length || index <= tracks.length) return;

        let pageNum = $page.myVues.playlist.menu.$data.CUR_PAGE;
        let maxPages = $page.myVues.playlist.menu.$data.MAX_PAGES;
        let offset = ((pageNum - 1) * $page.TRACKS_PER_PAGE);
        
        tracks.splice(offset+index, 1);
        this.setUserTracks(tracks);
    }

    updateUserListPages(pageNum = null, tracks = null) {
        
        $page.myVues.playlist.menu.$data.LASTFM_USER_NAME = '';
        $page.myVues.playlist.menu.$data.PLAYLIST = 'userlist';
        
        if (tracks === null) tracks = this.getUserTracks();
        if (tracks.length <= 0) {
            $page.myVues.playlist.menu.$data.CUR_PAGE = 1;
            $page.myVues.playlist.menu.$data.MAX_PAGES = 1;
            return 1;
        }

        let tracksPerPage = $page.TRACKS_PER_PAGE;

        let pageCount = parseInt(tracks.length / tracksPerPage);
        if ((tracks.length % tracksPerPage) > 0) pageCount++;
        $page.myVues.playlist.menu.$data.MAX_PAGES = pageCount;

        if (pageNum == null) {
            pageNum = parseInt($page.myVues.playlist.menu.$data.CUR_PAGE);
        }

        if (pageNum > pageCount) pageNum = pageCount;
        else if (pageNum < 1) pageNum = 1;

        $page.myVues.playlist.menu.$data.CUR_PAGE = pageNum;
        
        return pageNum;
    }
}