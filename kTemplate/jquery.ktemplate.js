/**
 * kUtilities jQuery Plugin - kTemplate 
 * --------------------------------------------------------------------------
 *
 * Plugin Description
 * 
 * 
 * @version     0.1
 * @since       28 Apr 2011
 * @author      _ken
 * 
 */
;
(function ($) {

    $.fn.kTemplate = function (method) {
        var defaults = {
            foo: 255,
            bar: false
        };

        // Default + User options variable
        var plugin = this;
        plugin.o = {};

        var methods = {
            init: function (options) {
                plugin.o = $.extend({}, defaults, options);

                return plugin.each(function () {
                    var $element = $(this),
                        element = this;

                    // Code here
                });
            },

            public_function: function () {
                return 0;
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