function myAppConfig(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('boxes');
}

function filterOrderByValue() {
    return function (obj) {
        var array = _.values(obj);
        return _.sortBy(array, 'rank');
    };
}

angular.module('myApp', ['ngResource', 'emguo.poller', 'LocalStorageModule'])
    .config(myAppConfig)
    .constant('HEALTH_CHECK_RANK', {
        green: 0,
        orange: 1,
        red: 2,
        gray: 3,
        grey: 3
    })
    .value('GROUP_POLLING_CONFIG', {
        grouping: [{type: 'prod', rank: 1, alarm: true}, {type: 'demo', rank: 2, alarm: true}, {type: 'int', rank: 3}, {type: 'dev', rank: 4}],
        defaultGroup: {type: 'general', rank: 1000},
        defaultPollingTime: 20 * 1000
    })
    .filter('orderByValue', filterOrderByValue);







