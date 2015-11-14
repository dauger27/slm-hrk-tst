
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
angular.module("main").controller("LoginCtrl", ["$scope","$http",function($scope,$http){
    $scope.userName = "";
    $scope.password = "";
    
    $scope.setAuth = function(val){
        var authString = $scope.userName+":"+$scope.password; //here is a change.
        
        //we'll use proper Authorization headers and hashing later. Once I figure out how to do this reliably
        $http.get("/login",{headers:{"stuff":authString}}).then(function(data){
            
            //get the token and put it in local sotrage
            localStorage.setItem("authToken", JSON.stringify(data.data));
            $scope.data = data.data;
        },function(error){
           console.log(error); 
        });
    }
    
    $scope.testAuth = function(){
        var authToken = localStorage.getItem("authToken"); //get Auth token
        //console.log(authToken);
        $http.get("/api/v1/players",{headers:{"x-auth-token":authToken}}).then(function(data){
            console.log(data.data);
            $scope.data = data.data;
        },function(error){
           console.log(error); 
        });
    }
}]);
angular.module("main").controller("DashCtrl", ["$scope","$location",function($scope,$location){
    
    if(!localStorage.auth){
        console.log("no Auth");
        $location.path('/login');
    }
}]);