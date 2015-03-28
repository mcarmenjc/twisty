angular.module('twisty.services', [])

.factory('twistyService', function() {
  return {
    getDashboard: function(categoryId, minutes) {
      return [1, 2, 3];
    }
  };
});
