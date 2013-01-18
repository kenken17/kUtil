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
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
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
                return plugin.each(function () {
                    var $element = $(this),
                        element = this,
                        opts = $.extend({}, defaults, options),
                        data = $element.data('kTemplate');

                    if (!data) {
                        $element.data('kTemplate', true);
                    }
                });
            },

            public_function: function (options) {
                return plugin.each(function () {
                    var $element = $(this),
                        element = this,
                        opts = $.extend({}, defaults, options),
                        data = $element.data('kTemplate');

                    if (data) {

                    }
                });
            }
        };

        // Private functions
        var _privateFunction = function (t, _c) {
            // Code here
        };

        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist.');
        }
    };
}));