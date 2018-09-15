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

        // the Vue lib
        Vue: 'vue/vue.min',
        // Vue RequireJS loader
        vue: 'vue/vue.requirejs',

        //Storage js
        Storages: 'jstorage/js.storage.min',

        theme: '../../themes/dimension/assets/js'
    },

    shim: {

        'theme/breakpoints.min': {
            deps: ['jquery']
        },
        'theme/browser.min': {
            deps: ['jquery']
        },
        'theme/util': {
            deps: ['jquery']
        },
        'theme/main': {
            deps: [
                'jquery',
                'theme/browser.min',
                'theme/breakpoints.min',
                'theme/util']
        },
        'player': {
            deps: ['jquery', 'theme/main', 'Storages', 'Vue', 'vue']
        },
        'page': {
            deps: ['jquery', 'theme/main', 'Storages','Vue', 'vue', 'player']
        }
    }


});

// Start the main app logic.
requirejs(['page', 'player'], function () {

    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
    window.dataLayer = window.dataLayer || [];

    //google analytics
    function gtag() {
        dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', 'UA-26904270-14');

    require([
        'Storages',
        'Vue',
        'vue'], function (Storages, Vue, vue) {

        player = new PlayerController();
        page = new PageController(Storages, Vue);

        player.initPlayer();
        page.init();
    });
});
