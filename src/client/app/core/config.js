(function() {
    "use strict";

    /* @ngInject */
    function localStorageConfig(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('boxes');
    }

    var polling_config = {
        grouping: [{type: 'prod', rank: 1, alarm: true}, {type: 'demo', rank: 2, alarm: true}, {type: 'int', rank: 3}, {type: 'dev', rank: 4}],
        defaultGroup: {type: 'general', rank: 1000},
        defaultPollingTime: 20 * 1000
    };

    angular
        .module("app.core")
        .config(localStorageConfig)
        .value("GROUP_POLLING_CONFIG", polling_config);

}());