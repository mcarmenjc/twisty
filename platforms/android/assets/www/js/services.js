angular.module('twisty.services', [])

.factory('twistyService', function() {
  var nearestPlaces = [
  {
    id: 0,
    name: 'Bar 1',
    description: 'Ramdon place 1',
    timeToGetThere: 5,
    phoneNumber: '02222222222',
    openAt: '10:00',
    closeAt: '22:00',
    imageUrl: 'http://f1.bcbits.com/img/a2831302216_2.jpg',
    geolocation: {
      x: 1,
      y: 1
    }
  }, {
    id: 2,
    name: 'Bar 1',
    description: 'Ramdon place 1',
    timeToGetThere: 5,
    phoneNumber: '02222222222',
    openAt: '10:00',
    closeAt: '22:00',
    imageUrl: 'http://f1.bcbits.com/img/a2831302216_2.jpg',
    geolocation: {
      x: 1,
      y: 1
    }
  }, {
    id: 3,
    name: 'Bar 1',
    description: 'Ramdon place 1',
    timeToGetThere: 5,
    phoneNumber: '02222222222',
    openAt: '10:00',
    closeAt: '22:00',
    imageUrl: 'http://f1.bcbits.com/img/a2831302216_2.jpg',
    geolocation: {
      x: 1,
      y: 1
    }
  }, {
    id: 4,
    name: 'Bar 1',
    description: 'Ramdon place 1',
    timeToGetThere: 5,
    phoneNumber: '02222222222',
    openAt: '10:00',
    closeAt: '22:00',
    imageUrl: 'http://f1.bcbits.com/img/a2831302216_2.jpg',
    geolocation: {
      x: 1,
      y: 1
    }
  }, {
    id: 5,
    name: 'Bar 1',
    description: 'Ramdon place 1',
    timeToGetThere: 5,
    phoneNumber: '02222222222',
    openAt: '10:00',
    closeAt: '22:00',
    imageUrl: 'http://f1.bcbits.com/img/a2831302216_2.jpg',
    geolocation: {
      x: 1,
      y: 1
    }
  }];
  return {
    getDashboard: function(categoryId, minutes) {
      return nearestPlaces;
    }
  };
});
