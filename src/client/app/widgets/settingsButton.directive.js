(function() {
    "use strict";

    /**
     * @ngdoc directive
     * @name  app.widgets:settingsButton
     * @module  widgets
     * @restrict E
     *
     * @description Control designed to trigger a state transition to manage settings
     * @example <settings-button></settings-button>
     */
    angular
        .module("app.widgets")
        .directive("settingsButton", settingsButtonDirective);

    function settingsButtonDirective() {
        var directive = {
            templateUrl: "app/widgets/settingsButton.directive.html",
            restrict: "E"
        };

        return directive;
    }

}());