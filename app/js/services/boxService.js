function factoryBoxService() {
    var BoxService = function() {};

    BoxService.prototype.getBoxClass = function (box) {
        var color;
        if (!box) return;
        color = box.health_status;
        if (!box.health_status && !box.reporting) {
            color = 'grey';
        }

        return ['color', color].join("-");
    };

    return BoxService;
}

angular.module('myApp')
    .factory("BoxService", factoryBoxService);