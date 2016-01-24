//we'll put the router here in the future.
angular.module("main",['ngRoute','ngSanitize','ab-base64', 'slick', 'ngD3']).config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'main/partials/login/login.html',
        controller: 'LoginCtrl'
      }).
      when('/playerDash/:gameId/:playerId', {
        templateUrl: 'main/partials/game/game.html',
        controller: 'GameCtrl'
      }).
      when('/apiDocs', {
        templateUrl: 'main/partials/apiDocs/api.html',
        controller: 'apiCtrl'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);

 angular.module("main").directive("board",['$d3', function($d3){
    return{
        restrict:"E",
        scope:"=",
        link: function(scope,element,attrs){
            
            var size = attrs.size || $(element).parent().innerWidth();
            var cellWidth = size / 13;
            var cellHeight = cellWidth * 2;
            
            //get methods
            var d3 = $d3;
            
            scope.$watch('players', function(players) {
                if(players) { 
                    
                    d3.select(element[0]).selectAll('svg').remove();
                    
                    var side = players.board.length / 4;
                    var board = [];

                    for(var i=0; i<4; i++){
                        board.push([]);
                        for(var j=side*i; j<side*(i+1);j++){
                            board[i].push(players.board[j]);
                        }
                    }

                    //remove previous svg and append new append svg
                    var board = d3.select(element[0])
                                .append("svg")
                                .attr("width", size)
                                .attr("height", size)
                                .append("g")
                                .selectAll("g")
                                .data(board)
                                .enter()
                                .append("g")
                                .attr("transform",getSidePos)
                                .selectAll("g")
                                .data(function(d,i){return d;})
                                .enter()
                                .append("g")
                                .on("click",function(d,i){console.log(d); scope.setSlides(d.index);})
                                .attr("transform",getCellPos)
                                
                                //add base space
                    board.append("rect")
                                .attr("height", cellHeight)
                                .attr("width", getWidth)
                                .attr("x",0)
                                .attr("y", 0)
                                .attr("fill","white")
                                .attr("stroke", "black")
                                ;
                    
                                //add other space contents
                    board.append(getContents)
                                ;
            
                    
                    function getWidth(d,i){
                        if(i === 0){
                            d.width = cellWidth * 2;
                            return cellWidth * 2;
                        }
                        else{
                            d.width = cellWidth;
                            return cellWidth;
                        }
                    };

                    function getCellPos(d,i){
                        
                        var x = 0;
                        if(i === 0){
                            x = 0;
                            d.x = 0;
                        }
                        else if(i === 1){
                            x = cellWidth * 2;
                            d.x = cellWidth * 2;
                        }
                        else{
                            x = cellWidth * (i +1);
                            d.x = cellWidth * (i +1);
                        }
                        return "translate(" + x + ", 0 )";
                    };
                    
                    function getSidePos(d,i){
                        
                        var x = 0;
                        var y = 0;
                        
                        if(i===0){
                            x = 0;
                            y = 0;
                        }
                        else if(i===1){
                            x = size;
                            y = 0;
                        }
                        else if(i===2){
                            x = size;
                            y = size;
                        }
                        else if(i===3){
                            x = 0;
                            y = size
                        }
                        
                        return "translate("+x+","+y+") rotate("+ 90 * i +")";
                    };
                    
                    function getContents(d,i){
                        var group = d3.select(document.createElementNS(d3.ns.prefix.svg, 'g'));
                        
                        group.append("rect")
                            .attr("width", cellWidth)
                            .attr("height", cellHeight * .25)
                            .attr("x", 0)
                            .attr("y", cellHeight * .75)
                            .attr("fill", d.color)
                            ;
                        return group.node();
                    }
                    
                }
            }, true);
            
            
            
            
            
            
            
            
        }
    } 
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