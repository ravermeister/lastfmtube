require([
    'Vue', 
    'Storages',
    'player',
    'page',
    'playlist'
    ], function (Vue, Storages) {

    window.dataLayer = window.dataLayer || [];
    window.Storages = Storages;
    window.Vue = Vue;
    
        
    //google analytics
    function gtag() {
        dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', 'UA-26904270-14');

    
    $player = new PlayerController(Storages);
    $playlist = new PlaylistController();
    $page = new PageController();

    
    $player.autoPlay = true;
    
    $page.init();
    $player.initPlayer();
    

});
