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

;(function($){
	
	$.kTemplate = function(element, options){
        var defaults = {
            foo: 'bar',
            onFoo: function() {}
        }

        this.settings = {};

        var $element = $(element),
             element = element;

        this.init = function() {
            this.settings = $.extend({}, defaults, options);
            // code goes here
        }

        this.foo_public_method = function() {
            // code goes here
        }

        var foo_private_method = function() {
            // code goes here
        }

        this.init();
    }
	
	$.fn.kTemplate = function(options){  

		return this.each(function(){        
			if (undefined == $(this).data('kTemplate')) {
                var plugin = new $.kTemplate(this, options);
                $(this).data('kTemplate', plugin);
            }			
		});
	};
	
})( jQuery );