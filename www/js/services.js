angular.module('twisty.services', [])

.factory('twistyService', function() {
  return {
    getDashboard: function(categoryId) {
      return [1, 2, 3];
    }
  };
});
