requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',

    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {

        jquery: 'jquery/jquery',
        jQuery: 'jquery/jquery',

        // the Vue lib
        Vue: 'vue/vue.min',
        // Vue RequireJS loader
        vue: 'vue/vue.requirejs',

        theme: '../../themes/dimension/assets/js'
    }

});

// Start the main app logic.
requirejs([
    'requirejs/require_extra',
    'jquery',
    'Vue',
    'vue',
    'page_control',
    'player_control',
    'theme/breakpoints.min',
    'theme/browser.min'
], function () {

    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
    window.dataLayer = window.dataLayer || [];

    //google analytics
    function gtag() {
        dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', 'UA-26904270-14');

});

require([
    'Vue',
    'vue',
    'jquery',
    'theme/util',
    'theme/main'
], function (vue) {

        player = new PlayerController();
        page = new PageController(vue);



        page.init();
        player.initPlayer();
});