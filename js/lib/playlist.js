class PlaylistController {

    constructor() {
        this.userStore = Storages.localStorage;
    }
    
    loadTopUserPlayListPage(pageNum = 1, callBack = null) {

        let request = 'php/json/JsonHandler.php?api=topusers?page=' + pageNum;

        $.getJSON(request, function (json) {
            
        }).fail(function (xhr) {
            console.error(xhr.responseText);
        });
    }

    loadPlaylistPage(pageNum = 1, user = null, callBack = null, playlist = null) {
        
        if (playlist == null) playlist = this.PLAYLIST;

        $page.setCurrentPlayList(playlist);

        switch (playlist) {
            case 'userlist':
                this.loadUserPlayListPage(pageNum, callBack);
                break;
            case 'topsongs':
                this.loadTopSongsPlayListPage(pageNum, callBack);
                break;
            case 'topuser':
                this.loadTopUserPlayListPage(pageNum, callBack);
                break;
            default:
                this.loadDefaultPlayListPage(pageNum, user, callBack);
                break;
        }
    }

    loadSearchResult(track, result, pageNum = 1, callBack = null) {
        let vueMap = this.vueMap;

        vueMap['PLAYLIST_HEADER'].$data.TEXT = 'Search Results';  //<br />' + track.ARTIST + '<br />' + track.TITLE;
        vueMap['PLAYLIST_HEADER'].$data.URL = '#page-playlist';
        vueMap['PLAYLIST_HEADER'].$data.URL_TARGET = '_self';
        vueMap['PLAYLIST_NAV'].$data.CUR_PAGE = pageNum;
        vueMap['PLAYLIST_NAV'].$data.MAX_PAGES = 1;
        vueMap['PLAYLIST_NAV'].$data.LASTFM_USER_NAME = track.VIDEO_ID;
        vueMap['PLAYLIST_NAV'].$data.PLAYLIST = 'search';

        vueMap['PLAYLIST_TRACKS'].$data.SEARCH_TRACK = track;
        vueMap['PLAYLIST_TRACKS'].$data.TRACKS = result;

        if (callBack != null) {
            callBack(true);
        }
    }

    loadTopSongsPlayListPage(pageNum = 1, callBack = null) {

        
        let request = 'php/json/JsonHandler.php?api=page&data=playlist' +
            '&type=topsongs' +
            '&page=' + pageNum
        ;

        $.getJSON(request, function (json) {

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

            $page.myVues.playlist.update(json.data.value);

            if (callBack != null) {
                callBack(true);
            }
        }).fail(function (xhr) {
            console.error('error loading topsongs');
            console.log(request);
            console.log(xhr.responseText);

            if (callBack != null) {
                callBack(false);
            }
        });
    }

    loadUserPlayListPage(pageNum = 1, callBack = null) {

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
                TEXT: 'My Playlist',
                URL: ''
            },

            LIST_MENU: {
                CUR_PAGE: pageNum,
                MAX_PAGES: pageCount,
                LASTFM_USER_NAME: '',
                PLAYLIST: 'userlist'

            },

            TRACKS: tracks
        });


        if (callBack != null) {
            callBack(true);
        }
    }

    loadDefaultPlayListPage(pageNum = 1, user = null, callBack = null) {

        let request = null;

        if (user != null) {
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

            $page.myVues.playlist.update(json.data.value);

            try {
                if (callBack != null) {
                    callBack(true);
                }
            } catch (e) {
                console.error('error in load default list');
                console.log(e);
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
        if(tracks.length <= 0) return 0;
        
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