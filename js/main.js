require([
    'Vue',
    'Storages',
    'player',
    'page',
    'playlist'
], function (Vue, Storages) {

    window.Storages = Storages;
    window.Vue = Vue;

    $player = new PlayerController(Storages);
    $playlist = new PlaylistController();
    $page = new PageController();

    $page.init();
    $player.initPlayer();

    
    //maybe set it to page...
    require(['analytics']);
});
