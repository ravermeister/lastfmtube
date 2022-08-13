/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/

let $player = null;
let $playlist = null;
let $page = null;

// Enable navigation prompt (warning before leaving page), set to null to
// disable
window.onbeforeunload = function() {
	return true;
};

require([ 'Storages', 'vue' , 'page' ], function(Storages) {

	window.Storages = Storages;
	const { createApp } = Vue
	window.Vue = createApp({});

	$player = new PlayerController(Storages);
	$playlist = new PlaylistController();
	$page = new PageController();

	$page.init(function() {
		$player.initWindow(function() {
			HotKeys.init();
			$player.autoPlay = true;
			$page.loader.initURL();
//			$page.loader.setLoading();
		});
	});
});
