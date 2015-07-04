(function() {
    "use strict";

    /**
     * @ngdoc directive
     * @name  app.widgets:filterButtons
     * @module  widgets
     * @restrict E
     *
     * @description Parent control for a collection of buttons designed to filter new relic
     * status boxes
     * @example <filter-buttons></filter-buttons>
     */
    angular
        .module("app.widgets")
        .directive("filterButtons", filterButtonsDirective);

    function filterButtonsDirective() {
        var directive = {
            templateUrl: "app/widgets/filterButtons.directive.html",
            restrict: "E"
        };

        return directive;
    }

}());