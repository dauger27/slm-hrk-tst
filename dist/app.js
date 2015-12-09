//we'll put the router here in the future.
angular.module("main",['ngRoute','ngSanitize','ab-base64']).config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'main/partials/login/login.html',
        controller: 'LoginCtrl'
      }).
      when('/getgames', {
        templateUrl: 'main/partials/game/game.html',
        controller: 'GameCtrl'
      }).
      when('/playerDash/:gameId/:playerId', {
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

angular.module("main").directive('scrollOnClick', function() {
  return {
    restrict: 'A',
    link: function(scope, $elm, attrs) {
      var idToScroll = attrs.scrollto;
      $elm.on('click', function() {
        var $target;
        if (idToScroll) {
          $target = $(idToScroll);
        } else {
          $target = $elm;
        }
          console.log($target);
        $("body").animate({scrollTop: $target.offset().top}, "slow");
      });
    }
  }
});
angular.module("main").controller("apiCtrl", ["$scope","$http","$sce","$sanitize",function($scope,$http,$sce,$sanitize){
    $scope.api = {};
    
    $http.get("/apiDocs").then(function(data){
        console.log(data.data);
        $scope.api = data.data;
    },function(error){
        console.log(error.data)
        $scope.data = $sce.trustAsHtml(error.data); 
    });
}]);
angular.module("main").controller("GameCtrl", ["$scope","$location","$http","$sce","$sanitize",function($scope,$location,$http,$sce,$sanitize){
    if(!localStorage.authToken){
        console.log("No Auth");
        $location.path('/login')
    }
    var authToken = localStorage.getItem("authToken");
    
    //Here is an example of an http request that hits an API endpoint...
    $http.get("/api/v1/getgames",{headers:{"x-auth-token":authToken}}).then(function(data){
        console.log(data.data);
        $scope.players = data.data;
    },function(error){
        console.log(error.data)
        $scope.error = $sce.trustAsHtml(error.data);
    });
    $scope.createGame = function(){
        //Here is an example of an http request that hits an API endpoint...
        $http.post("/api/v1/creategame",{name:$scope.name},{headers:{"x-auth-token":authToken}}).then(function(data){
            console.log(data.data);
            $scope.players = data.data;
        },function(error){
            console.log(error.data)
            $scope.error = $sce.trustAsHtml(error.data);
        });
    };
}]);
angular.module("main").controller("LoginCtrl", ["$scope","$http","$sce","$sanitize","base64",function($scope,$http,$sce,$sanitize,base64){
    $scope.userName = "";
    $scope.password = "";
    $scope.jsonData = "";
    
    $scope.setAuth = function(val){
        $http.post("/login",null,{headers:{"login":base64.encode($scope.userName+":"+$scope.password)}}).then(function(data){//todo start here
            
            //get the token and put it in local sotrage
            localStorage.setItem("authToken", JSON.stringify(data.data));
            $scope.jsonData = data.data;
        },function(error){
           console.log(error); 
        });
    }
    
    $scope.createAcct = function(val){
        if($scope.newPassword === $scope.repeatNewPassword){
            $http.post("/createacct",{"email_address":$scope.newEmailAddress,
                                      "password":$scope.newPassword,
                                      "username":$scope.newUserName}).then(function(data){
                $scope.data = $sce.trustAsHtml(data.data);
            },function(error){
                console.log(error.data)
                $scope.jsonData = error.data;
            });
        }
        else{
            $scope.data = "Passwords don't match";
        }
    }
    
    $scope.testAuth = function(){
        var authToken = localStorage.getItem("authToken"); //get Auth token
        
        $http.get("/api/v1/players",{headers:{"x-auth-token":authToken}}).then(function(data){
            console.log(data.data);
            $scope.jsonData = data.data;
        },function(error){
            console.log(error.data)
            $scope.data = $sce.trustAsHtml(error.data); 
        });
    }
}]);
angular.module("main").controller("DashCtrl", ["$scope","$location",function($scope,$location){
    
    if(!localStorage.auth){
        console.log("no Auth");
        $location.path('/login');
    }
}]);