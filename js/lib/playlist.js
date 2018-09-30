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
        }).fail(function (xhr) {
            $.logXhr(xhr);
        });
    }

    loadPlaylistPage(pageNum = 1, user = null, callBack = null, playlist = null) {

        if (playlist === null) playlist = $page.PLAYLIST;

        let ignoreTitle = playlist === $page.PLAYLIST;

        let curArticle = PageController.article.playlist.dom;
        let loadComplete = function (success) {
            let parentCallBack = callBack;

            if (typeof parentCallBack !== 'function') {
                $page.setCurrentPlaylist(playlist);
            } else {
                parentCallBack(success);
            }

            $page.setLoading(curArticle);
        };
        
        $page.setLoading(curArticle, true);
        
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
                    $page.setLoading(curArticle);
                }
                break;
            default:
                this.loadDefaultPlayListPage(pageNum, user, loadComplete, ignoreTitle);
                break;
        }
    }

    static loadSearchResult(needle, result, pageNum = 1, callBack = null) {

        let trackCnt = result.data.value.length;
        let maxPages = 1;
        let tracks = [];
        let savedVid = needle.videoId;
        if(trackCnt > 0) {
            maxPages = trackCnt / PageController.TRACKS_PER_PAGE | 0;
            if(trackCnt%PageController.TRACKS_PER_PAGE > 1) maxPages++;
            
            for(let cnt=0;cnt<trackCnt;cnt++) {
                let ytvid = result.data.value[cnt];
                let track = {
                    NR: (cnt + 1) + '',
                    ARTIST: '',
                    TITLE: ytvid.title,
                    VIDEO_ID: ytvid.video_id,
                    PLAYLIST: 'search',
                    PLAYCOUNT: null,
                    PLAYSTATE: '',
                    PLAY_CONTROL: ''
                };
                if($player.isCurrentTrack(track)) {
                    track.PLAYSTATE = $player.currentTrackData.track.PLAYSTATE;
                    track.PLAY_CONTROL = $player.currentTrackData.track.PLAY_CONTROL;
                    $player.setCurrentTrack(track);
                }
                tracks[cnt] = track;
            }
        }

        $page.setCurrentPlaylist('search');
        let playlistArticle = $('article[name=playlist-container]');
        $(playlistArticle).attr('id', 'search');        
        $page.myVues.playlist.update({
            HEADER: {
                TEXT: 'Search Results'
            },

            LIST_MENU: {
                CUR_PAGE: pageNum,
                MAX_PAGES: maxPages,
                PLAYLIST: 'search',
                SAVED_VIDEO_ID: savedVid,
                SEARCH_NEEDLE: needle,
                SEARCH_RESULT: tracks
            },

            TRACKS: tracks.slice(0, PageController.TRACKS_PER_PAGE)
        });
        
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
        }).fail(function (xhr) {
            
            $.logXhr(xhr);

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

        let tracksPerPage = PageController.TRACKS_PER_PAGE;
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
        }).fail(function (xhr) {

            $.logXhr(xhr);

            if (typeof callBack === 'function') {
                callBack(false);
            }
        });
    }

    getUserTracks() {
        let userStore = this.userStore;
        if (!userStore.isSet('userlist.tracks')) userStore.set('userlist.tracks', []);
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
        let offset = ((pageNum - 1) * PageController.TRACKS_PER_PAGE);
        
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

        let tracksPerPage = PageController.TRACKS_PER_PAGE;

        let pageCount = (tracks.length / tracksPerPage) | 0;

        if ((tracks.length % tracksPerPage) > 0) pageCount++;
        $page.myVues.playlist.menu.$data.MAX_PAGES = pageCount;

        if (pageNum === null) {
            pageNum = ($page.myVues.playlist.menu.$data.CUR_PAGE) | 0;
        }

        if (pageNum > pageCount) pageNum = pageCount;
        else if (pageNum < 1) pageNum = 1;

        $page.myVues.playlist.menu.$data.CUR_PAGE = pageNum;
        
        return pageNum;
    }
}