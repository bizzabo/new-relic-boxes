(function() {
    "use strict";

    angular
        .module("app.newrelic")
        .factory("User", userModel);

    userModel.$inject = ["localStorageService"];

    /* @ngInject */
    function userModel(localStorageService) {
        var User, user;
        User = function() {
            this.name = localStorageService.get('name');
            this.apiKey = localStorageService.get('apiKey');
            this.favicon = localStorageService.get('favicon');
        };

        User.prototype.save = function() {
            localStorageService.set('apiKey', this.apiKey);
            localStorageService.set('name', this.name);
            localStorageService.set('favicon', this.favicon);
        };

        user = new User();
        return user;

    }

}());