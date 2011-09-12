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
	
	$.fn.kSlider = function(method) { 
        var defaults = {
			width: 500,
			height: 300,
			nav: '#kNav'
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
						
					var $nav = $(plugin.o.nav);
					
					var slide_width = 0;
					var $slide_wrapper = $('<div class="kSlideWrapper" />').css({'position': 'relative', margin: 0});

					var div_width = new Array();	//individual divs width
					
					// Stiching for divs into one slide
					$element
						.css({'width': plugin.o.width, 'height': plugin.o.height, margin: 0})
						.children()
						.addClass('kSliderDiv')
						.css({'float': 'left'})
						.wrapAll($slide_wrapper)
						.each(function(){
							slide_width += $(this).width();			
							div_width.push($(this).width());
						});
					
					$element.find('.kSlideWrapper').width(slide_width);
					
					var ratio = slide_width / $element.width();
					
					// Stiching for nav items
					$nav
						.css({'width': plugin.o.width})
						.children()						
						.each(function(i){
							$li_item = $(this);
							
							// Calculate nav item ratio width in percentage
							var percent = div_width[i] / slide_width * 100;

							$li_item.css({'text-align': 'center', 'float': 'left', 'width': percent + '%'});
							
							$li_item.click(function(e){
								e.preventDefault();
								var $this_li_pos = $(this).position();
								var $handle = $nav.find('.kHandle');
								
								// check if overshoot to the last
								var left = $this_li_pos.left;
								
								if ($this_li_pos.left + $handle.width() > $nav.width())
									left = $nav.width() - $handle.width();
								
								$handle.animate(
										{'left': left},
										{duration:600, easing: 'easeInOutQuint'});
								
								_handleDrag(left, $element, ratio);
							});
						});
					
					$handle = $('<li class="kHandle">&nbsp;</li>');
					$handle.css({
						'position': 'absolute',
						'height': 10,
						'top': 5,
						'left': 0,
						'cursor': 'pointer',
						'background-color': 'green',
						'width': ($element.width() / slide_width * 100) + '%'
					})
					.draggable({
						axis: 'x',
						zIndex: 999,
						containment: 'parent',
						drag: function(event, ui) {
							_handleDrag(ui.position.left, $element, ratio);
						}
					});

					$nav.append($handle);					
				});
			}
		};

		// Private functions
        var _handleDrag = function(left, $element, ratio) {
			$element
				.find('.kSlideWrapper')
				.stop(true, true)
				.animate(
					{'margin-left': -1 * (left * ratio)},
					{duration:600, easing: 'easeInOutQuint'});
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