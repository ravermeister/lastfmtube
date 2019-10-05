require([ 'Vue', 'Storages', 'player', 'page', 'playlist' ], function(Vue,
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
			$page.initURL();
		});

	});
});
