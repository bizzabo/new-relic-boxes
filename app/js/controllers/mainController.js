function MainController($scope, $resource, $log, poller,
    localStorageService, User, BoxService, ServerPoller, HEALTH_CHECK_RANK, GROUP_POLLING_CONFIG) {
    "use strict";

    $scope.applications = {};
    $scope.servers = {};
    $scope.size = {};

    $scope.user = User;

    $scope.setPollers = function (pollers) {
        _.each(pollers, function(pollerType) {
            var serverPoller = ServerPoller.getServerPoller(pollerType);
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
            var groupSelected = _.find(GROUP_POLLING_CONFIG.grouping, findByGroupName) || GROUP_POLLING_CONFIG.defaultGroup;

            res.name = $.trim(res.name.replace(groupSelected.type, '').replace('-',' '));

            if (!$scope[pollerType][groupSelected.type]) {
                $scope[pollerType][groupSelected.type] = {
                    data: {},
                    name: groupSelected.type,
                    rank: groupSelected.rank
                };
            }

            var data = $scope[pollerType][groupSelected.type].data;
            var currentStatus = HEALTH_CHECK_RANK[res.health_status] || 0;

            var previousData = data[res.name] || {};
            var previousStatus = HEALTH_CHECK_RANK[previousData.health_status] || 0;

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

angular.module('myApp')
    .controller("MainCtrl", MainController);