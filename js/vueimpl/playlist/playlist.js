/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class LibvuePlaylist {
    
    constructor(elementId) {
    	
        LibvuePlaylist.YOUTUBE_URL_REGEX = /^http(s?):\/\/(www\.)?(m\.)?youtu(\.be|be\.com)\//g;
        this.elementId = elementId;
        
        this.header = LibvuePlaylistHeader.createVue(elementId);
        this.menu = LibvuePlaylistMenu.createVue(elementId);
        this.content = LibvuePlaylistContent.createVue(elementId);
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
    	let self = this;
        let needle = $page.createNeedle(
            self.menu.$data.SEARCH_NEEDLE.artist,
            self.menu.$data.SEARCH_NEEDLE.title,
            videoId
        );
        $page.saveVideo(needle);
    }

    unsetVideo(needle = null) {    	
        $page.deleteVideo(needle);
    }

    getTracks(json) {
        let pdata = {};
        if ('undefined' !== typeof json.playlist.LIST.HEADER)
            pdata.HEADER = json.playlist.LIST.HEADER;
        if ('undefined' !== typeof json.playlist.LIST.CONTENT)
            pdata.TRACKS = json.playlist.LIST.CONTENT;

        return pdata;
    }

    update(json) {
        this.content.update(json);
        this.menu.update(json);
        this.header.title.update(json);
        this.header.menu.update(json);
    }

}