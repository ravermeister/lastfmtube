class PlaylistController {

    constructor() {
        this.userStore = Storages.localStorage;
    }

    loadTopUserPlayListPage(pageNum = 1, callBack = null, ignoreTitle = false) {

        let request = 'php/json/JsonHandler.php?api=topuser&data=playlist&page=' + pageNum;

        $.getJSON(request, function (json) {

            if ($player.CURRENT_TRACK != null) {
                let newCurTrack = null;
                for (let cnt = 0; cnt < json.data.value.length; cnt++) {
                    let track = json.data.value[cnt];

                    if ($player.isCurrentTrack(track)) {
                        newCurTrack = track;
                        break;
                    }
                }

                if (newCurTrack != null) {
                    $player.setCurrentTrack(newCurTrack);
                }
            }

            $page.myVues.playlist.update(json.data.value, ignoreTitle);

            try {
                if (callBack != null) {
                    callBack(true);
                }
            } catch (e) {
                console.error('error in load default list callback function', e);
                console.error('Callback: ', callBack);
                console.error('page: ', pageNum, ' user: ', user, ' callback ', callBack);
            }
        }).fail(function (xhr) {
            console.error(xhr.responseText);
        });
    }

    loadPlaylistPage(pageNum = 1, user = null, callBack = null, playlist = null) {

        if (playlist == null) playlist = $page.PLAYLIST;

        let ignoreTitle = playlist == $page.PLAYLIST;
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

    loadSearchResult(track, result, pageNum = 1, callBack = null) {

        $page.myVues.playlist.header.$data.TEXT = 'Search Results';  //<br />' + track.ARTIST + '<br />' + track.TITLE;
        $page.myVues.playlist.header.$data.URL = '#page-playlist';
        $page.myVues.playlist.header.$data.URL_TARGET = '_self';
        $page.myVues.playlist.menu.$data.CUR_PAGE = pageNum;
        $page.myVues.playlist.menu.$data.MAX_PAGES = 1;
        $page.myVues.playlist.menu.$data.LASTFM_USER_NAME = track.VIDEO_ID;
        $page.myVues.playlist.menu.$data.PLAYLIST = 'search';
        $page.myVues.playlist.content.$data.SEARCH_TRACK = track;
        $page.myVues.playlist.content.$data.TRACKS = result;

        if (callBack != null) {
            callBack(true);
        }
    }

    loadTopSongsPlayListPage(pageNum = 1, callBack = null, ignoreTitle = false) {

        $.getJSON('php/json/JsonHandler.php?api=topsongs&data=playlist&page=' + pageNum, function (json) {

            if ($player.CURRENT_TRACK != null) {
                let newCurTrack = null;
                for (let cnt = 0; cnt < json.data.value.TRACKS.length; cnt++) {
                    let track = json.data.value.TRACKS[cnt];

                    if ($player.isCurrentTrack(track)) {
                        newCurTrack = track;
                        break;
                    }
                }

                if (newCurTrack != null) {
                    $player.setCurrentTrack(newCurTrack);
                }
            }

            $page.myVues.playlist.update(json.data.value, ignoreTitle);

            try {
                if (callBack != null) {
                    callBack(true);
                }
            } catch (e) {
                console.error('error in load topsongs list callback function', e);
                console.error('Callback: ', callBack);
                console.error('page: ', pageNum, ' user: ', user, ' callback ', callBack);
            }
        }).fail(function (xhr) {
            console.error('error loading topsongs');
            console.log(xhr.responseText);

            try {
                if (callBack != null) {
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
        let tracksPerPage = this.TRACKS_PER_PAGE;
        pageNum = this.updateUserListPages(pageNum);
        let pageCount = tracks.length <= 0 ? 0 : parseInt(tracks.length / tracksPerPage);
        let endIndex = pageNum * tracksPerPage;
        let startIndex = endIndex - tracksPerPage;

        if (endIndex >= tracks.length) {
            tracks = tracks.slice(startIndex);
        } else {
            tracks = tracks.slice(startIndex, endIndex);
        }

        if ($player.CURRENT_TRACK != null) {
            let newCurTrack = null;
            for (let cnt = 0; cnt < tracks.length; cnt++) {
                let track = tracks[cnt];

                if ($player.isCurrentTrack(track)) {
                    newCurTrack = track;
                    break;
                }
            }

            if (newCurTrack != null) {
                $player.setCurrentTrack(newCurTrack);
            }
        }
        
        $page.myVues.playlist.update({
            HEADER: {
                PLAYLIST: 'userlist',
                TEXT: 'My Songs',
                URL: ''
            },

            LIST_MENU: {
                CUR_PAGE: pageNum,
                MAX_PAGES: pageCount,
                LASTFM_USER_NAME: '',
                PLAYLIST: 'userlist'

            },

            TRACKS: tracks
        }, ignoreTitle);


        if (callBack != null) {
            callBack(true);
        }
    }

    isValidUser(user = null) {
        return user !== null && (user + '').trim().length > 0;
    }

    loadDefaultPlayListPage(pageNum = 1, user = null, callBack = null, ignoreTitle = false) {

        let request = null;

        if (this.isValidUser()) {
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

                if ($player.CURRENT_TRACK != null) {
                    let newCurTrack = null;
                    for (let cnt = 0; cnt < json.data.value.TRACKS.length; cnt++) {
                        let track = json.data.value.TRACKS[cnt];

                        if ($player.isCurrentTrack(track)) {
                            newCurTrack = track;
                            break;
                        }
                    }

                    if (newCurTrack != null) {
                        $player.setCurrentTrack(newCurTrack);
                    }
                }


                $page.myVues.playlist.update(json.data.value, ignoreTitle);
                /**
                Vue.nextTick()
                    .then(function () {
                        // DOM updated
                        $page.myVues.playlist.update(json.data.value, ignoreTitle);
                    });
                **/
                
                if (callBack != null) {
                    callBack(true);
                }
            } catch (e) {
                console.error('error in load default list callback function', e);
                console.error('Callback: ', callBack);
                console.error('page: ', pageNum, ' user: ', user, ' callback ', callBack);
            }
        }).fail(function (xhr) {
            console.error('error loading page');
            console.log(xhr.responseText);
            if (callBack != null) {
                callBack(false);
            }
        });
    }

    getUserTracks() {
        let userStore = this.userStore;
        if (!userStore.isSet('userlist.tracks')) userStore.set('userlist.tracks', new Array());
        return userStore.get('userlist.tracks');
    }

    setUserTracks(tracks) {
        this.userStore.set('userlist.tracks', tracks);
    }

    updateUserListPages(pageNum = null) {
        let tracks = this.getUserTracks();
        if (tracks.length <= 0) return 0;

        let tracksPerPage = this.TRACKS_PER_PAGE;
        let vueMap = this.vueMap;
        let pageCount = parseInt(tracks.length / tracksPerPage);
        if ((tracks.length % tracksPerPage) > 0) pageCount++;

        if (pageNum != null) {
            if (pageNum > pageCount) pageNum = pageCount;
            else if (pageNum < 1) pageNum = 1;
        } else pageNum = parseInt(this.myVues.playlist.menu.$data.CUR_PAGE);


        return pageNum;
    }
}