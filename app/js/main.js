function MainCtrl($scope, $resource, $log, poller,
    localStorageService, User, BoxService, ServerPoller, HEALTH_CHECK_RANK, GROUP_POLLING_CONFIG) {
    "use strict";

    $scope.config = GROUP_POLLING_CONFIG;
    $scope.healthCheckRank = HEALTH_CHECK_RANK;

    $scope.applications = {};
    $scope.servers = {};
    $scope.size = {};

    $scope.user = User;

    $scope.setPollers = function (pollers) {
        _.each(pollers, function(pollerType) {
            var serverPoller = ServerPoller.getServerPoller();
            serverPoller.promise.then(null, null, function (data) {
                $scope.time = ServerPoller.getTime();
                $('#time-display').toggleClass('color-red', !data.links);
                if (!data.links) {
                    $scope.playAlarm();
                    return;
                }
                $scope.parseData(data[pollerType], pollerType);
            });
        });
    };

    $scope.getBoxClass = new BoxService().getBoxClass;

    $scope.parseData = function (data, pollerType) {
        var shouldAlert = false;
        $scope.size[pollerType] = data.length;
        _.each(data, function (res) {
            res.name = res.name.toLowerCase();
            var findByGroupName = function(group) {
                return (res.name.indexOf(group.type) > -1);
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
            var currentStatus = $scope.healthCheckRank[res.health_status] || 0;

            var previousData = data[res.name] || {};
            var previousStatus = $scope.healthCheckRank[previousData.health_status] || 0;

            var status = (currentStatus - previousStatus);
            $log.debug('status', status);
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
        $scope.user.save();
        $scope.setPollers(['applications', 'servers']);
    };

    $scope.setPollers(['applications', 'servers']);
}

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







