/**
 * kUtilities jQuery Plugin - kPoll
 * --------------------------------------------------------------------------
 *
 * Plugin for Poll Module
 * 
 * 
 * @version     0.1
 * @since       20 Nov 2011
 * @author      _ken
 * 
 */
;
(function ($) {

    $.fn.kPoll = function (method) {
        var defaults = {
            width: '100%',
            barWidth: 130,
            barHeight: 10,    
            barSpeed: 1200,
            buttonText: 'Submit',
            callback: function() {}
        };

        // Default + User options variable
        var plugin = this;
        plugin.o = {};
        
        var url;
        var pollId;
        
        var methods = {
            init: function (options) {
                plugin.o = $.extend({}, defaults, options);

                return plugin.each(function () {
                    var $element = $(this),
                        element = this;
                    
                    url = $element.data('url');
                    
                    $.ajax({
                        url: url,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data) {                          
                            pollId = data.Result.PollId;

                            var pollQuestion = '<p class="kPollQuestion" id="kPoll-' + pollId + '">' + data.Result.Name + '</p>';                            

                            // Setup Question
                            
                            $element.append(pollQuestion).css({'width': plugin.o.width});  
                            var el_w = $element.width();                            

                            if (_getCookie('kPoll-' + pollId))
                                _showResult($element, data, -1);
                            else
                                _setupPoll($element, data);  

                            plugin.o.callback();
                        }
                    });
                });
            },

            public_function: function () {
                return 0;
            }
        };

        // Private functions
        var _showResult = function ($element, data, vote) {
            var $resultWrapper = $('<div class="kPollResultWrapper">'); 
            var graph = '<ul style="overflow:hidden;">';
            
            // Setup Options
            for (var x = 0; x < data.Result.Options.length; x++) {                
                graph += '<li style="overflow:hidden">\
                            <div class="kPollOptions">' + data.Result.Options[x] + '</div>';
                
                if (vote == x) {                
                    graph += '<div class="bar" rel="' + (parseInt(data.Result.OptionsValue[x]) + 1) + '"></div>\
                                <span class="kPollCount">' + (parseInt(data.Result.OptionsValue[x]) + 1) + '</span>';
                } else {
                    graph += '<div class="bar" rel="' + data.Result.OptionsValue[x] + '"></div>\
                                <span class="kPollCount">' + data.Result.OptionsValue[x] + '</span>';
                }
                
                graph += '</li>';
            }            
            graph += '</ul>';
            
            // Show'em
            $resultWrapper
                .append(graph)
                .appendTo($element);   
                
            $element.find('.kPollQuestionWrapper').hide();
            $element.find('.kPollResultWrapper').show('fast', _runAnime($element));
        }
        
        var _setupPoll = function ($element, data) {
            var $questionWrapper = $('<div class="kPollQuestionWrapper">');           
            var $pollList = $('<ul></ul>');
            var pollOptions = '';
            var pollButton;
            
            // Setup Options
            for (var x = 0; x < data.Result.Options.length; x++) {
                pollOptions += '<li>\
                                    <input id="kPoll-' + pollId + '-' + (x+1) + '" name="kPoll-' + pollId + '" type="radio" value="' + (x) + '" />\
                                    <label style="cursor:pointer" for="kPoll-' + pollId + '-' + (x+1) + '">' + data.Result.Options[x] + '</label>\
                                </li>';
            }
            
            // Options Handler
            $element.delegate('input', 'click', function (e) {                
                var select = $(this).val();
                
                url = url + '&PollVote=' + select;
                
                $element.find('.kPollBtn').attr('rel', select);
                $element.find('.kPollBtn').attr('href', url);                
            });            
            
            $pollList.append(pollOptions).appendTo($questionWrapper);
  
            // Setup Button

            pollButton = '<a href="' + url + '" class="button grey kPollBtn" rel="-1">' + plugin.o.buttonText + '</a>';
            
            // Button Handler
            $element.delegate('.kPollBtn', 'click', function (e) {
                e.preventDefault();
                
                if ($(this).attr('rel') == -1)
                    alert('Please select an option.');
                else 
                    _saveVote($element, data);
                
                return false;
            });
            
            // Show'em
            $questionWrapper
                .append(pollButton)
                .appendTo($element);              
        }
            
        var _saveVote = function ($element, data) {alert(url);
            $.ajax({
                url: url,
                contentType: "application/json; charset=utf-8",
                success: function () {
                    _setCookie($element.find('.kPollQuestion').attr('id'));
                
                    _showResult($element, data, $element.find('.kPollBtn').attr('rel'));
                },
                error: function() {
                    alert('Connection error. Please try again.');
                }
            });
        }
        
        var _runAnime = function ($el) {
            $el.find('.bar')
                .height(plugin.o.barHeight)
                .width(1)
                .css({'float':'left', 'background-color':'orange'});
            
            // Get the maximum count
            var max = 0;
            $el.find('.bar').each(function () {
                if (parseInt($(this).attr('rel')) > max)
                    max = parseInt($(this).attr('rel'));                
            });
            
            $el.find('.bar').each(function () {
                var my_w = parseInt($(this).attr('rel'))
            
                $(this).animate({'width':my_w * plugin.o.barWidth / max}, plugin.o.barSpeed);
            });
        }
        
        var _setCookie = function (id) {
            var exdate = new Date();
            
            // Set to 7 days
            exdate.setDate(exdate.getDate() + 7);

            document.cookie = '' + escape(id) + '=true; expires=' + exdate.toUTCString();    
        }

        var _getCookie = function (c_name) {
            var x, y, ARRcookies = document.cookie.split(";");

            for (var i = 0; i < ARRcookies.length; i++)
            {
                
                x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
                y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
                x = x.replace(/^\s+|\s+$/g,"");
                
                if (x == c_name)
                {
                    return unescape(y);
                }
            }
        }        
        
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist.');
        }
    }

})(jQuery);