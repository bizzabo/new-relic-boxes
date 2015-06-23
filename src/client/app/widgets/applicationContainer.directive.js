(function() {
    "use strict";

    /**
     * @desc Parent control for a collection of boxes designed to display application status
     * @example <application-container></application-container>
     */
    angular
        .module("app.widgets")
        .directive("applicationContainer", applicationContainerDirective);

    function applicationContainerDirective() {
        var directive = {
            templateUrl: "app/widgets/applicationContainer.directive.html",
            restrict: "E"
        };

        return directive;
    }

}());