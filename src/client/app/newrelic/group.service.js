(function() {
  "use strict";
  angular.module("app.newrelic")
    .factory("GroupService", groupServiceDefinition);

    /* @ngInject */
    function groupServiceDefinition(GROUP_POLLING_CONFIG, _) {
        return {
          findByGroupName: function(res) {
            var groupName = function(group) {
                return (res.name.indexOf(group.type) > -1);
            };
            //Assigning to relevant group. assign to default group if not assigned.
            var groupSelected = _.find(GROUP_POLLING_CONFIG.grouping, groupName) || GROUP_POLLING_CONFIG.defaultGroup;
            return groupSelected;
          }
        };
    }
}());
