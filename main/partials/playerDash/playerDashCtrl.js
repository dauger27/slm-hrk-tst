angular.module("main").controller("DashCtrl", ["$scope","$location",function($scope,$location){
    
    if(!localStorage.auth){
        console.log("no Auth");
        $location.path('/login');
    }
}]);