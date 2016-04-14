angular.module("main").directive("menuBar",['$route', function($route){
  return {
    restrict:"E",
    scope:"=", //Consider inheriting from parent
    templateUrl:'/main/directives/menuBar.html',
    link: function(scope, element, attrs) {
      console.log($route.routes);
      scope.menuItems = [];
      angular.forEach($route.routes, function(value, key){
        console.log(key, value);
        scope.menuItems.push(value);
      });
    }
  }
}]);
/*
TODO: Check to see if player has games and add link to any games he has,
this will entail creating a controller for the directive which makes
an authentication call to see if there is a player and if they any games.
If they have games, these games to a dropdown
*/
