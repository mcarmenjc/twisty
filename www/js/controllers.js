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
	$scope.twitterShare = false;
	$scope.facebookShare = false;
	$scope.vbLoveItShare = false;

	//{{nearestPlace.geolocation.latitude}},{{nearestPlace.geolocation.longitude}}
	
	// $scope.shareOnTwitter = function(){
	// 	$scope.twitterShare = true;
	// }
	// $scope.shareOnFacebook = function(){
	// 	$scope.facebookShare = true;
	// }
	// $scope.loveIt = function(){
	// 	$scope.vbLoveItShare = true;
	// }

	var bearings = [];
    var color = "#0c63ee";
	var latitude = 51.5073509, longitude = -0.12775829999998223;
	var categories = ['foods','drinks','sites','culture','shopping'];

	function getLatitudeAndLongitude () {
		navigator.geolocation.getCurrentPosition(posOptions).then(function (position) {
	    	latitude  = position.coords.latitude;
	    	longitude = position.coords.longitude;
	    }, function(err) {

	    });

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

    var sonar, map, here = new google.maps.LatLng(51.513871, -0.128329);
    var infowindow = new google.maps.InfoWindow();

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


	here = new google.maps.LatLng(latitude, longitude);
	map = new google.maps.Map(document.getElementById('map-canvas'), {
	  center: here,
	  zoom: 15,
	});

  	map.setOptions({styles: styles});

	sonar = new google.maps.Marker({
	  icon: 'sonar.png',
	  position: here,
	  map: map,
	  title: 'Aloha!'
	});

 	var http_request = new XMLHttpRequest();
	 
	try {
	    http_request = new XMLHttpRequest();
	} catch (e) {
	    try {
	        http_request = new ActiveXObject("Msxml2.XMLHTTP");
	    } catch (e) {
	       	try {
	        	http_request = new ActiveXObject("Microsoft.XMLHTTP");
	       	} catch (e){
	          alert("Your browser broke!");
	          return false;
	       }
	    }
	}

	http_request.onreadystatechange = function() {
	    if (http_request.readyState == 4){
	    	//var jsonObj = JSON.parse(http_request.responseText);
	    	//callback(jsonObj);
	    }
	}

	http_request.open("GET", "http://twisty.jit.su/venues/"+latitude+"/"+longitude+"/"+categories[$scope.category]+"/"+$scope.minutes, true);
	http_request.send();

    function callback(results) {

       	for (var i in results) {
        	createMarker(results[i]);
        	bearings.push(getBearing(here.lat(),here.lng(),results[i].lat,results[i].lng));

        	/* Populate front end */

       	}

      	window.addEventListener('deviceorientation', checkRadar, false);
    }

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

    function checkRadar(eventData) {
        var difference,orientation = Math.round(eventData.webkitCompassHeading*1000)/1000;
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

	var deviceOrientationOptions = {frequency: 1000};
	//navigator.compass.watchHeading(deviceOrientationOptions).then(null, onWatchHeadingError, onWatchHeadingSuccess);
});