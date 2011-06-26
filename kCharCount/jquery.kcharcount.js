/**
 * kUtilities jQuery Plugin - kCharCount
 * --------------------------------------------------------------------------
 *
 * Limit character count in textarea.
 * 
 * 
 * @version     0.1
 * @since       29 Apr 2011
 * @author      _ken
 * 
 */

(function($){
	
	$.fn.kCharCount = function(options){  
		
		var o = {
			limit : 255,			// Character limit
			currCount : 0,			// Current character count
			reverseCount : false,	// if true, character will reverse count, i.e 255, 254, 253...
			countWrapper : '<span>'	// The wrapper tag for the charcter count
		};

		return this.each(function(){  
			if (options) { 
				$.extend( o, options );
			}
			      
			var $this = $(this),
				$countSpan = $(o.countWrapper);
			
			// Check if is textarea
			if (! ($this.is('textarea'))) return;
			
			_checkCount($this);
			
			$countSpan
				.text(((o.reverseCount) ? o.limit - o.currCount : o.currCount))		
				.insertAfter($this);
				
			// Set maxlength
			$this.attr('maxlength', o.limit);
			
			// Bind keyup event to target textarea
			$this.keyup(function(){
				_checkCount($this);

				$countSpan.text(((o.reverseCount) ? o.limit - o.currCount : o.currCount));
			});
		});
		
		function _checkCount(t){
			o.currCount = t.val().length;
			
			if (o.currCount > o.limit)
			{
				o.currCount = o.limit;
				t.val(t.val().substr(0, o.limit));
			}			
		}			
	};
})( jQuery );