(function() {
    "use strict";

    var health_check_rank = {
        green: 0,
        orange: 1,
        red: 2,
        grey: 3
    };

    angular
        .module("app.core")
        .constant("HEALTH_CHECK_RANK", health_check_rank)
        .constant("$", jQuery.noConflict())
        .constant("_", _.noConflict());

}());