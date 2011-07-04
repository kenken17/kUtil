/**
 * kUtilities jQuery Plugin - kCharLimit 
 * --------------------------------------------------------------------------
 *
 * Plugin: Limit a paragraph charracters
 * 
 * 
 * @version     0.1
 * @since       4 July 2011
 * @author      _ken
 * 
 */

;(function($) {
	
	$.fn.kCharLimit = function(method) { 
        var defaults = {
			limit: 75,
			suffix: '&hellip;',
			alert: true
        };

		// Default + User options variable
        var plugin = this;
			plugin.o = {};

		var methods = {
			init: function(options) {
	            plugin.o = $.extend({}, defaults, options);

				return plugin.each(function() {
					var $element = $(this),
						element = this;
					
						// Check if is P tag
						if (! ($element.is('p')) && !alert)
						{	
							alert('It is recommended you use this plugin in a <p> tag. You can turn this alert off by setting option <<alert: false>>');
							return;
						}
						
						// Find the charatcer limit
						var limit_str = $element.text().substr(0, plugin.o.limit);
						var space_pos = limit_str.lastIndexOf(' ');
						var final_str = limit_str.substr(0, space_pos);
						
						// If the last postion is a period. Add a space to it
						if (final_str[space_pos - 1] == '.')
							final_str += ' ';
						
						// Print out the truncated paragraph
						$element.html(final_str + plugin.o.suffix);
				});
			}
		};

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