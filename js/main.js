requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',

    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {

        jquery: [
            '//unpkg.com/jquery@3.3.1/dist/jquery.min',
            'jquery/jquery'
        ],

        // the Vue lib
        Vue: [
            '//unpkg.com/vue@2.5.17/dist/vue.min',
            'vue/vue.min'
        ],
        // Vue RequireJS loader
        vue: [
            '//cdn.rawgit.com/edgardleal/require-vuejs/aeaff6db/dist/require-vuejs.min',
            'vue/vue.requirejs'
        ],

        //Storage js
        Storages: [
            '//unpkg.com/js-storage@1.0.4/js.storage.min',
            'jstorage/js.storage.min'
        ],

        domReady: [
            '//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
            'requirejs/domReady'
        ]
    },

    shim: {
        'Vue': {
            exports: ['Vue']
        }
    }
});

// Start the main app logic.
requirejs(['jquery'], function () {

    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
    window.dataLayer = window.dataLayer || [];

    require(['domReady'], function (dom) {
        require([
            'Storages',
            'Vue',
            'player',
            'page'
        ], function (Storages, Vue) {

            //google analytics
            function gtag() {
                dataLayer.push(arguments);
            }

            gtag('js', new Date());
            gtag('config', 'UA-26904270-14');

            player = new PlayerController();
            page = new PageController(Storages, Vue);

            player.initPlayer();
            page.init();            
        });
    });

});
