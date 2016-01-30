//we'll put the router here in the future.
angular.module("main",['ngRoute','ngSanitize','ab-base64', 'ngD3']).config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'main/partials/login/login.html',
        controller: 'LoginCtrl'
      }).
      when('/playerDash/:gameId', {
        templateUrl: 'main/partials/game/game.html',
        controller: 'GameCtrl'
      }).
      when('/games', {
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
/*
 * A service the wraps url calls in a way that makes the easier to work with
 */

angular.module("main").factory("apiService",["$http","authService",function($http,authService){
    var urlBase = "/api/v1/";
    
    var makeUrl = function(fragment,arguments){
       var variable = "";
       if(arguments && typeof arguments === "object"){
           for(prop in arguments){
               variable = ":" + prop;
               fragment = fragment.replace(variable,arguments[prop]);
           }
       }

       return fragment;
    };
    
    return {
        setAPIbase:function(url){
           urlBase = "/api/v1/";
        },
        constructURL: function(fragment,arguments){
           
           return makeUrl(fragment,arguments);
        },
        get: function(url,arguments,authenticate){
            
            var finishedUrl = makeUrl(url,arguments);
            if(authenticate){
                return $http.get(finishedUrl, {headers:authService.getAuthHeader()});
            }
            else{
                return $http.get(finishedUrl);
            }
            
        },
        post: function(url,arguments,data,authenticate){
            
            var finishedUrl = url(url,arguments);
            if(authenticate){
                return $http.post(finishedUrl,data, {headers:authService.getAuthHeader()});
            }
            else{
                return $http.post(finishedUrl);
            }
            
        }
    } 
}]);
angular.module("main").factory('authService',["$interval", "$location","$rootScope", function($interval,$location,$rootScope) {
    
    //check if token is good on route change.
    $rootScope.$on('$locationChangeStart', function(event) {
        if($location.path() !== '/login'){
            if (!localStorage.authToken || localStorage.authObjectExpires && localStorage.authObjectExpires > new Date().getTime()) {
               console.log("the token either does not exist are is expired, please login");
               localStorage.removeItem("authToken");
               localStorage.removeItem("authTokenExpires");
               $location.path('/login');
            }
        }
    });
    
    //interface object
    var authService = {
      startAuthCheck: function(authToken){
        localStorage.setItem("authToken", JSON.stringify(authToken));
        localStorage.setItem("authTokenExpires", authToken.expires);
          
        var checker = $interval(function(){
            if(localStorage.authObjectExpires > new Date().getTime() ){
                localStorage.removeItem("authToken");
                localStorage.removeItem("authTokenExpires");
                $location.path('/login');
                console.log(checker.cancel());
            }
        },5000);
      },
      getToken: function(){
          return localStorage.authToken;
      },
      getAuthHeader: function(){
          return {"x-auth-token":localStorage.authToken}
      }
  };
  
  return authService;
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
                                .attr("transform","translate("+size+","+size+") rotate(180)")
                                .selectAll("g")
                                .data(board)
                                .enter()
                                .append("g")
                                .attr("transform",getSidePos)
                                .selectAll("g")
                                .data(function(d,i){return d;})
                                .enter()
                                .append("g")
                                .classed("space", true)
                                .on("click",clicked)
                                .attr("transform",getCellPos)
                                ;
                                
                                //add base space
                    board.append("rect")
                                .attr("height", cellHeight)
                                .attr("width", getWidth)
                                .attr("x",0)
                                .attr("y",0)
                                .classed("main-space",true)
                                ;
                    
                                //add other space contents
                    board.append(getContents)
                                ;
            
                    
                    function clicked(d,i){ 
                        d3.select(".selected").classed("selected",false); 
                        d3.select(this).classed("selected",true);
                        scope.setSlides(d.index);
                    };
                    
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
                        if(d.color){
                            group.append("rect")
                                .attr("width", cellWidth)
                                .attr("height", cellHeight * .25)
                                .attr("x", 0)
                                .attr("y", cellHeight * .75)
                                .attr("fill", d.color)
                                .classed("color-bar", true)
                                ;
                        }
                        
                        if(d.icon){
                            group.append("use");
                        }
                        
                        if(d.houseArray && !d.hotel){
                            group.selectAll(".board-house")
                                .data(d.houseArray)
                                .enter()
                                .append("rect")
                                .attr("height",5)
                                .attr("width",5)
                                .attr("y", cellHeight * .875)
                                .attr("x", function(d,j){return 2 + 6 * j;})
                                ;
                        }
                        
                        if(d.hotel){
                            group.append("rect")
                                .classed("hotel",true)
                                .attr("height",5)
                                .attr("width",15)
                                .attr("y", cellHeight * .875)
                                .attr("x", cellWidth / 2 - 7.5)
                                ;
                        }
                        
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
angular.module("main").controller("GameCtrl", ["$scope","$location","$http","$sce","$sanitize","$timeout","authService","apiService","$routeParams",function($scope,$location,$http,$sce,$sanitize,$timeout,authService,apiService,$routeParams){
        
    //Get game data
    apiService.get("/api/v1/getgame/:id",{id:$routeParams.gameId},true).then(function(data){
        $scope.players = data.data;
        $scope.players.board.forEach(function(element,i){
            element.index = i;
            if(element.color){
                element.houses = Math.round(Math.random() * 4);
                element.hotel = Math.random() > .75 ? true : false;
            }
            element.houseArray = $scope.numToArr(element.houses, element);
        });
        $scope.slides = $scope.players.board.slice(0,3);
        //console.log($scope.players.board);
    },function(error){
        console.log(error.data)
        $scope.error = $sce.trustAsHtml(error.data);
    });
    
    //set slides
    $scope.setSlides = function(index){
        
        if(index === 0){
            $scope.slides = [$scope.players.board[$scope.players.board.length - 1], $scope.players.board[0], $scope.players.board[1]];
        }
        else if(index === $scope.players.board.length - 1){
            $scope.slides = [$scope.players.board[$scope.players.board.length - 2], $scope.players.board[$scope.players.board.length - 1], $scope.players.board[0]];
        }
        else{
            $scope.slides = $scope.players.board.slice(index - 1,index + 2);
        }
        $scope.$apply();
    };
    
    //populate house array for data binding
    $scope.numToArr = function(num,element){
        var array = [];
        for(var i=0; i<num; i++){
            array.push({index:i,name:element.name + " " + (i + 1)});
        }
        return array;
    }
}]);
angular.module("main").controller("LoginCtrl", ["$scope","$http","$sce","$sanitize","base64","$location","authService",function($scope,$http,$sce,$sanitize,base64,$location,authService){
    $scope.userName = "";
    $scope.password = "";
    $scope.jsonData = "";
    
    $scope.setAuth = function(val){
        $http.post("/login",null,{headers:{"login":base64.encode($scope.userName+":"+$scope.password)}}).then(function(data){//todo start here
            
            //get the token and put it in local sotrage
            authService.startAuthCheck(data.data);
            
            //redirect to the player Dash
            $location.path('/games');
            
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
}]);
angular.module("main").controller("DashCtrl", ["$scope","$location","apiService",function($scope,$location,apiService){
    
    //get the games
    apiService.get("/api/v1/getgames",null,true).then(function(data){
        $scope.yourGames = data.data;
    },function(error){
        console.log(error);
    });
    
    apiService.get("/api/v1/getallgames",null,true).then(function(data){
        $scope.allGames = data.data;
        console.log(data.data);
    },function(error){
        console.log(error);
    });
    
    $scope.createGame = function(){
        apiService.post("/api/v1/getallgames",null,true).then(function(data){
            $scope.allGames = data.data;
        },function(error){
            console.log(error);
        });
    }
    
    
    
}]);
//# sourceMappingURL=app.js.map