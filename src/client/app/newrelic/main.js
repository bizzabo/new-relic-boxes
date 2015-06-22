(function() {
    "use strict";

    /* @ngInject */
    function MainController($scope, $log, poller, localStorageService, User,
        BoxService, ServerPoller, HEALTH_CHECK_RANK, GROUP_POLLING_CONFIG,
        $, _) {

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
            //initialize alert to off.
            var shouldAlert = false;
            //get amount of servers/applications
            $scope.size[pollerType] = data.length;
            _.each(data, function (res) {
                //all names to lowercase
                res.name = res.name.toLowerCase();
                //Finding relevant group name
                var findByGroupName = function(group) {
                    return (res.name.indexOf(group.type) > -1);
                };
                //Assigning to relevant group. assign to default group if not assigned.
                var groupSelected = _.find(GROUP_POLLING_CONFIG.grouping, findByGroupName) || GROUP_POLLING_CONFIG.defaultGroup;

                //removing '-' char from servers/applications names
                res.name = $.trim(res.name.replace(groupSelected.type, '').replace('-',' '));

                //Creating a group if group was not created. Group are sorted by their rank
                if (!$scope[pollerType][groupSelected.type]) {
                    $scope[pollerType][groupSelected.type] = {
                        data: {},
                        name: groupSelected.type,
                        rank: groupSelected.rank
                    };
                }

                var data = $scope[pollerType][groupSelected.type].data;
                //get server/application current status (green/orange/red/grey/gray)
                var currentStatus = HEALTH_CHECK_RANK[res.health_status] || 0;
                //get server/application previous data to compare with current
                var previousData = data[res.name] || {};
                //get server/application previous status (green/orange/red/grey/gray)
                var previousStatus = HEALTH_CHECK_RANK[previousData.health_status] || 0;
                //compare between current & previous status. Negative status means server/application status got worse.
                var status = (currentStatus - previousStatus);
                $log.debug('status', status);
                if (groupSelected.alarm && (status > 0)) {
                    //alert will be played.
                    shouldAlert = true;
                }
                //update server/application data
                data[res.name] = res;
            });

            //playing alert in case should alert set to true.
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

    angular
        .module("app.newrelic")
        .controller("MainCtrl", MainController);
}());