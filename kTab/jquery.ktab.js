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

;(function($) {
	
	$.fn.kTab = function(method) { 
        var defaults = {
			active: 0,	// When created, open the 0 (first) tab. Zero-based
			activeClass: 'active',	// The class name of the current active element
			tabClass: 'tabs',	// The class for each tab, this might be useful for css styling for all tabs
			width: 400,			// Width of the tab content area
			height: 200,		// Height of the tab content area
			overflow: 'auto'	// Set the mode if content overflow, 'auto' or 'hidden'
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

					var $tab_content = $('<div id="' + element.id + '-content">').css({position:'relative', overflow:plugin.o.overflow});

					if ($tab_content.width() == 0)
						$tab_content.width(plugin.o.width);
						
					if ($tab_content.height() == 0)
						$tab_content.height(plugin.o.height);
							
					$element.find('li a').each(function(i){
						var href = $(this)
									.bind('click', {$tabs: $tab_content, $el: $element}, _clickHandler)
									.attr('href');
						
						$(href)
							.addClass(plugin.o.tabClass)
							.css({position:'absolute', top:0, left:0})
							.detach()
							.hide()
							.appendTo($tab_content);						
					});
					
					$element.after($tab_content);
					
					// Show the active tab and show the respective content
					var tab_id = $element
									.find('li:eq(' + plugin.o.active + ')')
									.addClass(plugin.o.activeClass)
									.find('a')
									.attr('href');
								
					$(tab_id).show();		
					
				});
			}
		};

		// Handler for header being clicked		
        var _clickHandler = function(e) {

			var $tab = $(this);
			var tab_id = $tab.attr('href');

			e.data.$el
				.find('li')
				.removeClass(plugin.o.activeClass);		// Remove all 'active' class

			e.data.$tabs
				.children()
				.not(tab_id)
				.fadeOut();					// find all tab content (except the current one) and fadeOut

			$(tab_id).fadeIn()			// FadeIn the current tab content
				
			$tab	
				.parent()
				.addClass(plugin.o.activeClass);		// find its parent (li) and set active class
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