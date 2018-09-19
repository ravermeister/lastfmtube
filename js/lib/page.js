class Icon {
    constructor(name) {
        this.name = name;
        this.big = this.name + ' fa-2x';
        this.bigger = this.name + ' fa-3x';

        this.animated = this.name + ' faa-flash animated';
        this.animatedBig = this.animated + ' fa-2x';
        this.animatedBigger = this.animated + ' fa-3x';

    }

    isIcon(elem, big = false) {
        return $(elem).hasClass(big ? this.big : this.name);
    }
}


class PageController {


    constructor() {

        this.PLAYLIST = null;
        this.TRACKS_PER_PAGE = 25; //in settings.ini
        this.PLAY_CONTROL = null;
        this.QUICKPLAY_TRACK = null;
        this.icons = this.initIcons();
        this.myVues = {}; 
        
        this.applyVueMethods();
    }

    applyVueMethods() {

        Vue.prototype.$applyData = function (json, log = false) {

            if (typeof this === 'undefined' || this == null) {
                console.error('Error, vue instance not found. Json: ', json, ', Vue: ', this);
                return;
            }

            if (log) {
                console.log('updateData', 'vue: ', this, ' json: ', json);
            }

            for (let key in this.$data) {
                if (log) console.log((key, ' exists ', json.hasOwnProperty(key)));
                if (json.hasOwnProperty(key)) {
                    if (log) console.log('old: ' + this.$data[key] + ' | new ' + json[key]);
                    this.$data[key] = json[key];
                }
            }
        };
    }

    initIcons() {
        let icons = {};
        icons.play = new Icon('fa-play');
        icons.pause = new Icon('fa-pause');
        icons.stop = new Icon('fa-stop');
        icons.youtube = new Icon('fa fa-youtube');
        icons.search = new Icon('fa fa-search');
        icons.plus = new Icon('fa-plus');
        icons.minus = new Icon('fa-minus');
        icons.diamond = new Icon('fa fa-diamond');
        icons.headphones = new Icon('fas fa-headphones');
        icons.check = new Icon('fas fa-check');
        icons.loader = new Icon('fa fa-spinner faa-spin animated');
        icons.star = new Icon('fas fa-star');
        icons.trophy = new Icon('fas fa-trophy');
        icons.user = new Icon('fas fa-user');

        icons.list = [
            icons.play,
            icons.pause,
            icons.stop,
            icons.youtube,
            icons.search,
            icons.plus,
            icons.minus,
            icons.diamond,
            icons.headphones,
            icons.check,
            icons.loader,
            icons.star,
            icons.trophy,
            icons.user
        ];

        icons.getIcon = function (elem, big) {
            for (let cnt = 0; cnt < this.list.length; cnt++) {
                if (this.list[cnt].isIcon(elem, big)) {
                    return this.list[cnt];
                }
            }
            return null;
        };
        icons.getPlaylistIcon = function (playlist = null) {
            if (playlist == null) return this.diamond.big;
            switch (playlist) {
                case 'topsongs':
                    return this.star;
                case 'topuser':
                    return this.trophy;
                case 'userlist':
                    return this.user;
                case 'youtube':
                    return this.youtube;
                case 'default':
                    return this.headphones;
            }

        };

        return icons;
    }

    initMyVues() {
        this.myVues = {
            base: new LibvueMainpage(),
            playlist: new LibvuePlaylist(),
            youtube: new LibvueVideo(),

            updateAll: function (json) {
                this.base.update(json.base);
                this.playlist.update(json.playlist);
                this.youtube.update(json.youtube);
            }
        };
    }
    
    init() {
        this.initMyVues();
        let request = 'php/json/JsonHandler.php?api=page&data=page';
        

        $.getJSON(request, function (json) {
            //console.log(JSON.stringify(json.data.value));

            $page.setPageLoading(true);
            $page.myVues.updateAll(json.data.value);
            $page.setCurrentPlayList();
            $page.setPageLoading();

            console.log('init page success');
        }).fail(function (xhr, status, error) {
            //var err = eval("(" + xhr.responseText + ")");
            console.log(xhr.responseText);
        });
    }

    setCurrentPlayList(playlist = null) {        
        
        if(playlist == null) playlist = 'default';
        if(playlist == $page.PLAYLIST) return;
                
        if (playlist !== 'youtube') {
            this.myVues.youtube.header.$data.PLAYLIST_ID = playlist;
        }
        
        this.PLAYLIST = playlist;
        $page.myVues.playlist.header.menu.refreshMenu();
    }

    setPageLoading(active = false) {
        this.myVues.base.logo.$data.PAGE_LOADER = active ? this.icons.loader.bigger : this.icons.diamond.bigger;
    }

    setPlaylistLoading(active = false, playlist = null) {
        if (playlist == null) playlist = this.PLAYLIST == null ? 'default' : this.PLAYLIST;
        let curIcon = this.icons.getPlaylistIcon(playlist);
        this.myVues.playlist.header.title.$data.LOGO = active ? curIcon.animatedBig : curIcon.big;
    }

    initDefaultVue(json) {
        return new this.vue({
            el: json.el,
            data: json.data
        });
    }

    initPlayListHeader(json) {

        return new this.vue({
            el: json.el,
            data: json.data,

            methods: {

                getLogo: function () {
                    if (this.PLAYLIST == null) return this.icons.headphones.big;
                    switch (this.PLAYLIST) {
                        case 'topsongs':

                            break;
                    }
                },


                loadPlayList: function (list) {
                    let oldList = 'default';
                    if (this.PLAYLIST != null) oldList = this.PLAYLIST;

                    let iconClasses = '';
                    let iconElem = $('#page-playlist>.playlist-header-container>h2>.playlist-header-ico');
                    let setLoading = function (isLoading) {
                        switch (oldList) {
                            case 'userlist' :
                                //iconElem.removeClass('').addClass();
                                //iconClasses = '';
                                break;
                            case 'topuser':
                                break;
                            case 'topsongs':
                                break;
                            case 'search':
                                break;
                            default:
                                break;
                        }
                    };

                    setLoading(true);
                    this.loadPlaylistPage(1, null, null, list, function () {
                        setLoading(false);
                    });
                }
            }
        });
    }

    createNeedle(track) {
        return {            
            artist: track.ARTIST,            
            title: track.TITLE,
            videoId: track.videoId,          
            asVar: function(raw = false) {
                if (!raw) return encodeURIComponent(this.artist) + ' ' + encodeURIComponent(this.title);
                else return this.artist + ' ' + this.title;
            },
            isValid: function() {
                return this.asVar().trim().length>0;
            }
        };
    }

    clone(src) {
        return Object.assign({}, src);
    }

    resetTrack(track) {
        track.PLAY_CONTROL = false;
        track.SHOWPLAY = false;
        track.NOWPLAYING = false;
        track.LOADING = false;
    }
    
}