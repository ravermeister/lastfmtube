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
					'lib/requirejs/domReady' 
				],

				// jquery
				jquery : [ 
					'//unpkg.com/jquery/dist/jquery.min',
					'lib/jquery/jquery' 
				],
				
				// the Vue lib
				Vue : [ '//unpkg.com/vue/dist/vue.min', 'lib/vuejs/vue.min' ],
				// Vue RequireJS loader
				// required for using vue components
				vue : [ 
					'//unpkg.com/require-vuejs/dist/require-vuejs.min',
					'lib/vuejs/vue-requirejs.min' 
				],
				
				// Storage js
				Storages : [ 
					'//unpkg.com/js-storage/js.storage.min',
					'lib/jstorage/js.storage.min' 
				],

				// share buttons
				add2any : [ 
					'//static.addtoany.com/menu/page',
					'lib/add2any/add2any.min'
				],

				// hotkeys
				hotkeys : [ 
					'//unpkg.com/hotkeys-js/dist/hotkeys.min',
					'lib/hotkeys/hotkeys.min' 
				],

				
				// themes
				themes : [ '../../themes/dimension/assets/js' ],
				
				// Vue instance Page
				vuePage: ['vue/page'],
				
				// Vue instance playlist
				vuePlaylist: ['vue/playlist'],
				
				// Vue instance userlist
				vueUserlist: ['vue/userlist'],
				
				//Vue instance video
				vueVideo: ['vue/video'],
			},

			shim : {

				'Vue' : {
					exports : [ 'Vue' ]
				},

				'themes/main' : {
					deps : [ 'jquery' ]
				},
				'themes/util' : {
					deps : [ 'jquery' ]
				},
				// html5 theme dependencies

				'page' : {
					deps : [ 
						'libvue', 'add2any', 'hotkeys', 
						'control/player', 
						'control/page', 
						'control/playlist'
					]
				}
			}
		});

define('theme', [ 
	'themes/browser.min', 
	'themes/breakpoints.min',
	'themes/util', 
	'themes/main' 
]);
define('libvue', [ 
	'jquery', 
	'Vue', 
	'vueVideo',
	'vuePage',
	'vuePlaylist',
	'vueUserlist',
	''
]);

require([ 'theme' ]);