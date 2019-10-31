/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/

// Enable navigation prompt, set to null to disable
window.onbeforeunload = function() {
	return true;
};

require([ 'Vue', 'Storages', 'page' ], function(Vue,
		Storages) {

	window.Storages = Storages;
	window.Vue = Vue;

	$player = new PlayerController(Storages);
	$playlist = new PlaylistController();
	$page = new PageController();

	$page.init();

	$playlist.loadLastFmList(1, null, function() {

		// maybe set it to page...
		require([ 'analytics' ], function(analytics) {
			PageController.analytics = analytics;
		});

		$player.initPlayer(function() {
			$player.autoPlay = true;
			$page.initURL();
		});

	});
});
