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
				jquery : [ '//unpkg.com/jquery@3.4.1/dist/jquery.min',
						'jquery/jquery' ],

				// the Vue lib
				Vue : [ '//unpkg.com/vue@2.6.10/dist/vue.min', 'vue/vue.min' ],
				// Vue RequireJS loader
				// required for using vue components
				vue : [
						'unpkg.com/browse/require-vuejs@1.1.3/dist/require-vuejs.min.js',
						'vue/vue-requirejs.min' ],

				// Storage js
				Storages : [ '//unpkg.com/js-storage@1.1.0/js.storage.min',
						'jstorage/js.storage.min' ],

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
					deps : [ 'libvue' ]
				}
			}
		});

define('theme', [ 'themes/browser.min', 'themes/breakpoints.min',
		'themes/util', 'themes/main' ]);
define('libvue', [ 'jquery', 'Vue', 'libvue/libvue-mainpage',
		'libvue/libvue-playlist', 'libvue/libvue-video',
		'libvue/libvue-userlist' ]);

require([ 'theme' ]);