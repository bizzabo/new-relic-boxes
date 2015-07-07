(function() {
    "use strict";

    angular
        .module("app.newrelic")
        .controller("MainCtrl", MainController);

    MainController.$inject = ["$scope", "$log", "User",
        "BoxService", "ServerPoller", "HEALTH_CHECK_RANK", "GROUP_POLLING_CONFIG",
        "$", "_", "GroupService"];

    /* @ngInject */
    function MainController($scope, $log, User,
        BoxService, ServerPoller, HEALTH_CHECK_RANK, GROUP_POLLING_CONFIG,
        $, _, GroupService) {

        $scope.applications = {};
        $scope.servers = {};
        $scope.size = {};
        $scope.filterBoxes = {
            'green': false,
            'orange': false,
            'red': false,
            'grey': false
        };

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

        $scope.goToLink = new BoxService().goToLink;

        $scope.parseData = function (data, pollerType) {
            //initialize alert to off.
            var shouldAlert = false;
            //get amount of servers/applications
            $scope.size[pollerType] = data.length;
            _.each(data, function (res) {
                //all names to lowercase
                res.name = res.name.toLowerCase();

                var groupSelected = GroupService.findByGroupName(res);
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
                //fix new relic bug. return health_status sometimes as gray and not grey.
                if  (res.health_status === 'gray') {
                    res.health_status = 'grey';
                }
                //add new relic link
                if ($scope.user.accountId) {
                    res.link = 'https://rpm.newrelic.com/accounts/' + $scope.user.accountId+ '/' + pollerType + '/' + res.id;
                }
                var data = $scope[pollerType][groupSelected.type].data;
                //get server/application current status (green/orange/red/grey)
                var currentStatus = HEALTH_CHECK_RANK[res.health_status] || 0;
                //get server/application previous data to compare with current
                var previousData = data[res.name] || {};
                //get server/application previous status (green/orange/red/grey)
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

}());
