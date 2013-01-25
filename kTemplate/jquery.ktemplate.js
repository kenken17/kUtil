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
        plugin.o = {};		// this o is for all plugin(s) share state

        var methods = {
            init: function (options) {
                return plugin.each(function () {
                    var $element = $(this),
                        element = this,
                        opts = $.extend({}, defaults, options),
                        data = $element.data('kTemplate');

                    if (!data) {
						// setup for plugin wise data
						data = {
							foo: 0,
							bar: true
						};

                        $element.data('kTemplate', data);
                    }
                });
            },

            public_function: function (options) {
                return plugin.each(function () {
                    var $element = $(this),
                        opts = $.extend({}, defaults, options),
                        data = $element.data('kTemplate');

                    if (data) {
						data.foo = opts.foo;

						_privateFunction(data);
                    }
                });
            }
        };

        // Private functions
        var _privateFunction = function (data) {
            // Code here

			// Use data.foo
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