angular.module("main").controller("LoginCtrl", ["$scope","$http","$sce","$sanitize",function($scope,$http,$sce,$sanitize){
    $scope.userName = "";
    $scope.password = "";
    $scope.jsonData = "";
    
    $scope.setAuth = function(val){
        $http.post("/login",{"email_address":$scope.userName,"password":$scope.password}).then(function(data){
            
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