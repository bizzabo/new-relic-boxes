(function() {
    "use strict";

    /**
     * @ngdoc directive
     * @name  app.widgets:floatingControls
     * @module widgets
     * @restrict E
     *
     * @description Parent control encapsulating additional controls, meant to be floated
     * @example <floating-controls></floating-controls>
     */
    angular
        .module("app.widgets")
        .directive("floatingControls", floatingControlsDirective);

    function floatingControlsDirective() {
        var directive = {
            templateUrl: "app/widgets/floatingControls.directive.html",
            restrict: "E"
        };

        return directive;
    }

}());