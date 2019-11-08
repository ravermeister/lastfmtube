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
				analytics : [ 'lib/analytics/analytics' ],

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

				// theme dir
				themeDir : [ '../themes/dimension/assets/js' ]
			},

			shim : {
				'Vue' : {
					exports : [ 'Vue' ]
				},

				'themeDir/main' : {
					deps : [ 'jquery' ]
				},
				'themeDir/util' : {
					deps : [ 'jquery' ]
				},
				// html5 theme dependencies
				
				'control/page/page' : {
					deps : [ 'jquery', 'hotkeys', 'add2any', 'vuedata' ]
				},
			}
		});

define('theme', [
	'themeDir/browser.min',
	'themeDir/breakpoints.min',
	'themeDir/util',
	'themeDir/main'
]);

define ('vuedata', [
	'vueimpl/page/page',
	'vueimpl/player/header',
	'vueimpl/player/menu',
	'vueimpl/player/comments',
	'vueimpl/player/player',
	'vueimpl/playlist/header',
	'vueimpl/playlist/menu',
	'vueimpl/playlist/content',
	'vueimpl/playlist/playlist',
	'vueimpl/userlist/userlist'
]);

define('page', [
	'control/page/icons',
	'control/page/menu',
	'control/page/loader',
	'control/page/vues',
	'control/page/hotkeys',
	'control/page/page',
	'control/player/track',
	'control/player/timer',
	'control/player/window',
	'control/player/player',
	'control/playlist/loader',
	'control/playlist/playlist'
]);

require([ 'theme' ]);