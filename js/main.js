window.dataLayer = window.dataLayer || [];
//google analytics
function gtag() {
    dataLayer.push(arguments);
}

gtag('js', new Date());
gtag('config', 'UA-26904270-14');

require([
    'Vue', 
    'Storages',
    'analytics',
    'player',
    'page',
    'playlist'
    ], function (Vue, Storages) {

    window.Storages = Storages;
    window.Vue = Vue;
        
    $player = new PlayerController(Storages);
    $playlist = new PlaylistController();
    $page = new PageController();
    
    //$player.autoPlay = true;
    
    $page.init();
    $player.initPlayer();

});
