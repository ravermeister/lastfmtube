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
			baseUrl : 'js/lib',

			paths : {

				// Google analytics
				analytics : [ 'analytics/analytics' ],

				// requirejs addon
				domReady : [
					'//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
					'requirejs/domReady' 
				],

				// jquery
				jquery : [ 
					'//unpkg.com/jquery/dist/jquery.min',
					'jquery/jquery' 
				],

				// Vue instance Page
				vuePage: ['vuejs/instances/page'],
				
				// Vue instance playlist
				vuePlaylist: ['vuejs/instances/playlist'],
				
				// Vue instance userlist
				vueUserlist: ['vuejs/instances/userlist'],
				
				//Vue instance video
				vueVideo: ['vuejs/instances/video'],
				
				// the Vue lib
				Vue : [ '//unpkg.com/vue/dist/vue.min', 'vuejs/vue.min' ],
				// Vue RequireJS loader
				// required for using vue components
				vue : [ 
					'//unpkg.com/require-vuejs/dist/require-vuejs.min',
					'vuejs/vue-requirejs.min' 
				],
				
				// Storage js
				Storages : [ 
					'//unpkg.com/js-storage/js.storage.min',
					'jstorage/js.storage.min' 
				],

				// share buttons
				add2any : [ 
					'//static.addtoany.com/menu/page',
					'add2any/add2any.min'
				],

				// hotkeys
				hotkeys : [ 
					'//unpkg.com/hotkeys-js/dist/hotkeys.min',
					'hotkeys/hotkeys.min' 
				],

				// themes
				themes : [ '../../themes/dimension/assets/js' ]
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
					deps : [ 'libvue', 'add2any', 'hotkeys' ]
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