/**
 * kUtilities jQuery Plugin - kTemplate 
 * --------------------------------------------------------------------------
 *
 * Plugin Description
 * 
 * 
 * @version     0.1
 * @since       18 Jan 2012
 * @author      _ken
 * 
 */;
(function ($) {

	$.fn.kCanvasMap = function (method) {
        var defaults = {
            col: 20,
            row: 10,
            cell: 50,
            showGrid: true,
            lineWidth: 8,
            lineJoin: 'round',
            lineCap: 'butt',
            lines: null,
            curve: 0.5,
            debug: false
        };

        // Default + User options variable
        var o;
        var plugin = this;
        plugin.o = {};

        var methods = {
            init: function (options) {
                o = plugin.o = $.extend({}, defaults, options);

                return plugin.each(function (index) {
                    var $element = $(this),
                        element = this;
                                        
                    // Ready the canvas
                    var canvas_id = 'kCanvasMap_' + index;
                    var canvas_w = o.col * o.cell;
                    var canvas_h = o.row * o.cell;
                    
                    var $canvas = $('<canvas id="' + canvas_id + '" width="' + canvas_w + '" height="' + canvas_h + '"></canvas>');
                        $canvas.appendTo($element);
                        
                    var canvas = document.getElementById(canvas_id);
                    
                    // Check if support <canvas> and json must be supplied
                    if (canvas.getContext && o.lines != null) {
                        var ctx = canvas.getContext('2d');
                
                        //ctx.scale(0.5, 0.5);
                        
                        // Show the grid
                        if (o.showGrid) _showGrid(o.col, o.row, o.cell, ctx);

                        // Plot all lines
                        var $lines = $(o.lines);
                        $($lines.attr('line')).each(function() {
                            //ctx.save();
                            
                            ctx.lineWidth = o.lineWidth;
                            ctx.lineJoin = o.lineJoin;
                            ctx.lineCap = o.lineCap;
                            ctx.beginPath();
                            _plotLine(this, ctx, o.cell);
                            ctx.stroke();
                            
                            //ctx.restore();
                        });

                    } else {
                        var $canvas_img = $('<img alt="Image fallback" src="' + $element.data('src') + '" />');
                            $canvas_img.appendTo($canvas);
                    }
                });
            }
        };

        // Get the lines
        var _plotLine = function(line, ctx, cellSize) {
            var stops = line.stops;
            var stops_count = stops.length;
            
            for (var x = 0; x < stops_count; x++) {
                var currPoint = stops[x];
                var prevPoint = stops[x-1];
                
                var moveToX = currPoint.x * cellSize;
                var moveToY = currPoint.y * cellSize;
                
                var moveFromX, moveFromY, cp1X, cp1Y, cp2X, cp2Y, curveDegreeX, curveDegreeY;

                if (prevPoint != undefined) {
                    var moveFromX = prevPoint.x * cellSize;
                    var moveFromY = prevPoint.y * cellSize;
                }                
                
                if (o.debug)
                    console.log('point (' + x + '): ' + currPoint.x + ',' + currPoint.y);
                    
                if (x == 0) 
                    ctx.moveTo(moveToX, moveToY);
                else {
                    // if in same horizonal or vetical, use line
                    if (prevPoint.x == currPoint.x || prevPoint.y == currPoint.y) {
                        ctx.lineTo(moveToX, moveToY);
                    }
                    else {
                        // get the difference between the dots
                        var diff = _checkPointsPos(currPoint, prevPoint);
                        
                        curveDegreeX = cellSize * Math.abs(diff.x) * o.curve;
                        curveDegreeY = cellSize * Math.abs(diff.y) * o.curve;

                        // check if the distance between dots are more than 1 grid away, if more, 'S' curve else, 'C' curve
                        if (Math.abs(diff.x) == 1 && Math.abs(diff.y) == 1) {
                            // check if need to curve or use straight line
                            if (prevPoint.turn == undefined) {
                                cp1X = moveToX;
                                cp1Y = moveToY;
                                cp2X = moveToX;
                                cp2Y = moveToY;                            
                            } else {
                                // moving to 'top' or 'left'
                                if (diff.x > 0 && diff.y > 0) {
                                    // Default to 'up'
                                    cp1X = moveFromX;
                                    cp1Y = moveFromY - curveDegreeY;
                                    cp2X = moveToX + curveDegreeX;
                                    cp2Y = moveToY;

                                    if (prevPoint.turn == 'left') {
                                        cp1X = moveFromX - curveDegreeX;
                                        cp1Y = moveFromY;
                                        cp2X = moveToX;
                                        cp2Y = moveToY + curveDegreeY;
                                    }
                                }

                                // moving to 'bottom' or 'left'
                                if (diff.x > 0 && diff.y < 0) {
                                    // Default to 'down'
                                    cp1X = moveFromX;
                                    cp1Y = moveFromY + curveDegreeY;
                                    cp2X = moveToX + curveDegreeX;
                                    cp2Y = moveToY;
                                        
                                    if (prevPoint.turn == 'left') {
                                        cp1X = moveFromX - curveDegreeX;
                                        cp1Y = moveFromY;
                                        cp2X = moveToX;
                                        cp2Y = moveToY - curveDegreeY;
                                    }
                                } 
                                
                                // moving to 'top' or 'right'
                                if (diff.x < 0 && diff.y > 0) {
                                    // Default to 'up'
                                    cp1X = moveFromX;
                                    cp1Y = moveFromY - curveDegreeY;
                                    cp2X = moveToX - curveDegreeX;
                                    cp2Y = moveToY;
                                        
                                    if (prevPoint.turn == 'right') {
                                        cp1X = moveFromX + curveDegreeX;
                                        cp1Y = moveFromY;
                                        cp2X = moveToX;
                                        cp2Y = moveToY + curveDegreeY;
                                    }
                                } 
                                
                                // moving to 'bottom' or 'right'
                                if (diff.x < 0 && diff.y < 0) {
                                    // Default to 'down'
                                    cp1X = moveFromX;
                                    cp1Y = moveFromY + curveDegreeY;
                                    cp2X = moveToX - curveDegreeX;
                                    cp2Y = moveToY;
                                        
                                    if (prevPoint.turn == 'right') {
                                        cp1X = moveFromX + curveDegreeX;
                                        cp1Y = moveFromY;
                                        cp2X = moveToX;
                                        cp2Y = moveToY - curveDegreeY;
                                    }
                                }  
                                
                            }                                                      
                        } else {
                            // check if need to curve or use straight line
                            if (prevPoint.turn == undefined) {
                                cp1X = moveToX;
                                cp1Y = moveToY;
                                cp2X = moveToX;
                                cp2Y = moveToY;                            
                            } else {
                                // moving to 'top' or 'left'
                                if (diff.x > 0 && diff.y > 0) {
                                    // Default to 'up'
                                    cp1X = moveFromX;
                                    cp1Y = moveFromY - curveDegreeY;
                                    cp2X = moveToX;
                                    cp2Y = moveToY + curveDegreeY;
                                                                        
                                    if (prevPoint.turn == 'left') {
                                        cp1X = moveFromX - curveDegreeX;
                                        cp1Y = moveFromY;
                                        cp2X = moveToX + curveDegreeX;
                                        cp2Y = moveToY;
                                    }                                
                                }
                                
                                // moving to 'bottom' or 'left'
                                if (diff.x > 0 && diff.y < 0) {
                                    // Default to 'down'
                                    cp1X = moveFromX;
                                    cp1Y = moveFromY + curveDegreeY;
                                    cp2X = moveToX;
                                    cp2Y = moveToY - curveDegreeY;
                                        
                                    if (prevPoint.turn == 'left') {
                                        cp1X = moveFromX - curveDegreeX;
                                        cp1Y = moveFromY;
                                        cp2X = moveToX + curveDegreeX;
                                        cp2Y = moveToY;
                                    }
                                }   

                                // moving to 'top' or 'right'
                                if (diff.x < 0 && diff.y > 0) {
                                    // Default to 'up'
                                    cp1X = moveFromX;
                                    cp1Y = moveFromY - curveDegreeY;
                                    cp2X = moveToX;
                                    cp2Y = moveToY + curveDegreeY;
                                        
                                    if (prevPoint.turn == 'right') {
                                        cp1X = moveFromX + curveDegreeX;
                                        cp1Y = moveFromY;
                                        cp2X = moveToX - curveDegreeX;
                                        cp2Y = moveToY;                                    
                                    }
                                }

                                // moving to 'bottom' or 'right'
                                if (diff.x < 0 && diff.y < 0) {
                                    // Default to 'down'
                                    cp1X = moveFromX;
                                    cp1Y = moveFromY + curveDegreeY;
                                    cp2X = moveToX;
                                    cp2Y = moveToY - curveDegreeY;
                                        
                                    if (prevPoint.turn == 'right') {
                                        cp1X = moveFromX + curveDegreeX;
                                        cp1Y = moveFromY;
                                        cp2X = moveToX - curveDegreeX;
                                        cp2Y = moveToY;                                    
                                    }
                                } 
                            }
                        }
                        
                        //console.log(cp1X + '-' + cp1Y + '-' + cp2X + '-' + cp2Y);
                        ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, moveToX, moveToY);
                    }
                }            
            }
        }
        
        // Check differences between two dots
        var _checkPointsPos = function(curr, prev) {
            return {'x': prev.x - curr.x, 'y': prev.y - curr.y};
        }
        
        // Show the grid
        var _showGrid = function(col, row, cell, ctx) {
            ctx.save();
            var h_end = col * cell;
            var v_end = row * cell;
            
            var offset = 0.5;       // offset to draw 1px
            
            ctx.font = "7px sans-serif";
            ctx.fillStyle = "#ccc";

            // Horizontal grid
            for (var x = 0; x < row; x++) {
                var pos = x * cell;
                
                ctx.beginPath();
                ctx.moveTo(0 - offset, pos - offset);  
                ctx.lineTo(h_end - offset, pos - offset);
                ctx.strokeStyle = "rgba(230,230,230,0.9)";
                ctx.stroke();
                
                // grid label
                ctx.fillText(x, 0, pos - 2);
            }
            
            // Vertical grid
            for (var x = 0; x < col; x++) {
                var pos = x * cell;
                
                ctx.beginPath();
                ctx.moveTo(pos - offset, 0 - offset);  
                ctx.lineTo(pos - offset, v_end - offset);
                ctx.strokeStyle = "rgba(230,230,230,0.9)";
                ctx.stroke();
                
                // grid label
                ctx.fillText(x, pos, 10);
            }
            
            ctx.restore();
        }

            // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist.');
        }
    }

})(jQuery);