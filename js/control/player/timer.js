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
        this.timerTrack = null;
        this.timer = null;
        this.log = false;
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
   	
        let track = this.timerTrack;
        if ('undefined' === typeof track || track === null) {
            if (this.log) console.log('timer event invalid track', track);
            return;
        }

        if (this.log) console.log('handle timer event create needle from track');

        let needle = $page.createNeedle(
            track.artist,
            track.title,
            track.video
        );

        this.clearTimer();
        $page.saveChartTrack(needle);
        if ('undefined' !== typeof track.lfmuser &&
            track.lfmuser !== '' &&
            this.lastChartLfmUser !== track.lfmuser) {
            if (this.log) console.log('handle save user chart');
            $page.saveChartUser(track.lfmuser);
            this.lastChartLfmUser = track.lfmuser;
        } else if (this.log) {
            console.log(
                'wont save user chart >', track.lfmuser,
                '< <-track timer-> >', this.lastChartLfmUser, '<'
            );
        }

    }

    clearTimer() {
        if (this.timer === null) return;

        clearTimeout(this.timer);
        this.timerStart = null;
        this.timerRemaining = null;
        this.timerTrack = null;
        this.timer = null;
    }


    createTimer(track) {
        // duration is send when metadata arrives from youtube,
        // so delay max. 5 a second before checking duration
        let delay = 500; // ms
        let maxDelayCnt = 10; // 10x500 ms
        let delayCnt = 0;
        let self = this;
        let durationTimer = setInterval(function () {
            if (delayCnt >= maxDelayCnt) {
                clearInterval(durationTimer);
                // console.error('can not start timer, no duration received from
				// youtube');
                return;
            }

            let vidDuration = $player.playerWindow.ytPlayer.getDuration();
            if (vidDuration > 0) {
                track.duration = vidDuration;

                let lfmScrobbleDuration = (track.duration / 2) | 0;
                if (lfmScrobbleDuration > 120) lfmScrobbleDuration = 120;
                // last.fm scrobble rule: half length of song or 2 min. if
				// greater
                
                /** debug * */
                /** lfmScrobbleDuration = 10; **/
                
                self.clearTimer();
                self.timerStart = new Date();
                self.timerRemaining = lfmScrobbleDuration;
                self.timerTrack = track;
                self.timer = setTimeout(
                	function() {
                		self.handleTimerEvent();
					},
                    (lfmScrobbleDuration * 1000)
                );
                if (self.log)
                    console.log('timer created, remaining: ', self.timerRemaining);

                if (self.log) clearInterval(durationTimer);
            }
            delayCnt++;
        }, delay);
    }

    resume(track) {
        if (!this.timerTrack.equals(track)) {
            if (this.log) console.log('timer track not current track, create new timer');
            this.createTimer(track);
            return;
        }

        if (this.log) console.log('resume timer with remaining time: ', this.timerRemaining);

        this.timerStart = new Date();
        this.timer = setTimeout(this.handleTimerEvent, (this.timerRemaining * 1000));
    }

    start() {
        if (!$player.currentTrackData.validTrack() && $player.currentTrackData.validVideo()) return;
        let curTrack = $player.currentTrackData.track;
        let track = {
            artist: curTrack.ARTIST,
            title: curTrack.TITLE,
            video: $player.currentTrackData.videoId,
            lfmuser: $player.currentTrackData.lfmUser,
            duration: 0,
            equals: function (other) {
                return (
                    'undefined' !== typeof other &&
                    other !== null &&
                    this.artist === other.artist &&
                    this.title === other.title &&
                    this.video === other.video
                );
            }
        };
        if (this.timerStart === null) {
            this.createTimer(track);
        } else {
            this.resume(track);
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