(function() {
    "use strict";

    /**
     * @desc Parent control for a modal template housing user settings
     * @example <modal-content></modal-content>
     */
    angular
        .module("app.modals")
        .directive("modalContent", modalContentDirective);

    function modalContentDirective() {
        var directive = {
            templateUrl: "app/modals/modalContent.directive.html",
            restrict: "E"
        };

        return directive;
    }

}());