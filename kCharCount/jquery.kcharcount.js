/**
 * kUtilities jQuery Plugin - kCharCount 
 * --------------------------------------------------------------------------
 *
 * Plugin: Character count for textboxes. 
 * 
 * 
 * @version     1.0
 * @since       28 Apr 2011
 * @author      _ken
 * 
 */

;(function($){

	$.fn.kCharCount = function(method) { 
        var defaults = {
			limit : 255,				// Character limit
			reverseCount : false,		// if true, character will reverse count, i.e 255, 254, 253...
			countWrapper : '<span>',	// The wrapper tag for the character count
			countClass: 'kCount',		// The wrapper class 
            countSuffix: ''                  // Suffix text for count
        };

		// Default + User options variable
        var plugin = this;
			plugin.o = {};

		var methods = {
			init : function(options) {
	            plugin.o = $.extend({}, defaults, options);
	
				return plugin.each(function() {
					var $element = $(this),
						element = this;
					
					var _count = 0;
					
					// Create wrapper element, and set the class name
					var $countWrapper = $(plugin.o.countWrapper).addClass(plugin.o.countClass);

					// Check if is textarea or input textbox
					if ((! ($element.is('textarea'))) && (! ($element.is('input[type="text"]'))) )return;                   
                    
					_count = _checkCount($element);

					$countWrapper
						.text(((plugin.o.reverseCount) ? plugin.o.limit - _count : _count) + plugin.o.countSuffix)		
						.insertAfter($element);

					// Set maxlength
					$element.attr('maxlength', plugin.o.limit);

					// Bind keyup event to target textarea
					$element.keyup(function(){
						_count = _checkCount($element, _count);

						$countWrapper.text(((plugin.o.reverseCount) ? plugin.o.limit - _count : _count) + plugin.o.countSuffix);
					});
				});
			}
		};

		// Private function to check the current count
        var _checkCount = function(t) {
			_c = t.val().length;

			if (_c > plugin.o.limit)
			{
				_c = plugin.o.limit;
				t.val(t.val().substr(0, plugin.o.limit));
			}
			
			return _c;			
        }

		// Method calling logic
		if ( methods[method] )
		{
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
		}
		else if (typeof method === 'object' || ! method) {
			return methods.init.apply( this, arguments );
		}
		else
		{
			$.error('Method ' +  method + ' does not exist.');
		}
    }
	
})( jQuery );