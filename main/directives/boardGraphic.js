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