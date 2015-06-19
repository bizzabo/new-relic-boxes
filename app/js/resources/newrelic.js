function serviceNewRelic($resource, User) {
    var newRelic, NewRelic = function() {};

    NewRelic.prototype.getResource = function(pollerType) {
        var resource = $resource('https://api.newrelic.com/v2/' + pollerType + '.json', {}, {
            get: {
                method: 'Get',
                isArray: false,
                headers: {'X-Api-Key': User.apiKey}
            }
        });

        return resource;
    };
    newRelic = new NewRelic();
    return newRelic;
}

angular.module('myApp')
    .factory("NewRelic", serviceNewRelic);