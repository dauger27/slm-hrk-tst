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