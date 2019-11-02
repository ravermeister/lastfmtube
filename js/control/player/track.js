/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class TrackData {

	constructor(){
	    this.track = null;
	    this.videoId = null;
	    this.playlistTitle = null;
	}

    validTrack() {
        return (
            this.track !== null && ((
                'undefined' !== typeof this.track.TITLE &&
                this.track.TITLE !== null &&
                this.track.TITLE.length > 0
            ) || (
                'undefined' !== typeof this.track.ARTIST &&
                this.track.ARTIST !== null &&
                this.track.ARTIST.length > 0
            ))
        );
    }

    validVideo() {
        return this.videoId !== null && this.videoId.length > 0;
    }
}