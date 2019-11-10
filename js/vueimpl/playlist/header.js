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
                	console.log('>>', $page.loader.pages.playlist.lastfm.selector);
                    let icon = $page.icons.getPageIcon(elementId);
                    let icon2 = $page.icons.getPageIcon(this.PLAYLIST);
                    console.log('get logo for', elementId, 'icon', icon, 'playlist', this.PLAYLIST, 'icon2', icon2);
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
	            PLAYLIST: '',
	        },
	        computed: {
	            MENUS: function () {
                    return $page.menu.getMenu(elementId);
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
	
	static createVue(elementId) {
		return {
				title :  LibvuePlaylistHeader.createTitleVue(elementId),			
				menu : LibvuePlaylistHeader.createMenuVue(elementId) 
		};
	}
}