define(function (require) {

    try {
        let module;

        // Setup temporary Google Analytics objects.
        window.GoogleAnalyticsObject = "ga";
        window.ga = function () { (window.ga.q = window.ga.q || []).push(arguments); };
        window.ga.l = 1 * new Date();

        // Immediately add a pageview event to the queue.
        window.ga("create", "UA-26904270-14", "lastfm.rimkus.it");
        window.ga("send", "pageview");

        // Create a function that wraps `window.ga`.
        // This allows dependant modules to use `window.ga` without knowingly
        // programming against a global object.
        module = function () { window.ga.apply(this, arguments); };

        // Asynchronously load Google Analytics, letting it take over our `window.ga`
        // object after it loads. This allows us to add events to `window.ga` even
        // before the library has fully loaded.
        require(["//www.google-analytics.com/analytics.js"]);

        return module;
    } catch (e) {
        console.error('error loading analytics tracker', e);
    }

});