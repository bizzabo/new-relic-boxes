(function() {
    "use strict";

    /**
     * @ngdoc directive
     * @name app.widgets:serverContainer
     * @module widgets
     * @restrict E
     *
     * @description Parent control for a collection of boxes designed to display server status
     * @example <server-container></server-container>
     */
    angular
        .module("app.widgets")
        .directive("serverContainer", serverContainerDirective);

    function serverContainerDirective() {
        var directive = {
            templateUrl: "app/widgets/serverContainer.directive.html",
            restrict: "E"
        };

        return directive;
    }

}());