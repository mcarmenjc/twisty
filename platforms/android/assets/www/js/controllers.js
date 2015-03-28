angular.module('twisty.controllers', [])
.controller('CategorySelectionCtrl', function($scope) {
	var i = 0;
	$scope.categories = [
		{
			id: 1,
			name: 'FOOD',
			cssClass: 'button-positive'
		},
		{
			id: 2,
			name: 'DRINKS',
			cssClass: 'button-balanced'
		},
		{
			id: 3,
			name: 'SITES',
			cssClass: 'button-energized'
		},
		{
			id: 4,
			name: 'CULTURE',
			cssClass: 'button-royal'
		},
		{
			id: 5,
			name: 'SHOPPING',
			cssClass: 'button-assertive'
		}
	];
	$scope.minutesList = [];
	for (i = 5; i <= 180; i += 5) {
		$scope.minutesList.push(i);
	}
	$scope.selectedCategory = -1;
	$scope.selectedMinutes = 10;
	$scope.selectCategory = function(categoryId) {
    	if ($scope.isCategorySelected(categoryId)) {
      		$scope.selectedCategory = -1;
    	} else {
    		$scope.selectedMinutes = 10;
      		$scope.selectedCategory = categoryId;
    	}
  	};
  	$scope.isCategorySelected = function(categoryId) {
    	return $scope.selectedCategory === categoryId;
  	};
  	$scope.selectMinutes = function(minutes) {
    	$scope.selectedMinutes = minutes;
  	};
  	$scope.isThisAmountOfMinutesSelected = function(minutes) {
    	return $scope.selectedMinutes === minutes;
  	};
  	$scope.getSelectedCategory = function() {
    	var category = $scope.categories.find(function(cat) { return cat.id == $scope.selectedCategory });
    	return category;
  	};
})
.controller('DashboardCtrl', function($scope, $stateParams, twistyService) {
	$scope.category = $stateParams.categoryId;
	$scope.minutes = $stateParams.minutes;
	$scope.places = twistyService.getDashboard($stateParams.categoryId, $stateParams.minutes);
	$scope.nearestPlace = $scope.places[0];

	function getLatitudeAndLongitude () {
		var latitude = 0, 
			longitude = 0;
		navigator.geolocation.getCurrentPosition(posOptions).then(function (position) {
		      latitude  = position.coords.latitude
		      longitude = position.coords.longitude
		    }, function(err) {});

		return {latitude: latitude, longitude: longitude};
	}

	function onWatchHeadingSuccess(result) {   
      	var posOptions = {timeout: 10000, enableHighAccuracy: false},
      		position,
      		magneticHeading;
		position = getLatitudeAndLongitude ();
        magneticHeading = result.magneticHeading;
        $scope.places = twistyService.getNearestPlaces($scope.category, $scope.minutes, magneticHeading, position);
        $scope.nearestPlace = $scope.places[0];
    }

    function onWatchHeadingError(error) {}

	var deviceOrientationOptions = {frequency: 1000};
	navigator.compass.watchHeading(deviceOrientationOptions).then(null, onWatchHeadingError, onWatchHeadingSuccess);
});