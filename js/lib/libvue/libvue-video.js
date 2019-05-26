class LibvueVideo {


    constructor() {

        // noinspection JSUnusedGlobalSymbols
        this.header = new Vue({
            el: '#video-container>h2',
            data: {
                PLAYLIST: null,
                CURRENT_TRACK: null,
                SEARCH_TRACK: null,
                LOADING: false
            },
            computed: {
                TEXT: function () {
                    let playlist = this.PLAYLIST === null ? 'lastfm' :
                        this.PLAYLIST;
                    let menu = $page.menu.getMenuItem(playlist);
                    return menu.TEXT;
                },
                LOGO: function () {
                    let playlist = this.PLAYLIST === null ? 'lastfm' :
                        this.PLAYLIST;
                    let icon = PageController.icons.getPlaylistIcon(playlist);
                    return this.LOADING ? icon.animatedBig : icon.big;
                },
                TRACK_NR: function () {
                    let playlist = this.PLAYLIST === null ? 'lastfm' :
                        this.PLAYLIST;
                    if ((this.CURRENT_TRACK === null ||
                        this.PLAYLIST !== null && this.CURRENT_TRACK.PLAYLIST !== playlist)) {
                        return '';
                    }

                    let tnr = '#' + this.CURRENT_TRACK.NR;
                    if ('undefined' !== typeof this.CURRENT_TRACK.PLAYCOUNT_CHANGE) {
                        tnr += ' ';
                        if (parseInt(this.CURRENT_TRACK.PLAYCOUNT_CHANGE) > 0) {
                            tnr += this.CURRENT_TRACK.PLAYCOUNT_CHANGE;
                        }
                        tnr += '▲';
                    }
                    return tnr;
                }
            },
            methods: {


                update: function (json) {
                    this.$applyData(json);
                },

                loadMenu: function (playlist, event) {

                    if ('search' === playlist) {
                        let vue = this;
                        this.$data.LOADING = true;
                        let callback = function (success) {
                            vue.$data.LOADING = false;
                            location.href = '#' + menu.PLAYLIST;
                        };
                        $player.searchSong(this.$data.SEARCH_TRACK, callback);
                        return;
                    }
                    
                    if ('video' === playlist) playlist = $page.PLAYLIST;
                    if (playlist === null) playlist = 'lastfm';
                    if(playlist === $page.PLAYLIST) {
                        location.href = '#' + playlist;
                    } else {
                        let menu = $page.menu.getMenuItem(playlist);
                        this.$loadListMenu(menu, event);
                    }
                }
            }
        });

        this.menu = new Vue({
            el: '#video-container>#player-menu',
            data: {
                PLAYSTATE: ''
            },
            methods: {
                togglePlay(play = null) {
                    if (play === true && !$player.isPlaying()) {
                        $player.ytPlayer.playVideo();
                    } else if (play === false && !$player.isPaused()) {
                        $player.ytPlayer.pauseVideo();
                    } else if ($player.isPlaying()) {
                        $player.ytPlayer.pauseVideo();
                    } else {
                        $player.ytPlayer.playVideo();
                    }
                },

                prev: function () {
                    $player.loadPreviousSong();
                },
                next: function () {
                    $player.loadNextSong();
                },
                addToUserList: function () {
                    $playlist.addUserTrack($player.currentTrackData.track);
                    if ($page.PLAYLIST === 'userlist') {
                        $playlist.loadCustomerList($page.myVues.playlist.menu.$data.CUR_PAGE);
                    }
                },
                searchVideo: function (event) {
                    if ($page.myVues.youtube.header.SEARCH_TRACK === null) return;

                    $page.myVues.youtube.header.$data.LOADING = true;
                    $player.searchSong($page.myVues.youtube.header.SEARCH_TRACK, function () {
                        $page.myVues.youtube.header.$data.LOADING = false;
                    }, true);
                },
                showComments: function(event) {                	
                	$page.myVues.youtube.comments.toggleVisibility();
                	
                }
            }
        });
        
        this.comments = new Vue({
            el: '#video-container>#video-comments',
            data: {
            	showComments: false,
            	showLoadMore: false,
            	videoId: '',
            	pageinfo: [],
            	commentData: [],
            },
            methods: {
                update: function (json) {
                    this.$applyData(json);
                    if(undefined !== json.comments) {                    	
                    	this.$data.commentData = json.comments;
                    }
                    if(undefined !== json.pageinfo) {
                    	this.$data.pageinfo = json.pageinfo;
                    }
                },
                append: function(json) {
 
                    if(undefined !== json.comments) {
                    	this.$data.commentData = this.$data.commentData.concat(json.comments);
                    }
                    if(undefined !== json.pageinfo) {
                    	this.$data.pageinfo = json.pageinfo;
                    }       
                },                    
                toggleVisibility: function() {
                	this.$data.showComments = !this.$data.showComments;
                	this.$data.showLoadMore = undefined !== this.$data.pageinfo.NEXT;
                },
                loadMore: function() {
                	let pinfo = this.$data.pageinfo;
                	if(undefined === pinfo.NEXT || false === pinfo.NEXT) {
                		return;
                	} 
                	$playlist.loadVideoCommentList(this.$data.videoId, pinfo.NEXT);
                }
            }
        });
    }


    update(json) {
        this.header.update(json);
        this.comments.update(json);
    }
}

