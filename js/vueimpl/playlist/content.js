/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class LibvuePlaylistContent {
	
static createVue(elementId){
	return new Vue({
            el: '#'+elementId+'>.page-content',
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
                            $player.playerWindow.ytPlayer.pauseVideo();
                        } else if ($player.isPaused()) {
                            $player.playerWindow.ytPlayer.playVideo();
                        } else {
                            console.log('unbekannter zustand für play/pause');
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
}