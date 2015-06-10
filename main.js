function MainCtrl($scope, $resource, poller, localStorageService) {

    $scope.config = {
        grouping: [{type: 'prod', rank: 1, alarm: true}, {type: 'demo', rank: 2, alarm: true}, {type: 'int', rank: 3}, {type: 'dev', rank: 4}],
        defaultGroup: {type: 'general', rank: 1000},
        defaultPollingTime: 20 * 1000 * 1000
    };

    var p = ["Marc-André Ter Stegen", "Martín Montoya Torralbo", "Gerard Piqué Bernabeu", "Ivan Rakitic", "Sergio Busquets Burgos", "Xavier Hernández Creus", "Pedro Rodríguez Ledesma", "Andrés Iniesta Luján", "Luis Alberto  Suárez Díaz ", "Lionel Andrés Messi", "Neymar da Silva Santos Júnior", "Rafael Alcántara do Nascimento", "Claudio Bravo", "Javier Alejandro Mascherano", "Marc  Bartra Aregall", "Douglas Pereira dos Santos", "Jordi Alba Ramos", "Sergi Roberto Carnicer", "Adriano Correia Claro", "Daniel Alves da Silva", "Thomas Vermaelen", "Jérémy Mathieu", "Jordi Masip López", "Luis Enrique Martínez"];

    $scope.healthCheckRank = {
        green: 0,
        orange: 1,
        red: 2,
        gray: 3,
        grey: 3
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

            var serverPoller = poller.get(resource, { delay: $scope.config.defaultPollingTime, catchError: true});
            serverPoller.promise.then(null, null, function (data) {
                var time = new Date();
                var minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
                $scope.time = time.getHours() + ':' + minutes;
                $('#time-display').toggleClass('color-red', !data.links);
                if (!data.links) {
                    $scope.playAlarm();
                    return;
                }
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
        var shouldAlert = false;
        $scope.size[pollerType] = data.length;
        _.each(data, function (res) {
            res.name = res.name.toLowerCase();
            var findByGroupName = function(group) {
                return (res.name.indexOf(group.type) > -1)
            };
            var groupSelected = _.find($scope.config.grouping, findByGroupName) || $scope.config.defaultGroup;

            res.name = $.trim(res.name.replace(groupSelected.type, '').replace('-',' '));
            res.name = _.sample(p, 1)[0];

            if (!$scope[pollerType][groupSelected.type]) {
                $scope[pollerType][groupSelected.type] = {
                    data: {},
                    name: groupSelected.type,
                    rank: groupSelected.rank
                };
            }

            var data = $scope[pollerType][groupSelected.type].data;
            var currentStatus = $scope.healthCheckRank[res.health_status] || 0;

            var previousData = data[res.name] || {};
            var previousStatus = $scope.healthCheckRank[previousData.health_status] || 0;

            var status = (currentStatus - previousStatus);
            console.log('status', status);
            if (groupSelected.alarm && (status > 0)) {
                shouldAlert = true;
            }
            data[res.name] = res;
        });

        if (pollerType === 'servers') {
            $scope.counter++;
        }


        if (shouldAlert) {
            $scope.playAlarm();
        }
    };

    $scope.playAlarm = function () {
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







