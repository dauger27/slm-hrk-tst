angular.module("main").controller("LoginCtrl", ["$scope",function($scope){
    
    $scope.setAuth = function(val){
        localStorage.auth = val;
        console.log("Auth set to " + val);
    }
}]);