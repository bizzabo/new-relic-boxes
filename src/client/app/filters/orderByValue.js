(function() {
    "use strict";

    /* @ngInject */
    function filterOrderByValue(_) {
        return function (obj) {
            var array = _.values(obj);
            return _.sortBy(array, 'rank');
        };
    }

    angular
        .module("app.filters")
        .filter("orderByValue", filterOrderByValue);
}());