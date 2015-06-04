function MainCtrl($scope, $resource, poller, localStorageService) {

//predefined artists
    $scope.grouping = [{type: 'prod', rank: 1}, {type: 'demo', rank: 2}, {type: 'int', rank: 3}, {type: 'dev', rank: 4}];
    $scope.defaultPollingTime = 20000;

    $scope.applications = {};
    $scope.servers = {};
    $scope.size = {};

    $scope.user = {
        name: localStorageService.get('name'),
        apiKey: localStorageService.get('apiKey'),
        favicon : localStorageService.get('favicon')
    };


    $scope.setPollers = function (pollers) {
        _.each(pollers, function(pollerType) {
            var Resource = $resource('https://api.newrelic.com/v2/' + pollerType + '.json', {}, {
                get: {
                    method: "Get",
                    isArray: false,
                    headers: {'X-Api-Key': $scope.user.apiKey}
                }
            });

            var serverPoller = poller.get(Resource, { delay: $scope.defaultPollingTime});
            serverPoller.promise.then(null, null, function (data) {
                var time = new Date();
                $scope.time = time.getHours() + ':' + time.getMinutes();
                $scope.parseData(data[pollerType], pollerType);
            });
        })
    };

    $scope.getBoxClass= function (box) {
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

    $scope.parseData = function (data, name) {
        $scope.size[name] = data.length;
        _.each(data, function (res) {
            res.name = res.name.toLowerCase();
            var groupSelected = {};
            _.each($scope.grouping, function (group) {
                if (res.name.indexOf(group.type)  > -1) {
                    groupSelected = {
                        name : group.type,
                        rank : group.rank
                    };
                    res.name = $.trim(res.name.replace(groupSelected.name, '').replace('-',' '));
                }
            });
            groupSelected.name = groupSelected.name || 'general';
            groupSelected.rank = groupSelected.rank || 1000;

            if (!$scope[name][groupSelected.name]) {
                $scope[name][groupSelected.name] = {data : {}, rank : groupSelected.rank};
            }
            var data =  $scope[name][groupSelected.name].data;

            if (data[res.name] && (data[res.name].health_status !== res.health_status) && res.health_status!=='green') {
                document.getElementById('soundAlarm').play();
            }

            data[res.name] = res;
        })
    };

    $scope.testAlarm = function () {
        document.getElementById('soundAlarm').play();
    },

    $scope.saveSettings = function () {
        localStorageService.set("apiKey", $scope.user.apiKey);
        localStorageService.set("name", $scope.user.name);
        localStorageService.set("favicon", $scope.user.favicon);
        $scope.setPollers(['applications', 'servers']);
    };

    $scope.setPollers(['applications', 'servers']);
}

var app = angular.module("myApp", ['ngResource', 'emguo.poller', 'LocalStorageModule']);

app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('boxes');
});

app.filter('orderByValue', function () {

    return function (obj) {
        var array = [];
        Object.keys(obj).forEach(function (key) {
            // inject key into each object so we can refer to it from the template
            obj[key].name = key;
            array.push(obj[key]);
        });
        // apply a custom sorting function
        array.sort(function (a, b) {
            return a.rank - b.rank;
        });
        return array;
    };
});







