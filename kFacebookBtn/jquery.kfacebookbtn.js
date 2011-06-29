/**
 * kUtilities jQuery Plugin - kFacebookBtn 
 * --------------------------------------------------------------------------
 *
 * Plugin: Turn an <A> tag into Facebook like button
 * 
 * 
 * @version     0.1
 * @since       29 Jun 2011
 * @author      _ken
 * 
 */

;(function($) {
	
	$.fn.kFacebookBtn = function(method) { 
        var defaults = {
			fbLike: 'http://www.facebook.com/plugins/like.php',
			layout: 'standard',		// the layout of the button, 'standard', 'button_count', 'box_count'
			width: 450,				// The width of the button
			height: 90,				// The height of the button
			showFaces: true,		// Show profile picture below the button, default 'true'
			verb: 'like',			// Verb to use in button, 'like' or 'recommend'
			colorScheme: 'light',	// Color scheme, 'light', 'dark'
			font: ''				// Font to use, 'arial', 'lucida+grande', 'segoe+ui', 'tahoma', 'trebuchet+ms', 'verdana', default EMPTY
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
						
					// Check if is A tag
					if (! ($element.is('a'))) return;
					
					var src, url, layout, width, height, showFaces, verb, colorScheme, font;
					
					url = $element.attr('href');
					layout = plugin.o.layout;
					width = plugin.o.width;
					height = plugin.o.height;
					showFaces = plugin.o.showFaces;
					colorScheme = plugin.o.colorScheme;
					font = plugin.o.font;
					verb = $element.text().toLowerCase();

					if (verb != 'like' && verb != 'recommend')
						verb = plugin.o.verb;
					
					// Create iframe element
					var $iframe = $('<iframe scrolling="no" frameborder="0" allowTransparency="true">');
			
					// Combine the parts of src
					src = plugin.o.fbLike + '?href=' + url + 
											'&send=false&amp;layout=' + layout + 
											'&width=' + width + 
											'&show_faces=' + showFaces + 
											'&action=' + verb + 
											'&colorscheme=' + colorScheme + 
											'&font=' + font + 
											'&height=' + height;					
					
					$iframe
						.attr('src', src)				// Attach attribute to the iframe element
						.css({	'border': 'none',			// Set style
								'overflow': 'hidden',
								'width': width,
								'height': height})
						.insertAfter($element);				// Append to the element

					$element.hide();	// Hide the element
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