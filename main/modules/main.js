//we'll put the router here in the future.
angular.module("main",['ngRoute','ngSanitize']).config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'main/partials/login/login.html',
        controller: 'LoginCtrl'
      }).
      when('/games/:game', {
        templateUrl: 'main/partials/game/game.html',
        controller: 'GameCtrl'
      }).
      when('/playerDash/:gameId/:playerId', {
        templateUrl: 'main/partials/playerDash/playerDash.html',
        controller: 'DashCtrl'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);