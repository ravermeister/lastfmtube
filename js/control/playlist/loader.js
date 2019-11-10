/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class PlaylistLoader {
	
	constructor(playlist){
		this.playlistControl = playlist;
	}
	
    loadVideoCommentList(videoId, pagetoken=false) {
    	if(pagetoken===false && $player.commentsLoaded &&
    			$player.currentTrackData.videoId === videoId) {
// console.log('Comments for Video {} %s already loaded', videoId);
    		return;
    	}    	
// console.log('load comments for video', videoId);
    	
    	let request = 'php/json/page/YouTube.php?action=videoComments' +
        		'&videoId=' + videoId;
    	if(pagetoken!==false) {
    		request += '&pageToken=' + pagetoken;
    	}
    	
    	$.getJSON(request, function(json){
    		if(pagetoken===false) {    			
    			$page.myVues.video.youtube.comments.update(json.data.value);   		
    		} else {
    			$page.myVues.video.youtube.comments.append(json.data.value);
    		}
    		
    		$player.commentsLoaded = true;
    	}).fail(function (xhr) {
    		console.error('request failed');
            $.logXhr(xhr);

            if (typeof callBack === 'function') {
                callBack(false);
            }
        });
    }
    
    loadTopUser(pageNum = 1, callBack = null) {

        let request = 'php/json/page/Playlist.php?list=topuser&page=' + pageNum;

        $.getJSON(request, function (json) {

            $page.myVues.userlist.topuser.update(json.data.value);

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
    
    loadCustomerList(pageNum = 1, callBack = null) {

        let tracks = this.playlistControl.getUserTracks();
        let tracksPerPage = $page.settings.general.tracksPerPage;
        pageNum = this.playlistControl.updateUserListPages(pageNum, tracks);
                
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

        let data = {
	        HEADER: {
	            PLAYLIST: $page.menu.getMenuItem('userlist').PLAYLIST,
	            TEXT: $page.menu.getMenuItem('userlist').TEXT,
	            URL: $page.menu.getMenuItem('userlist').LDATA
	        },
	
	        TRACKS: tracks
        };
        
        if (typeof callBack === 'function') {
            callBack(true, data);
        } else {
            $page.myVues.playlist.update(data);
        }
    }
    
    loadLastFmList(pageNum = 1, user = null, callBack = null) {

        let request = null;

        if (this.playlistControl.isValidUser(user)) {
            request = 'php/json/page/Playlist.php?list=playlist' +
                '&user=' + user +
                '&page=' + pageNum
            ;
        } else {
            request = 'php/json/page/Playlist.php?list=playlist' +
                '&page=' + pageNum
            ;
        }

        $.getJSON(request, function (json) {

            try {
                if (typeof callBack === 'function') {
                    callBack(true, json.data.value);
                } else {                	
                	$page.myVues.playlist.lastfm.update(json.data.value);
                }
            } catch (e) {
                console.error('error in load default list callback function', e);
                console.error('Callback: ', callBack);
                console.error('page: ', pageNum, ' user: ', user, ' callback ', callBack);
            }
        }).fail(function (xhr) {

            $.logXhr(xhr);

            if (typeof callBack === 'function') {
                callBack(false, null);
            }
        });
    }
    
    loadSearchResult(needle, pageNum = 1, callBack = null) {

        let request =
            'php/json/page/YouTube.php?action=search&size=50&needle='
        		+ needle.asVar();
        $.getJSON(request, function (json) {

            let trackCnt = json.data.value.length;
            let maxPages = 1;
            let tracks = [];
            let savedVid = needle.videoId;
            if (trackCnt > 0) {
                maxPages = trackCnt / $page.settings.general.tracksPerPage | 0;
                if (trackCnt % $page.settings.general.tracksPerPage > 1) maxPages++;

                for (let cnt = 0; cnt < trackCnt; cnt++) {
                    let ytvid = json.data.value[cnt];
                    let track = {
                        NR: (cnt + 1) + '',
                        ARTIST: '',
                        TITLE: ytvid.TITLE,
                        VIDEO_ID: ytvid.VIDEO_ID,
                        PLAYLIST: $page.loader.pages.playlist.search.value,
                        PLAYCOUNT: null,
                        PLAYSTATE: '',
                        PLAY_CONTROL: ''
                    };
                    if ($player.isCurrentTrack(track)) {
                        track.PLAYSTATE = $player.currentTrackData.track.PLAYSTATE;
                        track.PLAY_CONTROL = $player.currentTrackData.track.PLAY_CONTROL;
                        $player.setCurrentTrack(track);
                    }
                    tracks[cnt] = track;
                }
            }
            if(pageNum === null || pageNum < 1) {
            	pageNum = 1
            } else if(pageNum > maxPages) {
            	pageNum = maxPages;
            }

            let perPage = parseInt($page.settings.general.tracksPerPage);
            let startPos = (pageNum - 1) * perPage;
            let endPos = startPos + perPage;
    
            let searchData = {
                HEADER: {
                    TEXT: 'Search Results'
                },

                LIST_MENU: {
                    CUR_PAGE: pageNum,
                    MAX_PAGES: maxPages,
                    PLAYLIST: 'playlist.search',
                    SAVED_VIDEO_ID: savedVid,
                    SEARCH_NEEDLE: needle,
                    SEARCH_RESULT: tracks
                },

                TRACKS: tracks.slice(startPos, endPos)
            };
           
            
            if (typeof callBack === 'function') {
                callBack(true, searchData);
            } else {
            	$page.myVues.playlist.search.update(searchData);
            }

        }).fail(function (xhr) {
            if (typeof xhr === 'object' && xhr !== null) {
                console.error(
                    'request: ', request,
                    '\n\nresponse: ', xhr.responseText,
                    '\n\nstatus: ', xhr.status,
                    '\n\nerror: ', xhr.statusText
                );
            } else {
                console.log('request: ', request, 'error');
            }
            
            callBack(false, null);
        });
    }
    
    loadTopSongs(pageNum = 1, sortBy = null, callBack = null) {

    	let request = 'php/json/page/Playlist.php?list=topsongs&page=' + pageNum;
    	if(sortBy !== null) {
    		request += '&sortby='+sortBy
    	}
    	
        $.getJSON(request, function (json) {					
			try {
			    if (typeof callBack === 'function') {
			        callBack(true, json.data.value);
			    } else {
					$page.myVues.playlist.topsongs.update(json.data.value);
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
                    callBack(false, null);
                }
            } catch (e) {
                console.error('error in load topsongs list callback function', e);
                console.error('Callback: ', callBack);
                console.error('page: ', pageNum, ' user: ', user, ' callback ', callBack);
            }
        });
    }
}