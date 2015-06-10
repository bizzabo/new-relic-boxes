function MainCtrl($scope, $resource, poller, localStorageService) {

    $scope.config = {
        grouping: [{type: 'prod', rank: 1, alarm: true}, {type: 'demo', rank: 2, alarm: true}, {type: 'int', rank: 3}, {type: 'dev', rank: 4}],
        defaultGroup: {type: 'general', rank: 1000},
        defaultPollingTime: 20000
    };

    $scope.applications = {};
    $scope.servers = {};
    $scope.size = {};

    $scope.user = {
        name: localStorageService.get('name'),
        apiKey: localStorageService.get('apiKey'),
        favicon: localStorageService.get('favicon')
    };

    $scope.setPollers = function (pollers) {
        _.each(pollers, function(pollerType) {
            var resource = $resource('https://api.newrelic.com/v2/' + pollerType + '.json', {}, {
                get: {
                    method: 'Get',
                    isArray: false,
                    headers: {'X-Api-Key': $scope.user.apiKey}
                }
            });

            var serverPoller = poller.get(resource, { delay: $scope.config.defaultPollingTime});
            serverPoller.promise.then(null, null, function (data) {
                var time = new Date();
                $scope.time = time.getHours() + ':' + time.getMinutes();
                $scope.parseData(data[pollerType], pollerType);
            });
        })
    };

    $scope.getBoxClass = function (box) {
        var color;
        if (!box) return;
        if (!box.health_status && !box.reporting) {
            color = 'grey';
        }
        else {
            color = box.health_status;
        }

        return 'color-' + color;
    };

    $scope.parseData = function (data, pollerType) {
        $scope.size[pollerType] = data.length;
        _.each(data, function (res) {
            res.name = res.name.toLowerCase();
            var findByGroupName = function(group) {
                return (res.name.indexOf(group.type) > -1)
            };
            var groupSelected = _.find($scope.config.grouping, findByGroupName) || $scope.config.defaultGroup;

            res.name = $.trim(res.name.replace(groupSelected.type, '').replace('-',' '));

            if (!$scope[pollerType][groupSelected.type]) {
                $scope[pollerType][groupSelected.type] = {
                    data: {},
                    name: groupSelected.type,
                    rank: groupSelected.rank
                };
            }
            var data = $scope[pollerType][groupSelected.type].data;
            var previousObject = data[res.name];
            var shouldAlert = (previousObject && (previousObject.health_status !== res.health_status) && res.health_status !== 'green');
            if (shouldAlert && groupSelected.type.alarm) {
                document.getElementById('soundAlarm').play();
            }

            data[res.name] = res;
        });
    };

    $scope.testAlarm = function () {
        document.getElementById('soundAlarm').play();
    };

    $scope.saveSettings = function () {
        localStorageService.set('apiKey', $scope.user.apiKey);
        localStorageService.set('name', $scope.user.name);
        localStorageService.set('favicon', $scope.user.favicon);
        $scope.setPollers(['applications', 'servers']);
    };

    $scope.setPollers(['applications', 'servers']);
}

var app = angular.module('myApp', ['ngResource', 'emguo.poller', 'LocalStorageModule']);

app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('boxes');
});

app.filter('orderByValue', function () {
    return function (obj) {
        var array = _.values(obj);
        return _.sortBy(array, 'rank');
    };
});







