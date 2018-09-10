requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js',

    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {

        // the Vue lib
        Vue: 'lib/vue/vue.min',
        // Vue RequireJS loader
        vue: 'lib/vue/vue.requirejs',

        theme_editorial: '../themes/editorial/assets/js',
        theme_dimension: '../themes/dimension/assets/js'
    },

    //Set the config for the i18n
    //module ID

    i18n: {
        locale: 'de'
    }
});

// Start the main app logic.
requirejs([

    'lib/requirejs/require_extra',
    'lib/jquery/jquery',

    'lib/i18n',
    'lib/player',
    'lib/page_controller',



    'theme_dimension/breakpoints.min',
    'theme_dimension/browser.min',
    'theme_dimension/util',
    'theme_dimension/main'

    /*
  'theme_editorial/browser.min',
  'theme_editorial/breakpoints.min',
  'theme_editorial/util',
  'theme_editorial/main'
  */

], function ($, canvas, sub, Vue, vue) {

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

require(['Vue', 'vue'], function (vue, v) {
    page = new PageController(vue);
    page.init();
});