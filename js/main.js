require([ 'Vue', 'Storages', 'player', 'page', 'playlist' ], function(Vue,
		Storages) {

	window.Storages = Storages;
	window.Vue = Vue;

	$player = new PlayerController(Storages);
	$playlist = new PlaylistController();
	$page = new PageController();
	
	console.log('>>> href: >'+location.href+'<');
	console.log('>>> path: >'+location.pathname+'<');
	
	$player.autoPlay = true;
	$player.initPlayer();
	$page.init();

	$playlist.loadLastFmList();

	
	// maybe set it to page...
	require([ 'analytics' ], function(analytics) {
		PageController.analytics = analytics;
	});
});
