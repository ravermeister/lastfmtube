/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class VueController {
	
	constructor() {
		VueController.vueMethodsApplied = false;
	}
	

    static applyVueMethods() {
    	
    	if(VueController.vueMethodsApplied === true) return;
    	
        Vue.prototype.$applyData = function (json, log = false) {

            if (typeof this === 'undefined' || this === null) {
                console.error('Error, vue instance not found. Json: ', json, ', Vue: ', this);
                return;
            }

            if (log) {
                console.log('updateData', 'vue: ', this.$data, ' json: ', json);
            }
            if ('undefined' === typeof json) return;

            for (let key in this.$data) {
                if (log) console.log(key, ' exists ', (json.hasOwnProperty(key)));
                if (json.hasOwnProperty(key)) {
                    if (log) console.log('old: ' + this.$data[key] + ' | new ' + json[key]);
                    this.$data[key] = json[key];
                }
            }

            if (log) console.log('after update: ', this.$data);
        };

        VueController.vueMethodsApplied = true;
    }
	
	static createVues(){
		VueController.applyVueMethods();
		return {
            main: new LibvueMainpage(),
            
            playlist: {
            	lastfm: new LibvuePlaylist('playlist-lastfm-container'),
            	user: new LibvuePlaylist('playlist-user-container'),
            	topsongs: new LibvuePlaylist('playlist-topsongs-container'),
            	search: new LibvuePlaylist('playlist-search-container')
            },
            video: {
            	youtube: new LibvueVideo('video-youtube-container'),
            },
            userlist: {
            	topuser: new LibvueUser('userlist-topuser-container'),
            },

            setVideo: function(videoId){
            	this.playlist.user.setVideo(videoId);
            	this.playlist.lastfm.setVideo(videoId);
            },
            
            unsetVideo: function(needle) {
            	this.playlist.user.unsetVideo(needle);
            	this.playlist.lastfm.unsetVideo(needle);            	
            },
            
            updateAll: function (json) {            	
                this.main.update(json);                
                this.playlist.lastfm.update(json);
                this.playlist.user.update(json);
                this.playlist.search.update(json);                
                this.video.youtube.update(json);
                this.userlist.topuser.update(json);
            },
            
                      
            forPage: function(page) {
            	switch(page) {
            		case $page.loader.pages.base:
            			return this.main;
            		case $page.loader.pages.userlist.topuser:
            			return this.userlist.topuser;
            		case $page.loader.pages.video.youtube:
            			return this.video.youtube;
            		case $page.loader.pages.playlist.lastfm:
            			return this.playlist.lastfm;
            		case $page.loader.pages.playlist.topsongs:
            			return this.playlist.topsongs;
            		case $page.loader.pages.playlist.search:
            			return this.playlist.search;
            		case $page.loader.pages.playlist.user:
            			return this.playlist.user;
            		default:
            			return null;
            	}
            }
        };
	}
	
	
}