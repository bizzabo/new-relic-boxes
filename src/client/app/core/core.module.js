(function() {
    "use strict";

    angular
        .module("app.core", [
            "emguo.poller",
            "LocalStorageModule",
            "app.newrelic"
        ]);
}());