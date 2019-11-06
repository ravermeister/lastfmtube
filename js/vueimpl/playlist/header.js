/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class LibvuePlaylistHeader {
	
	static createTitleVue(elementId) {
		return new Vue({
		    el: '#'+elementId+'>.page-header-title>h2',
		    data: {
		        TEXT: '',
		        PLAYLIST: '',
		        LOADING: false
		    },
		    computed: {
		        LOGO: function () {
		        	let playlist = this.PLAYLIST === null ? 'lastfm' : this.PLAYLIST;
		            let icon = $page.icons.getPlaylistIcon(playlist);
		            return this.LOADING ? icon.animatedBig : icon.big;
		        }
		    },
		    methods: {
		        update: function (json) {
		            if ('undefined' !== typeof json.HEADER) {
		                this.$applyData(json.HEADER);
		            }
		        }
		    }
		});
	}
	
	static createMenuVue(elementId){
		return new Vue({
		    el: '#'+elementId+'>.page-header-nav',
	        data: {
	            PLAYLIST: null
	        },
	        computed: {
	            MENUS: function () {
	            	return this.$getMenuForPlaylist(this.$data.PLAYLIST);
	            }
	        },
		    methods: {
		        update: function (json) {
		            if ('undefined' !== typeof json.HEADER) {
		            	console.log(json.HEADER.PLAYLIST, '<<<<');
		                this.$applyData(json.HEADER);
		            }
		        }
		    }
		});
	}
	
	static createVue() {
		return {
				title :  LibvuePlaylistHeader.createTitleVue(),			
				menu : LibvuePlaylistHeader.createMenuVue() 
		};
	}
}