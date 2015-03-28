angular.module('twisty', ['ionic', 'ngCordova', 'twisty.controllers', 'twisty.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.filter('setDecimal', function ($filter) {
    return function (input, places) {
        if (isNaN(input)) return input;
        var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
        return Math.round(input * factor) / factor;
    };
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('twisty', {
    abstract: true,
    url: '/twisty',
    templateUrl: 'templates/twisty.html'
  })

  .state('twisty.categorySelection', {
    url: '/categorySelection',
    views: {
      'app-view': {
        templateUrl: 'templates/category-selection.html',
        controller: 'CategorySelectionCtrl'
      }
    }
  })

  .state('twisty.dashboard', {
      url: '/dashboard/:categoryId/:minutes',
      views: {
        'app-view': {
          templateUrl: 'templates/dashboard.html',
          controller: 'DashboardCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/twisty/categorySelection');

});