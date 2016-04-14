//we'll put the router here in the future.
//the .config method registers work that needs to be done on module load, in this case the router
angular.module("main",['ngRoute','ngSanitize','ab-base64', 'ngD3']).config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        name: "Login Page",
        include: true,
        templateUrl: 'main/partials/login/login.html',
        controller: 'LoginCtrl'
      }).
      when('/playerDash/:gameId', {
        name: "bypass",
        include: false,
        templateUrl: 'main/partials/game/game.html',
        controller: 'GameCtrl'
      }).
      when('/games', {
        name: "Games",
        include: true,
        templateUrl: 'main/partials/playerDash/playerDash.html',
        controller: 'DashCtrl'
      }).
      when('/apiDocs', {
        name: "API Documentation",
        include: true,
        templateUrl: 'main/partials/apiDocs/api.html',
        controller: 'apiCtrl'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);
