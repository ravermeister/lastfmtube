class LibvuePlaylist {
    
    constructor() {
        LibvuePlaylist.YOUTUBE_URL_REGEX = /^http(s?):\/\/(www\.)?(m\.)?youtu(\.be|be\.com)\//g;

        this.header = {
            title: new Vue({
                el: '#playlist-container>.page-header-title>h2',
                data: {
                    TEXT: '',
                    PLAYLIST: '',
                    LOADING: false
                },
                computed: {
                    LOGO: function () {
                        let icon = PageController.icons.getPlaylistIcon(this.$data.PLAYLIST);
                        return this.LOADING ? icon.animatedBig : icon.big;
                    }
                },
                methods: {
                    update: function (json) {
                        if ('undefined' !== typeof json.HEADER) {
                            this.$applyData(json.HEADER);
                        }
                    }
                }
            }),

            menu: new Vue({
                el: '#playlist-container>.page-header-nav',
                data: {
                    PLAYLIST: null
                },

                computed: {
                    MENUS: function () {
                        return this.$getMenuForPlaylist(this.$data.PLAYLIST);
                    }
                }
            })
        };

        this.menu = new Vue({
            el: '#playlist-container>.page-nav',
            data: {
                LASTFM_USER_NAME_LABEL: 'User',
                LASTFM_USER_NAME: '',
                CUR_PAGE_LABEL: 'Page',
                PAGES_OF_LABEL: 'of',
                MAX_PAGES: 0,
                CUR_PAGE: 0,
                PLAYLIST_LOAD: 'Load',
                PLAYLIST: 'undefined',
                SORTBY: {
                	LABEL: 'Sort by',
                	VALUES: ['Playcount', 'Date'],
                	SELECTED: 'Playcount',                	
                },

                SAVED_VIDEO_ID: '',
                SEARCH_VIDEO_ID: '',
                SEARCH_NEEDLE: null,
                SEARCH_RESULT: []
            },

            computed: {

                /**
				 * @return {string}
				 */
                SAVED_TITLE: function () {
                    return this.SAVED_VIDEO_ID !== null &&
                    this.SAVED_VIDEO_ID.length > 0 &&
                    this.SAVED_VIDEO_ID === this.SEARCH_VIDEO_ID ?
                        'Saved' : '&nbsp;';
                }
            },

            methods: {
            	sortBy: function(event) {
            		console.log('>>>', event);
            		if(undefined === event.target)  {
            			return;
            		}
            		
            		let newSort = event.target.value;
            		if(newSort==this.$data.SORTBY.SELECTED) {
            			return;
            		}
            		
            		console.log('reload tracks with sort order: '+newSort);
            		console.log(event);
            		this.$data.SORTBY.SELECTED = newSort;
            		return true;
            		
            	},
                loadPage: function (user, pageNum) {
                    if (this.$data.PLAYLIST === 'search') {
                        let start = (pageNum - 1) * PageController.TRACKS_PER_PAGE;
                        let end = pageNum * PageController.TRACKS_PER_PAGE;
                        let tracks = [];
                        if (this.$data.SEARCH_RESULT.length > start) {
                            tracks = this.$data.SEARCH_RESULT.slice(start, end);
                        }

                        $page.myVues.playlist.content.update({
                            TRACKS: tracks
                        });
                        this.$data.CUR_PAGE = pageNum;
                        return;
                    }

                    $page.setLoading(PageController.article.playlist.dom(), true);
                    $page.loadList(pageNum, user, function () {
                        $page.setLoading(PageController.article.playlist.dom());
                    });
                },

                loadNextPage: function (user, pageNum, maxPages) {
                    pageNum++;
                    if (pageNum > maxPages) pageNum = 1;
                    this.loadPage(user, pageNum);
                },

                loadPrevPage: function (user, pageNum, maxPages) {
                    pageNum--;
                    if (pageNum <= 0) pageNum = maxPages;
                    this.loadPage(user, pageNum);
                },

                update: function (json) {

                    if ('undefined' !== typeof json.LIST_MENU) {
                        this.$applyData(json.LIST_MENU);
                        this.SEARCH_VIDEO_ID = this.SAVED_VIDEO_ID;
                    }
                },

                selectOnMouseUp: function (event) {

                    let value = $(event.target).val().trim();
                    if (value !== null && value !== '') {
                        $(event.target).trigger('select');
                    }
                },

                normalizeYouTubeUrl: function (event) {

                    let field = $(event.target);
                    let url = $(field).val();
                    if (!LibvuePlaylist.YOUTUBE_URL_REGEX.test(url)) {
                        $(field).val('');
                        return;
                    }

                    let videoId = $.urlParam('v', url);
                    if (videoId === null) {
                        videoId = url.replace(LibvuePlaylist.YOUTUBE_URL_REGEX, '');
                    }

                    if (this.SEARCH_VIDEO_ID === videoId) this.$forceUpdate();
                    else this.SEARCH_VIDEO_ID = videoId;
                    $(field).trigger('blur');
                    $player.ytPlayer.loadVideoById(videoId);
                },

                setVideo: function (vid) {
                    $page.myVues.playlist.setVideo(vid);
                },

                unsetVideo: function (event, track) {
                    let needle = $page.createNeedle(track.ARTIST, track.TITLE, track.VIDEO_ID);
                    $page.myVues.playlist.unsetVideo(needle);
                }
            }
        });

        this.content = new Vue({
            el: '#playlist-container>.page-content',
            data: {
                TRACK_NR: 'Nr',
                TRACK_ARTIST: 'Artist',
                TRACK_TITLE: 'Title',
                TRACK_LASTPLAY: 'Lastplay',
                TRACKS: [LibvuePlaylist.createEmptyTrack()]
            },

            methods: {

                showPlay: function (track, show) {
                    if ($player.isCurrentTrack(track)) {
                        return;
                    }
                    track.PLAYSTATE = show ? 'stop' : '';
                    $page.QUICKPLAY_TRACK = show ? track : null;

                },

                addToUserList: function (event, track) {
                    $playlist.addUserTrack(track);
                },

                removeFromUserList: function (tracks, track) {
                    let curPage = $page.myVues.playlist.menu.$data.CUR_PAGE;
                    let curIndex = tracks.indexOf(track);

                    $playlist.removeUserTrack(curIndex);
                    $playlist.loadCustomerList(curPage);

                    tracks = $page.myVues.playlist.content.$data.TRACKS;
                    if (tracks.length > 0) {
                        if (tracks.length > curIndex) {
                            this.togglePlayControl(tracks[curIndex]);
                        } else {
                            this.togglePlayControl(tracks[tracks.length - 1]);
                        }
                    }
                },

                clearUserList: function () {
                    $playlist.setUserTracks();
                    $playlist.loadCustomerList();
                },

                togglePlay: function (track) {

                    if ($player.isCurrentTrack(track)) {
                        if ($player.isPlaying()) {
                            $player.ytPlayer.pauseVideo();
                        } else if ($player.isPaused()) {
                            $player.ytPlayer.playVideo();
                        } else {
                            console.log('unbekannter zustand für play/pause');
                            console.log(track_icon);
                        }
                    } else if ($page.QUICKPLAY_TRACK === track) {
                        $player.errorLoopCount = 0;
                        $player.loadSong(track);
                    } else {
                        console.log('unbekannter track');
                        console.log(track);
                    }
                },

                togglePlayControl: function (track) {
                    if ($page.PLAY_CONTROL !== null && $page.PLAY_CONTROL !== track) {
                        $page.PLAY_CONTROL.PLAY_CONTROL = false;
                    }
                    if (track.PLAYLIST === 'search') {
                        $page.myVues.playlist.menu.$data.SEARCH_VIDEO_ID = track.VIDEO_ID;
                    }

                    track.PLAY_CONTROL = !track.PLAY_CONTROL;
                    $page.PLAY_CONTROL = track;
                },

                update: function (json) {
                    if ('undefined' !== typeof json.LIST_HEADER) {
                        this.$applyData(json.LIST_HEADER);
                    }

                    if ('undefined' !== typeof json.TRACKS) {
                        let newTracks = [];
                        let curTrack = $player.currentTrackData.track;
                        if (curTrack !== null) {
                            for (let cnt = 0; cnt < json.TRACKS.length; cnt++) {
                                let track = json.TRACKS[cnt];
                                if ($player.isCurrentTrack(track)) {
                                    track.PLAY_CONTROL = curTrack.PLAY_CONTROL;
                                    track.PLAYSTATE = curTrack.PLAYSTATE;
                                    $player.currentTrackData.track = track;
                                }
                                newTracks[cnt] = track;
                            }
                        } else newTracks = json.TRACKS;
                        this.$data.TRACKS = newTracks;
                    }
                },

                trackInfo: function (track) {
                    let title = 'last Played: ' + track.LASTPLAY;
                    if (typeof track.PLAYCOUNT !== 'undefined') {
                        title = 'Playcount: ' + track.PLAYCOUNT + ' | ' + title;
                    }
                    return title;
                },

                playTrack: function (track) {
                    $player.errorLoopCount = 0;
                    $player.loadSong(track);
                },

                searchVideos: function (event, track) {
                    let curArticle = $(event.target).closest('article');
                    $page.setLoading(curArticle, true);
                    let callBack = function (success = false) {
                        if (!success) {
                            console.log('error for searching vidéos for song');
                        }
                        $page.setLoading(curArticle);
                    };
                    $player.searchSong(track, callBack);
                },
                setVideo(vid) {
                    $page.myVues.playlist.setVideo(vid);
                },
                unsetVideo(track) {
                    let needle = $page.createNeedle(track.ARTIST, track.TITLE, track.VIDEO_ID);
                    $page.myVues.playlist.unsetVideo(needle);
                }
            }
        });
    }

    static createEmptyTrack() {
        return {
            NR: '',
            ARTIST: '',
            TITLE: '',
            LASTPLAY: '',
            LASTFM_ISPLAYING: false,
            VIDEO_ID: '',
            PLAY_CONTROL: '',
            PLAYLIST: '',
            PLAYSTATE: ''
        };
    }

    setVideo(videoId = '') {
        let callback = function (success) {
            if (success) {
                $page.myVues.playlist.menu.$data.SAVED_VIDEO_ID = videoId;
                return;
            }
            console.log('error saving video id');
        };

        let needle = $page.createNeedle(
            $page.myVues.playlist.menu.$data.SEARCH_NEEDLE.artist,
            $page.myVues.playlist.menu.$data.SEARCH_NEEDLE.title,
            videoId
        );

        $page.saveVideo(needle, callback);
    }

    unsetVideo(needle = null) {
        let callback = function (success = false) {
            if (success) {
                if ($page.myVues.playlist.menu.$data.PLAYLIST !== 'search') {
                    for (let cnt in $page.myVues.playlist.content.$data.TRACKS) {
                        let track = $page.myVues.playlist.content.$data.TRACKS[cnt];
                        if (track.VIDEO_ID === needle.videoId) {
                            track.VIDEO_ID = '';
                        }
                    }
                } else {
                    $page.myVues.playlist.menu.SAVED_VIDEO_ID = '';
                }
            }
        };

        $page.deleteVideo(needle, callback);
    }

    getTracks(json) {
        let pdata = null;
        if ('undefined' !== typeof json.playlist.LIST.HEADER)
            pdata = json.playlist.LIST.HEADER;
        if ('undefined' !== typeof json.playlist.LIST.CONTENT)
            pdata.TRACKS = json.playlist.LIST.CONTENT;
        return pdata === null ? {} : pdata;
    }

    update(json) {
        this.content.update(json);
        this.menu.update(json);
        this.header.title.update(json);
    }

}