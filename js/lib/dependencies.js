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
						'requirejs/domReady' ],

				// jquery
				jquery : [ '//unpkg.com/jquery/dist/jquery.min',
						'jquery/jquery' ],

				// the Vue lib
				Vue : [ '//unpkg.com/vue/dist/vue.min', 'vue/vue.min' ],
				// Vue RequireJS loader
				// required for using vue components
				vue : [
						'unpkg.com/browse/require-vuejs/dist/require-vuejs.min.js',
						'vue/vue-requirejs.min' ],

				// Storage js
				Storages : [
						'//unpkg.com/js-storage/dist/js.storage.min',
						'//raw.githubusercontent.com/julien-maurel/js-storage/master/js.storage.min',
						'jstorage/js.storage.min' ],

				// share buttons
				add2any : [ '//static.addtoany.com/menu/page',
						'add2any/add2any.min' ],

				// hotkeys
				hotkeys : [ '//unpkg.com/hotkeys-js/dist/hotkeys.min',
						'hotkeys/hotkeys.min' ],

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

define('theme', [ 'themes/browser.min', 'themes/breakpoints.min',
		'themes/util', 'themes/main' ]);
define('libvue', [ 'jquery', 'Vue', 'libvue/libvue-mainpage',
		'libvue/libvue-playlist', 'libvue/libvue-video',
		'libvue/libvue-userlist' ]);

require([ 'theme' ]);