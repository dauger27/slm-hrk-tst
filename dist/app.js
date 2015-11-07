
//we'll put the router here in the future.
angular.module("main",['ngRoute']).config(['$routeProvider',
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
angular.module("main").controller("GameCtrl", ["$scope","$location","$http",function($scope,$location,$http){
    
    if(!localStorage.auth){
        console.log("No Auth");
        $location.path('/login')
    }
    
    //Here is an example of an http request that hits an API endpoint...
    $http.get("/players").then(function(data){
        console.log(data.data);
        $scope.players = data.data;
    },function(error){
        console.log(error);
    });
}]);
angular.module("main").controller("LoginCtrl", ["$scope",function($scope){
    
    $scope.setAuth = function(val){
        localStorage.auth = val;
        console.log("Auth set to " + val);
    }
}]);
angular.module("main").controller("DashCtrl", ["$scope","$location",function($scope,$location){
    
    if(!localStorage.auth){
        console.log("no Auth");
        $location.path('/login');
    }
}]);