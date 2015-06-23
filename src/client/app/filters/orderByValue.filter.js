(function() {
    "use strict";

    angular
        .module("app.filters")
        .filter("orderByValue", filterOrderByValue);

    filterOrderByValue.$inject = ["_"];

    /* @ngInject */
    function filterOrderByValue(_) {
        return function (obj) {
            var array = _.values(obj);
            return _.sortBy(array, 'rank');
        };
    }

}());