requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',

    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {

        //requirejs addon
        domReady: [
            '//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
            'requirejs/domReady'
        ],

        //jquery
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
        // required for using vue components
        vue: [
            '//cdn.rawgit.com/edgardleal/require-vuejs/aeaff6db/dist/require-vuejs.min',
            'vue/vue-requirejs.min'
        ],

        //Storage js
        Storages: [
            '//unpkg.com/js-storage@1.0.4/js.storage.min',
            'jstorage/js.storage.min'
        ],

        themes: [
            '../../themes/dimension/assets/js'
        ]
    },


    shim: {
        
        'Vue': {
            exports: ['Vue']
        },
        
        'themes/main': {
            deps: ['jquery']
        },
        'themes/util': {
            deps:['jquery']
        },
        //html5 theme dependencies 
        
        'page': {
            deps:['libvue']
        }
    }
});

define('theme', [
    'themes/browser.min',
    'themes/breakpoints.min',
    'themes/util',
    'themes/main'
]);
define('libvue', [
    'Vue',
    'libvue/libvue-mainpage',
    'libvue/libvue-playlist',
    'libvue/libvue-video'
]);

require(['theme']);