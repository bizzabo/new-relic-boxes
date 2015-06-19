function serviceServerPoller(NewRelic, GROUP_POLLING_CONFIG) {
    var serverPoller, ServerPoller = function() {};

    ServerPoller.prototype.getServerPoller = function(pollerType) {
        var resource = NewRelic.getResource(pollerType);
        var serverPoller = poller.get(resource, { delay: GROUP_POLLING_CONFIG.defaultPollingTime, catchError: true});
        return serverPoller;
    };

    ServerPoller.prototype.getTime = function() {
        var time = new Date();
        var minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        return time.getHours() + ':' + minutes;
    };

    serverPoller = new ServerPoller();
    return serverPoller;
}

angular.module('myApp')
    .factory("ServerPoller", serviceServerPoller);