(function() {
    "use strict";

    /**
     * @desc Parent control encapsulating additional controls, meant to be floated
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