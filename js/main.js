requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        lib: 'lib',
        app: '../themes/editorial/assets/js'
    },

    //Set the config for the i18n
    //module ID
    i18n: {
        locale: locale
    }
});

// Start the main app logic.
requirejs([
    'lib/jquery',
    'lib/i18n',
    'lib/player',
    'lib/r',

    'app/browser.min',
    'app/breakpoints.min',
    'app/util',
    'app/main',

], function   ($,        canvas,   sub) {
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', 'UA-26904270-14');

});