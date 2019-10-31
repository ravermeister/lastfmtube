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

        this.init(player);
    }


    init(player = null) {
        if (player === null) {
            if (this.log) console.error('cannot initialize Timer, invalid player instance!');
            return;
        }

        let control = this;

        player.addStateChangeListener(function (event) {
        	
            switch (event.data) {            	
                case player.playerWindow.status.PLAYING.ID:
                    control.start();
                    break;
                default:
                    control.stop();
                    break;
            }
        });
    }

    handleTimerEvent() {

        let track = $player.chartTimer.timerTrack;
        if ('undefined' === typeof track || track === null) {
            if ($player.chartTimer.log) console.log('timer event invalid track', track);
            return;
        }

        if ($player.chartTimer.log) console.log('handle timer event create needle from track');

        let needle = $page.createNeedle(
            track.artist,
            track.title,
            track.video
        );

        $player.chartTimer.clearTimer();
        $page.saveChartTrack(needle);
        if ('undefined' !== typeof track.lfmuser &&
            track.lfmuser !== '' &&
            $player.chartTimer.lastChartLfmUser !== track.lfmuser) {
            if ($player.chartTimer.log) console.log('handle save user chart');
            $page.saveChartUser(track.lfmuser);
            $player.chartTimer.lastChartLfmUser = track.lfmuser;
        } else if ($player.chartTimer.log) {
            console.log(
                'wont save user chart', track.lfmuser,
                '<-track timer->', $player.chartTimer.lastChartLfmUser
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
        let durationTimer = setInterval(function () {
            if (delayCnt >= maxDelayCnt) {
                clearInterval(durationTimer);
                // console.error('can not start timer, no duration received from
				// youtube');
                return;
            }

            let vidDuration = $player.ytPlayer.getDuration();
            if (vidDuration > 0) {
                track.duration = vidDuration;

                let lfmScrobbleDuration = (track.duration / 2) | 0;
                if (lfmScrobbleDuration > 120) lfmScrobbleDuration = 120;
                // last.fm scrobble rule: half length of song or 2 min. if
				// greater

                $player.chartTimer.clearTimer();
                $player.chartTimer.timerStart = new Date();
                $player.chartTimer.timerRemaining = lfmScrobbleDuration;
                $player.chartTimer.timerTrack = track;
                $player.chartTimer.timer = setTimeout(
                    $player.chartTimer.handleTimerEvent,
                    (lfmScrobbleDuration * 1000)
                    /** debug * */
                    /** 10000* */
                );
                if ($player.chartTimer.log)
                    console.log('timer created, remaining: ', $player.chartTimer.timerRemaining);

                if ($player.chartTimer.log) clearInterval(durationTimer);
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