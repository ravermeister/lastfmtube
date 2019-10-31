/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
requirejs
		.config({
			// By default load any module IDs from js/lib
			baseUrl : 'js',

			paths : {

				// Google analytics
				analytics : [ 'analytics/analytics' ],

				// requirejs addon
				domReady : [
						'//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
						'lib/requirejs/domReady' ],

				// jquery
				jquery : [ '//unpkg.com/jquery/dist/jquery.min',
						'lib/jquery/jquery' ],

				// the Vue lib
				Vue : [ '//unpkg.com/vue/dist/vue.min', 'lib/vuejs/vue.min' ],
				// Vue RequireJS loader
				// required for using vue components
				vue : [ '//unpkg.com/require-vuejs/dist/require-vuejs.min',
						'lib/vuejs/vue-requirejs.min' ],

				// Storage js
				Storages : [ '//unpkg.com/js-storage/js.storage.min',
						'lib/jstorage/js.storage.min' ],

				// share buttons
				add2any : [ '//static.addtoany.com/menu/page',
						'lib/add2any/add2any.min' ],

				// hotkeys
				hotkeys : [ '//unpkg.com/hotkeys-js/dist/hotkeys.min',
						'lib/hotkeys/hotkeys.min' ],

				// theme JS Dir
				themeJsDir : [ '../themes/dimension/assets/js' ],

				// vue instance page
				vuePage : [ 'vue/page/page' ],
				// vue instance player
				vuePlayer : [ 'vue/player/player' ],
				// vue instance playlist
				vuePlaylist : [ 'vue/playlist/header', 'vue/playlist/menu',
						'vue/playlist/content', 'vue/playlist/playlist' ],
				// vue instance userlist
				vueUserlist : [ 'vue/userlist/userlist' ],

				// control instance page dir
				ctrlPage : [ 'control/page/page' ],
				// control instance player dir
				ctrlPlayer : [ 'control/player/player' ],
				// control instance playlist dir
				ctrlPlaylist : [ 'control/playlist/playlist' ],
			},

			shim : {
				'Vue' : {
					exports : [ 'Vue' ]
				},

				'themeJsDir/main' : {
					deps : [ 'jquery' ]
				},
				'themeJsDir/util' : {
					deps : [ 'jquery' ]
				},
				// html5 theme dependencies

				'theme' : {
					deps : [ 'themeJsDir/browser.min',
							'themeJsDir/breakpoints.min', 'themeJsDir/util',
							'themeJsDir/main' ]
				},

				'libvue' : {
					deps : [ 'jquery', 'Vue', 'vuePageDir/page.js',
							'vuePlayer', 'vuePlaylist', 'vueUserlist' ]
				},

				'page' : {
					deps : [ 'libvue', 'add2any', 'hotkeys', 'ctrlPage',
							'ctrlPlayer', 'ctrlPlaylist' ]
				},
			}
		});

require([ 'theme' ]);