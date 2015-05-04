angular.module('twisty.services', [])

.factory('twistyService', function() {
  var nearestPlaces = [
  {
    category:'Bar',
    icon: { 
      prefix:'https://ss3.4sqi.net/img/categories_v2/nightlife/pub_', 
      suffix:'.png'
    },
    id:'4bf2dfd998ac0f47313e62a8',
    lat: 51.506673,
    lng:-0.126951,
    name:'Walkers Wine & Ale Bar',
    travel: { 
      time:109, 
      distance_breakdown:{ walk:132}
    },
    time:109
  },
                       {
                       category:'Bar',
                       icon: {
                       prefix:'https://ss3.4sqi.net/img/categories_v2/nightlife/pub_',
                       suffix:'.png'
                       },
                       id:'4bf2dfd998ac0f47313e62a8',
                       lat: 53.5063434,
                       lng:-3.5323222,
                       name:'Another Bar',
                       travel: { 
                       time:109, 
                       distance_breakdown:{ walk:132}
                       },
                       time:109
                       }];
  return {
    getDashboard: function(categoryId, minutes, latitude, longitude) {
      return nearestPlaces;
    },
    getNearestPlaces: function(categoryId, minutes, latitude, longitude) {
      return nearestPlaces;
    }
  };
});
