/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class PlaylistController {

    constructor() {
        this.userStore = Storages.localStorage;
        this.loader = new PlaylistLoader(this);
    }

    isValidUser(user = null) {
        return user !== null && (user + '').trim().length > 0;
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
            PLAYLIST: $page.loader.pages.playlist.user.value,
            PLAYSTATE: ''
        };


        tracks.push(newTrack);
        this.setUserTracks(tracks);
    }

    removeUserTrack(index = -1) {
        let tracks = this.getUserTracks();
        if (index >= tracks.length || index < 0 || tracks.length === 0) return;
        
        let pageNum = $page.myVues.playlist.user.menu.$data.CUR_PAGE;
        let offset = ((pageNum - 1) * $page.settings.general.tracksPerPage);
        tracks.splice(offset + index, 1);
        this.setUserTracks(tracks);
    }

    updateUserListPages(pageNum = null, tracks = null) {

        $page.myVues.playlist.user.menu.$data.LASTFM_USER_NAME = '';
        $page.myVues.playlist.user.menu.$data.PLAYLIST = 'userlist';

        if (tracks === null) tracks = this.getUserTracks();
        if (tracks.length <= 0) {
            $page.myVues.playlist.user.menu.$data.CUR_PAGE = 1;
            $page.myVues.playlist.user.menu.$data.MAX_PAGES = 1;
            return 1;
        }

        let tracksPerPage = $page.settings.general.tracksPerPage;

        let pageCount = (tracks.length / tracksPerPage) | 0;

        if ((tracks.length % tracksPerPage) > 0) pageCount++;
        $page.myVues.playlist.user.menu.$data.MAX_PAGES = pageCount;

        if (pageNum === null) {
            pageNum = ($page.myVues.playlist.user.menu.$data.CUR_PAGE) | 0;
        }

        if (pageNum > pageCount) pageNum = pageCount;
        else if (pageNum < 1) pageNum = 1;

        $page.myVues.playlist.user.menu.$data.CUR_PAGE = pageNum;
        return pageNum;
    }
    
    
    saveVideo(needle = null) {

        if (needle === null || !needle.isValid()) return;

        let updateVue = function (vue, needle) {
            if (vue !== $page.myVues.playlist.search) {
            	if(vue.content.$data.TRACKS === null) return;
            	
                vue.content.$data.TRACKS.forEach(function (track) {
                    if (track.VIDEO_ID === needle.videoId) {
                        track.VIDEO_ID = needle.videoId;
                    }
                });
            } else {
                vue.menu.SAVED_VIDEO_ID = needle.videId;
            }           
        };

        $.ajax('php/json/page/YouTube.php?action=save-video', {
            dataType: 'json',
            method: 'POST',
            data: {
                artist: needle.artist,
                title: needle.title,
                videoId: needle.videoId
            }
        }).done(function (json) {

            let userTracks = $playlist.getUserTracks();
            for (let cnt = 0; cnt < userTracks.length; cnt++) {
                let uTrack = userTracks[cnt];
                if (
                    uTrack.TITLE === needle.title &&
                    uTrack.ARTIST === needle.artist
                ) {
                    uTrack.VIDEO_ID = json.data.value.url;
                }
            }
            $playlist.setUserTracks(userTracks);
            $page.loader.setLoading();
            $page.myVues.playlist.user.update({
                TRACKS: userTracks
            });            
            updateVue($page.myVues.playlist.lastfm, needle);
            updateVue($page.myVues.playlist.topsongs, needle);
                        
            $page.loader.loadPage($page.loader.pageInfo.lastPage.value, 
            		$page.loader.pageInfo.lastPage.data
            );
            
        }).fail(function (xhr) {
        	$page.loader.setLoading();
            $.logXhr(xhr);
        });
    }
    
    deleteVideo(needle = null) {

        if (needle === null || !needle.isValid()) return;

        let updateVue = function (vue, needle) {
            if (vue !== $page.myVues.playlist.search) {
            	if(vue.content.$data.TRACKS === null) return;
                vue.content.$data.TRACKS.forEach(function (track) {                	
                    if (track.VIDEO_ID === needle.videoId) {
                        track.VIDEO_ID = '';
                    }
                });
            } else {
                vue.menu.SAVED_VIDEO_ID = '';
            }           
        };
        
        $page.loader.setLoading(null, true);
        $.ajax('php/json/page/YouTube.php?action=delete-video', {
            dataType: 'json',
            method: 'POST',
            data: {
                artist: needle.artist,
                title: needle.title
            }
        }).done(function (json) {
            let userTracks = $playlist.getUserTracks();
            let curTrack = null;
            for (let cnt = 0; cnt < userTracks.length; cnt++) {
                let uTrack = userTracks[cnt];
                if (
                    uTrack.TITLE === needle.title &&
                    uTrack.ARTIST === needle.artist
                ) {
                    uTrack.VIDEO_ID = '';
                }
                if ($player.isCurrentTrack(uTrack)) {
                    $player.currentTrackData.track.VIDEO_ID = '';
                    curTrack = uTrack;
                }
            }
            $playlist.setUserTracks(userTracks);
            $page.loader.setLoading();
            $page.myVues.playlist.user.update({
                TRACKS: userTracks
            });            
            updateVue($page.myVues.playlist.lastfm, needle);
            updateVue($page.myVues.playlist.topsongs, needle);            
            
        }).fail(function (xhr) {
            $page.loader.setLoading();
            $.logXhr(xhr);
        });
    }
    
    updateSongPlayCount(vue, json, updateCurrent) {
    	    	
        let isTopSongPlaylist = (vue === $page.myVues.playlist.topsongs);

        let updateTrack = function(track){
        	let pchange = 0;
        	// only calculate change for topsongs and youtube page
        	// (other playlists don't make sense)
        	switch(json.data.value.PLAYLIST) {
        		case $page.loader.pages.playlist.topsongs.value:
        		case $page.loader.pages.video.youtube.value:
        			pchange = track.NR - json.data.value.NR;
        			break;
        	}
        	
        	track.PLAYCOUNT_CHANGE = pchange;
        	track.LASTPLAY = json.data.value.LASTPLAY;
            track.PLAYCOUNT = json.data.value.PLAYCOUNT;
            
        	return track;
        };
             
        let oldTrack = null;
        if('undefined' !== typeof vue.content.$data.TRACKS) {        	
        	for (let cnt=0; cnt<vue.content.$data.TRACKS.length; cnt++) {        		
        		let track = vue.content.$data.TRACKS[cnt];
        		
        		if (track.ARTIST === json.data.value.ARTIST &&
        				track.TITLE === json.data.value.TITLE
        		) {
        			oldTrack = track;
        			break;
        		}
        	}
        }
        
        if(oldTrack !== null) {
        	updateTrack(oldTrack);
        } else if (isTopSongPlaylist) {
    		if (vue.content.$data.TRACKS.length <= (vue.content.$data.MAX_PAGES - 2)) {
    			let newTrack = LibvuePlaylist.createEmptyTrack();    			
    			newTrack.NR = trackList.length;
    			newTrack.ARTIST = json.data.value.ARTIST;
    			newTrack.TITLE =  json.data.value.TITLE;
    			newTrack.LASTPLAY = json.data.value.LASTPLAYED;
    			newTrack.LASTFM_ISPLAYING = true;
    			newTrack.PLAY_CONTROL = '',
    			newTrack.PLAYLIST = $page.loader.pages.playlist.topsongs.value,
    			newTrack.PLAYSTATE = 'playling';    			
    			vue.content.$data.TRACKS.push(newTrack);
    		}
        }

        if(updateCurrent) {
        	let curTrack = $player.currentTrackData.track;        
        	if(curTrack !== null) {
        		updateTrack(curTrack);     		
        	}       
        	
        	/**
			 * TODO: in the youtube libvue implementation, initialize the
			 * CURRENT_TRACK with an empty Structure of the Track json from the
			 * backend. then it should react on attribute changes, and the
			 * update above should be enough
			 */
        	curTrack = PageController.clone(curTrack);
        	$page.myVues.video.youtube.header.CURRENT_TRACK = curTrack;
        	
        }
    }
}
