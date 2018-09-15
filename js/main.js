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

        youtube: [
            '//www.youtube.com/iframe_api?noext=',
            'ytapi/iframe-api'
        ],

        theme: '../../themes/dimension/assets/js',

        // the Vue lib
        Vue: [
            '//unpkg.com/vue@2.5.17/dist/vue.min',
            'vue/vue.min'
        ],
        // Vue RequireJS loader
        vue: [            
            '//rawgit.com/edgardleal/require-vue/master/dist/require-vuejs',
            '//unpkg.com/requirejs-vue@1.1.5/requirejs-vue',
            'vue/vue.requirejs'
        ],

        //Storage js
        storage: [
            '//unpkg.com/js-storage@1.0.4/js.storage',
            'jstorage/js.storage.min'
        ]
    },

    config: {
        'vue': {
            'pug': 'browser-pug',
            'css': 'inject',
            'templateVar': 'template'
        }
    },

    shim: {
        'Vue': {
            exports: ['Vue']
        },
        
        'player': {
            depds: ['youtube']
        },       

        'theme/main': {
            deps: [
                'jquery',
                'theme/util',
                'theme/browser.min',
                'theme/breakpoints.min'                
            ]
        },
    }
});

// Start the main app logic.
requirejs([    
    'jquery',
    'youtube',
    'player', 
    'page'
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
    
    require(['storage', 'Vue', 'theme/main'], function (storage, vue) {

        player = new PlayerController();
        page = new PageController(storage, vue);

        player.initPlayer();
        page.init();
    });

});
