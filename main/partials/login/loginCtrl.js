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