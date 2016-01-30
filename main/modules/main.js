//we'll put the router here in the future.
angular.module("main",['ngRoute','ngSanitize','ab-base64', 'ngD3']).config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'main/partials/login/login.html',
        controller: 'LoginCtrl'
      }).
      when('/playerDash/:gameId', {
        templateUrl: 'main/partials/game/game.html',
        controller: 'GameCtrl'
      }).
      when('/games', {
        templateUrl: 'main/partials/playerDash/playerDash.html',
        controller: 'DashCtrl'
      }).
      when('/apiDocs', {
        templateUrl: 'main/partials/apiDocs/api.html',
        controller: 'apiCtrl'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);