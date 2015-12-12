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