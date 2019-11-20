/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class ChartTimer {
    constructor(player) {

        this.timerStart = null;
        this.timerRemaining = null;
        this.timerTrackData = null;
        this.timer = null;
        this.log = true;
        this.lastChartLfmUser = null;
        this.player = player;
        this.init();
    }


    init() {
        if (this.playerControl === null) {
            if (this.log) console.error('cannot initialize Timer, invalid player instance!');
            return;
        }

        let self = this;
        this.player.addStateChangeListener(function (event) {

            if (event.data === self.player.playerWindow.status.PLAYING.ID) {
                self.start();
            } else {
                self.stop();
            }
        });
    }

    handleTimerEvent() {
    	
        let trackData = this.timerTrackData;
        if ('undefined' === typeof trackData || trackData === null) {
            if (this.log) console.log('timer event invalid track', trackData);
            return;
        }

        if (this.log) console.log('handle timer event: create needle from track');

        let needle = $page.createNeedle(trackData.track);
        console.log('>', needle.videoId.length, '>>', needle);
        if(needle.videoId.length <= 0) needle.videoId = trackData.curVideoId;
        this.clearTimer();
        
        if(this.log) console.log('handle timer event: needle created: ', needle);        
        $page.saveChartTrack(needle);
        
        if ('undefined' !== typeof trackData.track.LASTFM_USER_NAME
        	&& trackData.track.LASTFM_USER_NAME !== '' 
        	&& this.lastChartLfmUser !== trackData.track.LASTFM_USER_NAME) {
            if (this.log) console.log('handle save user chart');
            $page.saveChartUser(trackData.track.LASTFM_USER_NAME);
            this.lastChartLfmUser = trackData.track.LASTFM_USER_NAME;
        } else if (this.log) {
            console.log(
                'wont save user chart >', trackData.track.LASTFM_USER_NAME,
                '< <-track timer-> >', this.lastChartLfmUser, '<'
            );
        }

    }

    clearTimer() {
        if (this.timer === null) return;

        clearTimeout(this.timer);
        this.timerStart = null;
        this.timerRemaining = null;
        this.timerTrackData = null;
        this.timer = null;
    }


    createTimer(trackData) {
        // duration is send when metadata arrives from youtube,
        // so delay max. 3 second before checking duration
        let delay = 300; // ms
        let maxDelayCnt = 10; // 10x300 ms
        let delayCnt = 0;
        let self = this;
        let durationTimer = setInterval(function () {
            if (delayCnt >= maxDelayCnt) {
                self.clearTimer();
                clearInterval(durationTimer);               
                console.error('can not start chart timer, no duration received from youtube');
                return;
            }

            let vidDuration = $player.playerWindow.ytPlayer.getDuration();
            if (vidDuration > 0) {
                trackData.duration = vidDuration;

                let lfmScrobbleDuration = (trackData.duration / 2) | 0;
                if (lfmScrobbleDuration > 120) lfmScrobbleDuration = 120;
                // last.fm scrobble rule: half length of song or 2 min. if
				// greater
                
                /** debug * */
                lfmScrobbleDuration = 20;
                
                self.clearTimer();
                self.timerStart = new Date();
                self.timerRemaining = lfmScrobbleDuration;
                self.timerTrackData = trackData;
                self.timer = setTimeout(
                	function() {
                		self.handleTimerEvent();
					},
                    (lfmScrobbleDuration * 1000)
                );
                if (self.log)
                    console.log('timer created, remaining: ', self.timerRemaining);

                clearInterval(durationTimer);
            }
            delayCnt++;
        }, delay);
    }

    resume(trackData) {
        if (!this.timerTrackData.equals(trackData)) {
            if (this.log) console.log('timer track not current track, create new timer');
            this.createTimer(trackData);
            return;
        }

        if (this.log) console.log('resume timer with remaining time: ', this.timerRemaining);
        
        let self = this;
        this.timerStart = new Date();
        this.timer = setTimeout(
        	function() {
        		self.handleTimerEvent();
			},
			(this.timerRemaining * 1000)
       	);
    }

    start() {
        if (!$player.currentTrackData.validTrack() && $player.currentTrackData.validVideo()) return;
        let curTrack = $player.currentTrackData.track;
        let curTrackVideo = $player.currentTrackData.validVideo(); 
        let trackData = {
        	track: curTrack,
        	curVideoId: curTrackVideo,
        	duration: 0,
            equals: function (other) {
                return (
                    'undefined' !== typeof other &&
                    other !== null &&                    
                    this.track.ARTIST === other.track.ARTIST &&
                    this.track.TITLE === other.track.TITLE
                );
            }
        };
        if (this.timerStart === null) {
            this.createTimer(trackData);
        } else {
            this.resume(trackData);
        }
    }

    stop() {
        if (this.timer === null) return;
        let timeRun = ((new Date() - this.timerStart) / 1000) | 0;
        this.timerRemaining -= timeRun;
        clearTimeout(this.timer);
        this.timer = null;
        if (this.log) console.log('timer stopped, timer run: ', timeRun, ' remaining: ', this.timerRemaining);
    }

}