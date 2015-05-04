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
    		$scope.selectedMinutes = 5;
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
	$scope.places = [];
    $scope.nearestPlace = {};
    $scope.lng = '';
    $scope.lat = '';
	$scope.twitterShare = false;
	$scope.facebookShare = false;
	$scope.vbLoveItShare = false;

	var pos, map, infowindow, sonar;
	var bearings = [];
    var position;
    var color = "#0c63ee";
	var categories = ['foods','drinks','sites','culture','shopping'];

	var colourClasses = ['food', 'drinks', 'sites', 'culture', 'shopping'];
	$scope.colourTitleClass = colourClasses[0];
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
            
    function initialize() {
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            zoom: 15
        });

        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                $scope.lat = position.coords.latitude;
                $scope.lng = position.coords.longitude;
                infowindow = new google.maps.InfoWindow({
                    map: map,
                    position: pos,
                    content: 'You are here'
                });
                                                             
                map.setCenter(pos);
                                                             
                var request = {
                    location: pos,
                    radius: '500',
                    types: ['bar']
                };
                        
                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, callback);
                        
            }, function() {
                handleNoGeolocation(true);
            });
        } else {
            handleNoGeolocation(false);
        }
    }
            
    function handleNoGeolocation(errorFlag) {
        if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
        } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
        }
    }
            
    function callback(results, status) {
        
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                $scope.places.push(results[i]);
                console.log(results[i]);
                bearings.push(getBearing(pos.lat(),pos.lng(),results[i].geometry.location.A,results[i].geometry.location.F));
                //createMarker(results[i]);
            }
            $cordovaDeviceOrientation.watchHeading({frequency: 100}).then(null, onWatchHeadingError, onWatchHeadingSuccess);
        }
    }
            
    initialize();
           
    function onWatchHeadingSuccess(result) {
    
        var smallestAngDist;//stores the smallest angular distance between device heading and places' bearing
        var nearest;//stores the nearest place based on angular distance
    
        //converts device heading from a 360 degrees system to a 180 degrees system, and stores its value in the "heading" var
        if(result.magneticHeading > 180) {
            var heading = result.magneticHeading-360;
        } else {
            var heading = result.magneticHeading;
        }
    
        //compares the bearing of each place (degrees away fron North relative to device geolocation) against the device heading to determine the nearest one based on angular distance
        for (var i = 0; i < bearings.length; i++) {
    
            //converts each bearing from a 360 degrees system to a 180 degress system, and stores its value in "bearing" var (could be better to have values normalized in the bearings array before the "onWatchHeadingSuccess" function is called)
            if(bearings[i] > 180) {
                var bearing = bearings[i]-360;
            } else {
                var bearing = bearings[i];
            }       
    
            var AngDist = Math.abs(Math.round((heading-bearing)*100)/100);//stores the angular distance between the heading and the currently selected bearing
    
            //console.log('orgheading: '+result.magneticHeading+'; '+'heading: '+heading+'; '+'bearing: '+bearing+'; '+'angular distance to place '+i+': '+AngDist);
    
            //determines the smallest angular distance at present and stores its corresponding place to the "nearest" var
            if (AngDist < smallestAngDist || smallestAngDist === undefined) {
                smallestAngDist = AngDist;
                nearest = $scope.places[i];
            }
        }
        //after looping through all the bearings to determine the nearest place to the device heading, it assigns the final value of "nearest" to "$scope.nearestPlace"
        $scope.nearestPlace = nearest;
    }

    function onWatchHeadingError(error) {
        console.log('oWatchHeadingError');
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
});