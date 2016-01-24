angular.module("main").controller("GameCtrl", ["$scope","$location","$http","$sce","$sanitize",function($scope,$location,$http,$sce,$sanitize){
    if(!localStorage.authToken){
        console.log("No Auth");
        $location.path('/login')
    }
    var authToken = localStorage.getItem("authToken");
        
    //Here is an example of an http request that hits an API endpoint...
    $http.get("/api/v1/getgame/3",{headers:{"x-auth-token":authToken}}).then(function(data){
        $scope.players = data.data;
        $scope.players.board.forEach(function(element,i){element.index = i;})
        $scope.slides = $scope.players.board.slice(0,3);
        console.log($scope.players.board);
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
    
    $scope.setSlides = function(index){
        if(index === 0){
            $scope.slides = [$scope.players.board[$scope.players.board.length - 1], $scope.players.board[0], $scope.players.board[1]];
        }
        else if(index === $scope.players.board.length - 1){
            $scope.slides = [$scope.players.board[$scope.players.board.length - 2], $scope.players.board[players.board.length - 1], $scope.players.board[0]];
        }
        else{
            $scope.slides = $scope.players.board.slice(index - 1,index + 2);
        }
        $scope.$apply();
    }
}]);