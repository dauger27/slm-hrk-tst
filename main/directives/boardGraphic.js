  angular.module("main").directive("board",['$d3','$route', function($d3,$route){
    return{
        restrict:"E",
        scope:"=",
        link: function(scope,element,attrs){

            var size = attrs.size || $(element).parent().innerWidth();
            var internalSize = 130;
            var cellWidth = internalSize / 13;
            var cellHeight = cellWidth * 2;

            //get methods
            var d3 = $d3;
            var route = $route;
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
                                .attr("width", "100%")
                                .attr("height", "100%")
                                .attr("viewBox", "0 0 130 130")
                                .append("g")
                                .attr("transform","translate("+internalSize+","+internalSize+") rotate(180)")
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
                            d.rotation = 135; //add icon rotation
                            return cellWidth * 2;
                        }
                        else{
                            d.width = cellWidth;
                            d.rotation = 180; //add icon rotation
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
                            x = internalSize;
                            y = 0;
                        }
                        else if(i===2){
                            x = internalSize;
                            y = internalSize;
                        }
                        else if(i===3){
                            x = 0;
                            y = internalSize;
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
                            group.append("text")
                                .classed("icon",true)
                                .attr("x",d.width * .5)
                                .attr("y",cellHeight * .6)
                                .attr("text-anchor","middle")
                                .attr("font-size",cellWidth / 2)
                                .attr("transform","rotate("+ d.rotation +","+ d.width * .5 +","+ cellHeight * .5 +")")
                                .text(d.icon)
                                ;
                        }

                        if(d.houseArray && !d.hotel){
                            group.selectAll(".board-house")
                                .data(d.houseArray)
                                .enter()
                                .append("rect")
                                .classed("board-house",true)
                                .attr("height",cellWidth / 8)
                                .attr("width",cellWidth / 8)
                                .attr("y", (cellHeight * .875) - (cellWidth / 16))
                                .attr("x", function(d,j){return  (cellWidth / 6) * j + (cellWidth / 8);})
                                ;
                        }

                        if(d.hotel){
                            group.append("rect")
                                .classed("hotel",true)
                                .attr("height",cellWidth / 4)
                                .attr("width",cellWidth / 2)
                                .attr("y", (cellHeight * .875) - (cellWidth / 8))
                                .attr("x", cellWidth / 4)
                                ;
                        }

                        return group.node();
                    }
                }

            }, true);
        }
    }
 }]);
