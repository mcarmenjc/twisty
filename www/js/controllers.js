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
.controller('DashboardCtrl', function($scope, $cordovaGeolocation, $cordovaDeviceOrientation, $stateParams, twistyService) {
	$scope.category = $stateParams.categoryId;
	$scope.minutes = $stateParams.minutes;
	$scope.places = twistyService.getDashboard($stateParams.categoryId, $stateParams.minutes);
	$scope.nearestPlace = $scope.places[0];
	$scope.twitterShare = false;
	$scope.facebookShare = false;
	$scope.vbLoveItShare = false;

	//{{nearestPlace.geolocation.latitude}},{{nearestPlace.geolocation.longitude}}

	var here, map, infowindow, sonar;
	var bearings = [];
	var position = {};
    var color = "#0c63ee";
	var categories = ['foods','drinks','sites','culture','shopping'];

	var colourClasses = ['food', 'drinks', 'sites', 'culture', 'shopping'];
	$scope.colourTitleClass = colourClasses[$scope.category-1];
	if ($scope.nearestPlace.url === '' || $scope.nearestPlace.url === null || $scope.nearestPlace.url === undefined){
		$scope.nearestPlace.url = '#';
	}

	$scope.shareOnTwitter = function(){
		$scope.twitterShare = true;
	};
	$scope.shareOnFacebook = function(){
		$scope.facebookShare = true;
	};
	$scope.loveIt = function(){
		$scope.vbLoveItShare = true;
	};
	$scope.hasAddress = function(){
		if ($scope.nearestPlace.address !== '' && $scope.nearestPlace.address !== null && $scope.nearestPlace.address !== undefined){
			return true;
		}
		else{
			return false;
		}
	};
	$scope.hasPhone = function(){
		if ($scope.nearestPlace.phone !== '' && $scope.nearestPlace.phone !== null && $scope.nearestPlace.phone !== undefined){
			return true;
		}
		else{
			return false;
		}
	};

	// Init

	var styles = [
        {
          stylers: [
            { hue: color },
            { saturation: 0 }
          ]
        },{
          featureType: "road",
          elementType: "geometry",
          stylers: [
            { lightness: 100 },
            { visibility: "simplified" }
          ]
        },{
          featureType: "road",
          elementType: "labels",
          stylers: [
            { visibility: "off" }
          ]
        }
    ];

	function initializer(coordinate) {

		position = coordinate;

		here = new google.maps.LatLng(position.latitude, position.longitude);
		map = new google.maps.Map(document.getElementById('map-canvas'), {
		    center: here,
		    zoom: 15,
		}).setOptions({styles: styles});
		infowindow = new google.maps.InfoWindow();
		sonar = new google.maps.Marker({
		  icon: 'sonar.png',
		  position: here,
		  map: map,
		  title: 'Aloha!'
		});

		$scope.places = twistyService.getNearestPlaces($scope.category, $scope.minutes, position.latitude, position.longitude);
	    $scope.nearestPlace = $scope.places[0];

	    for (var i in $scope.places) {
	    	createMarker($scope.places[i]);
	    	bearings.push(getBearing(here.lat(),here.lng(),$scope.places[i].lat,$scope.places[i].lng));
   		}
	}

	function onWatchHeadingSuccess(result) {   
        var difference, orientation = Math.round(result.magneticHeading*1000)/1000;
        if(orientation > 180) { orientation -= 360; }

	    for (var i = 0; i <= bearings.length; i++) { 
	        var targetBearing = bearings[i];
	        if(targetBearing > 180) { targetBearing -= 360; }
	        var temp = Math.abs(orientation-targetBearing);
	        if (temp < difference || difference == null) {
	          difference = temp;
	        }
	    }
    }

    function onWatchHeadingError(error) {}

    function createMarker(place) {

      	var marker = new google.maps.Marker({
        	map: map,
        	position: new google.maps.LatLng(place.lat,place.lng)
      	});

      	google.maps.event.addListener(marker, 'click', function() {
        	infowindow.setContent(place.name);
        	infowindow.open(map, this);
      	});
    } 

    function radians(n) {
      	return n * (Math.PI / 180);
    }

    function degrees(n) {
      	return n * (180 / Math.PI);
    }

    function getBearing(startLat,startLong,endLat,endLong) {
	    startLat = radians(startLat);
	    startLong = radians(startLong);
	    endLat = radians(endLat);
	    endLong = radians(endLong);

        var dLong = endLong - startLong;
        var dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));

        if (Math.abs(dLong) > Math.PI) {
        	if (dLong > 0.0) { dLong = -(2.0 * Math.PI - dLong); }
        	else { dLong = (2.0 * Math.PI + dLong); }
        }
      	return (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
    }

    $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: false}).then(null,
    function(err) {
      alert('err');
    },function (position) {
    	latitude  = position.coords.latitude;
    	longitude = position.coords.longitude;
    	initializer({latitude:latitude,longitude:longitude});
    });

	$cordovaDeviceOrientation.watchHeading({frequency: 1000}).then(null, onWatchHeadingError, onWatchHeadingSuccess);

});