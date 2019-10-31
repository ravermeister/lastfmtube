/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class PlayerController {

    constructor() {
    	
    	// increase seek value after repeatable seek with
    	// same steps
    	this.seekTimeout = {    			
    			counter: 0,
    			limit: 5,
    			timeoutMilis: 500,
    			lastOccur: null
    	};
        this.playerWindow = null;
        this.isReady = false;
        this.autoPlay = false;
        this.loadNextOnError = true;
        this.maxErrorLoop = 5;
        this.lfmUser = '';
        this.errorLoopCount = 0;
        this.errorListeners = [];
        this.stateChangeListeners = [];
        this.ytStatus = {};
        this.commentsLoaded = false;
        this.currentTrackData = new TrackData();
        this.chartTimer = new ChartTimer(this);
        
        let self = this;
        
        this.addStateChangeListener(function (event) {
            switch (event.data) {
                case self.playerWindow.status.PLAYING.ID:
                    self.errorLoopCount = 0;
                    self.setCurrentState('play');
                    break;
                case self.playerWindow.status.PAUSED.ID:
                	self.setCurrentState('pause');
                    break;
                case self.playerWindow.status.BUFFERING.ID:
                	self.setCurrentState('load');
                    break;
                case self.playerWindow.status.ENDED.ID:
                	self.setCurrentState('stop');
                	self.loadNextSong();
                    break;
            }
        });
        this.addErrorListener(function (event) {
        	self.errorLoopCount++;

            if ($page.myVues.playlist.menu.$data.PLAYLIST === 'search') {
                $page.myVues.playlist.menu.$data.SEARCH_VIDEO_ID = '';
            }

            if (self.errorLoopCount >= self.maxErrorLoop) {
                console.error('maximum error loop reached');
                return;
            }
            self.setCurrentState('stop');
            self.loadNextSong();
        });
    }

    initWindow(callBack) {
    	this.playerWindow = new PlayerWindow(callBack);
    } 
    
    addErrorListener(l = null) {
        if ('function' !== typeof l || this.errorListeners.indexOf(l) !== -1) return;
        this.errorListeners.push(l);
    }

    removeErrorListener(l) {
        let index = this.errorListeners.indexOf(l);
        if (index < 0 || index >= this.errorListeners.length) return;
        this.errorListeners.splice(index, 1);
    }

    addStateChangeListener(l) {
        if (typeof l !== 'function' || this.stateChangeListeners.indexOf(l) !== -1) return;
        this.stateChangeListeners.push(l);
    }

    removeStateChangeListeners() {
        let index = this.stateChangeListeners.indexOf(l);
        if (index < 0 || index >= this.stateChangeListeners.length) return;
        this.stateChangeListeners.splice(index, 1);
    }

    loadNextSong() {

        let tracks = $page.myVues.playlist.content.$data.TRACKS;

        if (tracks.length === 0) return;
        let curTrack = this.currentTrackData.track;
        if(curTrack !== null) {
        	console.log('!!!!', parseInt(curTrack.NR), (parseInt(curTrack.NR) % $page.settings.general.tracks_perpage));
        }
        
        let nextIndex = curTrack !== null ?
            (parseInt(curTrack.NR) % $page.settings.general.tracks_perpage) : 0;
        let isLast = curTrack !== null && ($page.myVues.playlist.menu.$data.CUR_PAGE *
            $page.settings.general.tracks_perpage) === parseInt(curTrack.NR);

        if (isLast || nextIndex >= tracks.length) {
            let playlist = $page.myVues.playlist.menu;
            let curPage = playlist.$data.CUR_PAGE;
            let maxPages = playlist.$data.MAX_PAGES;
            let user = playlist.$data.LASTFM_USER_NAME;
            if ((curPage + 1) > maxPages) curPage = 1;
            else curPage++;

            let self = this;
            $page.loadList(curPage, user, function (success) {
                try {
                    if (!success) return;
                    let tracks = $page.myVues.playlist.content.$data.TRACKS;
                    self.loadSong(tracks[0]);
                } catch (e) {
                    console.error('inside callback', e, ' curpage: ', curPage, 'maxpage: ', maxPages);
                }
            });

            return;
        } else if (nextIndex < 0) {
            nextIndex = 0;
        }

        console.log(tracks[nextIndex], '<<<<< index >>>>', nextIndex);
        this.loadSong(tracks[nextIndex]);
    }

    loadPreviousSong() {

        let curTrack = this.currentTrackData.track;
        if (curTrack === null) return;
        let tracks = $page.myVues.playlist.content.$data.TRACKS;
        if (tracks.length === 0) return;
        let isLast = curTrack !== null && ($page.myVues.playlist.menu.$data.CUR_PAGE *
            $page.settings.general.tracks_perpage) === parseInt(curTrack.NR);
        let prevIndex = (parseInt(curTrack.NR) % $page.settings.general.tracks_perpage) - 2;

        if (isLast) {
            prevIndex = tracks.length - 2;
        } else if (prevIndex < 0) {
            let curPage = $page.myVues.playlist.menu.$data.CUR_PAGE;
            if ('undefined' === typeof curPage) curPage = 1;
            let maxPages = $page.myVues.playlist.menu.$data.MAX_PAGES;
            let user = $page.myVues.playlist.menu.$data.LASTFM_USER_NAME;

            if ((curPage - 1) < 1) curPage = maxPages;
            else curPage--;
            
            let self = this;
            $page.loadList(curPage, user, function (success) {
                if (!success) return;
                tracks = $page.myVues.playlist.content.$data.TRACKS;
                self.loadSong(tracks[tracks.length - 1]);
            });
            return;
        }

        this.loadSong(tracks[prevIndex]);
    }

    setCurrentTrack(track, force = false) {
        if (!force && this.isCurrentTrack(track)) return;
        let curTrack = this.currentTrackData.track;

        if (curTrack !== null) {
            this.setCurrentState();
            this.currentTrackData.track = null;
        }

        this.currentTrackData.track = track;
        $page.myVues.youtube.header.$data.CURRENT_TRACK = track;
        if (track.PLAYLIST !== 'search') $page.myVues.youtube.header.SEARCH_TRACK = track;
        this.setCurrentState('load');
    }

    setCurrentState(newState = '') {
        let curTrack = this.currentTrackData.track;
        if (curTrack === null || curTrack.PLAYSTATE === newState) return;
        curTrack.PLAYSTATE = newState;
        $page.myVues.youtube.menu.$data.PLAYSTATE = newState;
    }

    loadSong(track) {

        // console.log(this.playerWindow.ytPlayer);
        if (this.playerWindow === null || this.playerWindow.ytPlayer === null) 
        	return;

        this.setCurrentTrack(track);

        let needle = $page.createNeedle(track.ARTIST, track.TITLE, track.VIDEO_ID);
        if (needle.isValid(true)) {
            this.loadVideo(needle.videoId);
            return;
        }

        if (!needle.isValid()) {
            if (this.errorLoopCount > this.maxErrorLoop) {
                console.error('maximum error loop reached');
                return;
            }
            this.errorLoopCount++;
            if (this.loadNextOnError) this.loadNextSong();
            return;
        }

        let self = this;
        let request = 'php/json/page/YouTube.php?action=search&needle=' + needle.asVar();
        $.ajax(request, {
            dataType: 'json',
            method: 'GET'
        }).done(function (search) {
            needle.applyData(search);
            self.loadVideo(needle.videoId);
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
        });
    }

    searchSong(track, callBack = null, loadPage = false) {
        let needle = $page.createNeedle(track.ARTIST, track.TITLE, track.VIDEO_ID);
        
        if (!needle.isValid()) {
            console.error('needle is invalid exit search');
            return;
        }

        let myCallBack = function(result) {
       	
        	if(result && loadPage) {  		
        		$page.load('search');
        	} 
        	
        	if (typeof callBack === 'function') {
    			callBack(result);
    		}
    	};
        
        let request =
            'php/json/page/YouTube.php?action=search' +
            '&size=50&needle=' + needle.asVar();
        $.getJSON(request, function (json) {
        	$playlist.loadSearchResult(needle, json, 1, myCallBack);            
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
            
            myCallBack(false);
        });
    }
    
    loadDefaultVideo() {
    	
    	let videoId = 'nN7oJuz_KH8';
    	
    	if($page.settings.general.errorVideo !== '') {
    		videoId = $page.settings.general.errorVideo;
    	}
		
        console.log('load default video', videoId);
        this.loadVideo(videoId);	   
    }

    loadVideo(videoId = '') {
        if (typeof videoId !== 'undefined' && videoId !== null && videoId.length > 0) {
            this.playerWindow.ytPlayer.loadVideoById(videoId);
            this.commentsLoaded = false;
            
            this.currentTrackData.videoId = videoId;
            this.currentTrackData.lfmUser = $page.myVues.playlist.menu.$data.LASTFM_USER_NAME;
            if($page.myVues.youtube.comments.showComments) {
            	$playlist.loadVideoCommentList(this.currentTrackData.videoId);
            }
        } else {
            if (this.errorLoopCount > this.maxErrorLoop) {
                console.error('maximum error loop reached');
                alert("Error, couldn't find any Songs on Youtube.\n\n" 
                		+ "probably the Requests to Last.fm/Youtube exceeded their API Limits. "
                		+ "E.g at YouTube you only have 10000 Requests per day for free (for personal use). " 
                		+ "If you know what to do, to get a higher Limit let me know :)"
                );
                
                // load the default video
                this.loadDefaultVideo();
                if($page.myVues.youtube.comments.showComments) {
                	$playlist.loadVideoCommentList(this.currentTrackData.videoId);
                }
                return;
            }
            
            
            this.errorLoopCount++;
            if (this.loadNextOnError) {
                this.loadNextSong();
            }
        }
    }


    isCurrentTrack(track) {
        let curTrack = this.currentTrackData.track;
        if (curTrack === null) return false;        
        let checkNr = curTrack.PLAYLIST !== 'topsongs';
        
        let isEqual = curTrack !== null && (

            curTrack === track || (
                (!checkNr || parseInt(curTrack.NR) === parseInt(track.NR)) &&
                curTrack.PLAYLIST === track.PLAYLIST &&
                curTrack.ARTIST === track.ARTIST &&
                curTrack.TITLE === track.TITLE
            ));

        return isEqual;
    }

    isPlaying() {
        return this.playerWindow.ytPlayer.getPlayerState() === this.playerWindow.PLAYING.ID;
    }

    isPaused() {
        return this.playerWindow.ytPlayer.getPlayerState() === this.playerWindow.PAUSED.ID;
    }
    
    togglePlay(){
        if (this.isPlaying()) {
        	this.playerWindow.ytPlayer.pauseVideo();
        } else {
        	this.playerWindow.ytPlayer.playVideo();
        }        
    }
    
    volumeUp(interVal = 5) {
    	let curVol = this.playerWindow.ytPlayer.getVolume();
    	let newVol = curVol + interVal;
    	if(newVol > 100) newVol = 100;
    	
    	this.playerWindow.ytPlayer.setVolume(newVol);
    }
    
    volumeDown(interVal = 5) {
    	let curVol = this.playerWindow.ytPlayer.getVolume();
    	let newVol = curVol - interVal;
    	if(newVol < 0) newVol = 0;
    	
    	this.playerWindow.ytPlayer.setVolume(newVol);   	
    }
    
    calculateSeekInterVal(interVal) {
    	let now = new Date().getTime();
    	if(this.seekTimeout.lastOccur === null) {
    		this.seekTimeout.lastOccur = now;
    	}
    	
    	let timeDiff = now - this.seekTimeout.lastOccur;
    	let timeValid = timeDiff <= this.seekTimeout.timeoutMilis; 

    	if(timeValid) {
			if(this.seekTimeout.counter >= this.seekTimeout.limit) {
	    		let mult = this.seekTimeout.counter / this.seekTimeout.limit;
	    		mult = mult | 0;
	    		if(( this.seekTimeout.counter % this.seekTimeout.limit ) > 0) {
	    			mult++;
	    		}
	    		
	    		interVal = interVal + (mult * interVal) 
	    	}
			this.seekTimeout.counter++;
    	} else {
    		this.seekTimeout.counter = 0;
    	}
    	
		this.seekTimeout.lastOccur = now;
		
    	return interVal;
    }
    
    fastForward(interValSec = 5) {
    	
    	interValSec = this.calculateSeekInterVal(interValSec);
    	
    	let tracklen = this.playerWindow.ytPlayer.getDuration();
    	let curtime = this.playerWindow.ytPlayer.getCurrentTime();
    	let newtime = curtime + interValSec;
    	if(tracklen <= 0) return;
    	else if(newtime > tracklen) newtime = tracklen;
    	this.playerWindow.ytPlayer.seekTo(newtime, true);	
    }
    
    rewind(interValSec = 5) {
    	
    	interValSec = this.calculateSeekInterVal(interValSec);
    	
    	let tracklen = this.playerWindow.ytPlayer.getDuration();
    	let curtime = this.playerWindow.ytPlayer.getCurrentTime();
    	let newtime = curtime - interValSec;
    	if(tracklen <= 0) return;
    	else if(newtime < 0) newtime = 0;
    	this.playerWindow.ytPlayer.seekTo(newtime, true);
    }
}
