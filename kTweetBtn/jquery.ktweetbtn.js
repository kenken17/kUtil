/**
 * kUtilities jQuery Plugin - kTweetBtn 
 * --------------------------------------------------------------------------
 *
 * Plugin: Turn an <A> tag into tweet button
 * 
 * 
 * @version     0.1
 * @since       28 Jun 2011
 * @author      _ken
 * 
 */

;(function($) {
	
	$.fn.kTweetBtn = function(method) { 
        var defaults = {
			count : 'none',		// Tweet button count type, 'none', 'vertical', 'horizontal'
			lang : 'en'			// Language, en, fr, de, it, jam ko, pt, ru, es, tr
        };

		// Default + User options variable
        var plugin = this;
			plugin.o = {};

		var l = plugin.length;
		var c = 0;
		
		var methods = {
			init : function(options) {
	            plugin.o = $.extend({}, defaults, options);

				return plugin.each(function() {
					var $element = $(this),
						element = this;
				
					// Check if is A tag
					if (! ($element.is('a'))) return;
					
					var text, url, count, lang;
					
					text = $element.text();
					url = $element.attr('href');
					count = $element.data('count');
					lang = $element.data('lang');
					
					if (count == undefined || count == '') 
						count = plugin.o.count;
						
					if (lang == undefined || lang == '')
						lang = plugin.o.lang;
					
					// Set the attribute/class/text for the A tag
					$element
						.text('Tweet')
						.attr({	'data-text': text, 
								'data-url': url,
								'data-count': count,
								'data-lang': lang })
						.addClass('twitter-share-button');
					
					// check i=if this is the last element
					c++;
					if (c == l)
						// Append the twitter widget at the last
						$('<script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>').appendTo('body');
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