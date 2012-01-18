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
            row: 10,
            col: 20,
            cell: 50,
            showGrid: true,
            stroke: 3
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


                            
                    var canvas = document.getElementById('kCanvasMap_0');
                    
                    // Check if support <canvas>
                    if (canvas.getContext) {                      
                        var ctx = canvas.getContext('2d');
 
                    } else {
                        var $canvas_img = $('<img alt="Image fallback" src="' + $element.data('src') + '" />');
                            $canvas_img.appendTo($canvas);
                    }
                });
            }
        };

        // Private functions
        var _privateFunction = function (t, _c) {
                // Code here
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