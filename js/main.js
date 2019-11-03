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

// Enable navigation prompt, set to null to disable
window.onbeforeunload = function() {
	return true;
};

require([ 'Vue', 'Storages', 'page' ], function(Vue, Storages) {

	window.Storages = Storages;
	window.Vue = Vue;

	$player = new PlayerController(Storages);
	$playlist = new PlaylistController();
	$page = new PageController();

	$page.init(function() {
		// maybe set it to page...
		require([ 'analytics' ], function(analytics) {
			PageController.analytics = analytics;
		});

		$player.initWindow(function() {
			HotKeys.init();
			$player.autoPlay = true;
			$page.initURL();
		});
	});
});
