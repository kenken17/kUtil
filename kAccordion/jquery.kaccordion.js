/**
 * kUtilities jQuery Plugin - kAccordion 
 * --------------------------------------------------------------------------
 *
 * Plugin: Simple accordion plugin
 * 
 * 
 * @version     1.0
 * @since       27 Jun 2011
 * @author      _ken
 * 
 */

;(function($) {
	
	$.fn.kAccordion = function(method) { 
        var defaults = {
			header: ' > :first-child',	// Set the header tag for each section
			solo : true,	// Activate solo mode, which only open one section at every one time
			active: 0,		// When created, open the 0 (first) tab. Zero-based
			activeClass: 'active'	// The class name of the current active element
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
					
					// Check if is UL
					if (! ($element.is('ul'))) return;

					$element
						.find('li')
						.each(function(index, el){
							$li = $(this);
							$header = $li.find(plugin.o.header);

							var $content = $header.siblings().wrapAll('<div class="accordion-content" />').parent();
							
							$content.hide();
							
							// Check for initial open section
							if (plugin.o.active == index)
							{
								$li
									.addClass(plugin.o.activeClass)
									.find('.accordion-content')
									.show();		// Set the open section as 'active'	
							}		
							
							// Bind the handler to header being clicked
							$header
								.css({'cursor': 'pointer'})
								.bind('click', {$el: $element}, _clickHandler);
						});
				});
			}
		};

		// Handler for header being clicked		
        var _clickHandler = function(e) {
			$header = $(this);
			
			if (plugin.o.solo)
			{
				e.data.$el
					.find('li ' + plugin.o.header)
					.not(this)
					.siblings()
					.slideUp()					// find all header (except the current one) and close them
					.parent()
					.removeClass(plugin.o.activeClass);		// then find its parent (li) and remove 'active' class
			}

			$header
				.siblings()
				.slideToggle()				// find the clicked section and open/close it
				.parent()
				.toggleClass(plugin.o.activeClass);		// find its parent (li) and set/remove class
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