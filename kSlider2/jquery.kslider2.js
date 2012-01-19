;(function ($) {
    $.fn.kSlider2 = function (method) {
        var defaults = {
            width: 1024,
            height: 390,
            source: null,
            pageSize: 10,       // Amount of feed in one request
            pageIndex: 0,
            navId: null,
            navWidth: 'parent',
            slideWidth: 480,
            boxCol: 2,
            boxRow: 3,
            boxVideoCol: 2,
            boxVideoRow: 2,
            border: 1,
            borderColor: '#fff'
        };

        // Default + User options variable
        var plugin = this;
        plugin.o = {};

        var $element, element, $slide_wrapper, $slide_panel, $nav, $scrub, boxWidth, boxHeight, $individualBoxWrapper;
        var currentPageIndex = 0;
        var totalItems = 0;
        var currentTotal = 0;
        var checkEnd = true;
        var hasMore = true;
        var totalWidth = 0;   
        var ratio = 1;
        var nav_width;
        var currentBoxCount = 0;
        var videoArray = new Array();
        var boxColor = true;
        
        var methods = {
            init: function (options) {
                plugin.o = $.extend({}, defaults, options);

                return plugin.each(function () {
                    $element = $(this);
                    element = this;

                    // No source? Load nothing.
                    if (!plugin.o.source) return;
                    
                    currentPageIndex = plugin.o.pageIndex;
                    boxWidth = plugin.o.slideWidth / plugin.o.boxCol;
                    boxHeight = plugin.o.height / plugin.o.boxRow;
        
        
                    // Ready all slider emelents
                    $slide_wrapper = $('<div class="kSlide2Wrapper" />').css({'position': 'relative'});
                    $slide_panel = $('<div class="kSlide2Panel" />').css({'position': 'relative'});
                    $nav = $('<div class="kSlide2nav" />').css({width: plugin.o.width, 'position': 'relative'});
                    $scrub = $('<div class="kSlide2scrub" />');

                    // Generate Navigation bar
                    $scrub
                        .css({
                            'position': 'absolute',
                            'top': 0,
                            'left': 0,
                            'cursor': 'pointer'
                        });
                        
                    // Load the first batch of feeds (default 10), currentTotal, totalItems, currentPageIndex will be updated.
                    var feeds = _loadMore();

                    // $slide_panel.append('<div style="width:1024px; height:390px; background-color:green; float:left"></div><div style="width:1024px; height:390px; background-color:blue; float:left"></div>');

                    // Attach elements to wrapper
                    $slide_wrapper
                        .height(plugin.o.height)
                        .width(plugin.o.width)
                        .css({
                            'position': 'relative',
                            'overflow': 'hidden'
                        })
                        .append($slide_panel);

                    // Follow the parent width by default
                    nav_width = $slide_wrapper.width();
                    
                    // else set to user define width and make sure the width is less than the slider width
                    if (plugin.o.navWidth != 'parent' && plugin.o.navWidth < $slide_wrapper.width())
                        nav_width = plugin.o.navWidth;
                        
                    $nav.attr('id', plugin.o.navId).width(nav_width).append($scrub);

                    // Done and show
                    $element.append($slide_wrapper).append($nav);

                    // Setup drag handler
                    $scrub    
                        .draggable({
                            axis: 'x',
                            zIndex: 999,
                            containment: 'parent',
                            drag: function(event, ui) {
                                // Setup drag event handler
                                _dragHandler(ui, ratio);
                            }
                        });
                });
            }
        };

        // Private functions
        var _dragHandler = function (ui, ratio) {
            // Do scrolling
            $slide_panel
                .stop(true, true)
                .animate({'margin-left': -1 * (ui.position.left * ratio)}, {duration:600, easing: 'easeInOutQuint'});

                
            // Hit the end? 
            if (checkEnd && ui.position.left + $scrub.width() == $nav.width()) {
                checkEnd = false;
                
                console.log(hasMore);
                
                // Check if any more feeds
                if (hasMore) {
                    _loadMore();
                }
            }
        }

        var _loadMore = function () {
            // Setup loader icon
            $('<span class="kLoader ir">Loading...</span>').appendTo($individualBoxWrapper);

            // Build the feed URL
            var url = plugin.o.source + '?PageSize=' + plugin.o.pageSize + '&PageIndex=' + currentPageIndex;

            // Load new feeds
            $.ajax({
                url: url,
                contentType: 'application/json; charset=utf-8',
                dataType: 'jsonp'
            }).done(function (feeds) {
                // Tile them up
                _feedsTiling(feeds);
                
                checkEnd = true;
                
                $element.find('.kLoader').remove();
            
                // Check for feed items to turn on/off 'more loading'
                if (currentTotal != 0 && totalItems == currentTotal) {
                    hasMore = false;
                } else {
                    hasMore = true;
                }                
            });
        }

        var _feedsTiling = function (feeds) {
            var boxCanHoldAmount = plugin.o.boxCol * plugin.o.boxRow;

            // Each boxwrapper can contain boxCol * boxRow of boxee
            var $boxwrapper = $('<div class="kSlide2BoxWrapper" />')
                                    .css({
                                        width: boxWidth * plugin.o.boxCol,
                                        height: boxHeight * plugin.o.boxRow,
                                        'position': 'relative',
                                        'background-color': '#ffffff',
                                        'float': 'left',
                                        'display': 'block',
                                        'overflow': 'hidden'});
                                        
                                        
            // Tile feed algorithm, loop through the feeds
            for (var x = 0; x < feeds.Items.length; x++) {
                // If the wrapper is full, create a new wrapper
                if (currentBoxCount % boxCanHoldAmount == 0) {
                    $individualBoxWrapper = $boxwrapper.clone().appendTo($slide_panel);
                     
                    totalWidth += boxWidth * plugin.o.boxCol;
                }
                
                // Get the current feed type
                var type = _getMediaType(feeds.Items[x].MediaType, feeds.Items[x].SubMediaType);
                var $b = null;
                
                // Check for the placement for old video
                if (currentBoxCount % boxCanHoldAmount == 0 || currentBoxCount % boxCanHoldAmount == 2) {  
                    if (type.toLowerCase() === 'video') {
                        // check if any old video in the array
                        if (videoArray.length > 0) {
                            videoArray.push(feeds.Items[x]);    
                            
                            $b = _getVideoBox(videoArray.shift());
                        } else {
                            $b = _getVideoBox(feeds.Items[x]);
                        }
                        
                        currentBoxCount += plugin.o.boxVideoCol * plugin.o.boxVideoRow;
                    } else {                        
                        $b = _getBox(feeds.Items[x], type);
                        currentBoxCount++;
                    }                    
                } else {                    
                    if (type.toLowerCase() === 'video') {
                        videoArray.push(feeds.Items[x]);                                        
                    } else {
                        $b = _getBox(feeds.Items[x], type);
                        currentBoxCount++;
                    }   
                }
                
                // Stick it in the wrapper
                if ($b)
                    $individualBoxWrapper.append($b);
            }
            
            // Update the total item count
            totalItems = feeds.TotalItems;
            
            // Update the current total of feeds loaded
            currentTotal = feeds.Items.length + (currentPageIndex * plugin.o.pageSize);

            // Update Current Page
            currentPageIndex++;
                
            // Update slider Panel width
            $slide_panel.width(totalWidth);
            
            // update scrub width
            $scrub.width(_setScrubWidth());
            
            // Update ratio
            ratio = totalWidth / nav_width;
        }

        var _getBox = function (feed, type) {
            boxColor = !boxColor;
            
            var $box = $('<div class="kSlide2Box">\
                                <p>\
                                    <span class="box_type">' + type + '</span>\
                                    <a target="_blank" href="#" class="box_title"></a>\
                                    <span class="box_date"></span>\
                                </p>\
                            </div>');
            $box.css({
                width: boxWidth - 2 * plugin.o.border,
                height: boxHeight - 2 * plugin.o.border,
                'background-color': (type.toLowerCase() === 'news' ? '#77d1ec': '#00aedb'),
                'float': 'left',
                'border-style': 'solid',
                'border-width': plugin.o.border,
                'border-color': plugin.o.borderColor,
                'overflow': 'hidden'});
            
            $box.find('.box_title')
                .html(feed.Title.replace('\"', '"'))                
                .attr('href', feed.Link)
                .css({'display': 'block'});
                
            $box.find('.box_date')
                .html(feed.RelativeTime ? feed.RelativeTime : feed.pubDate);                
                             
            _truncate($box.find('.box_title'), 75);
                        
            return $box;
        }

        var _getVideoBox = function (feed) {
            boxColor = !boxColor;
            
            var $box = $('<div class="kSlide2Box">\
                                <a target="_blank" href="#" class="ir box_vid" title=""></a>\
                                <p>\
                                    <span class="box_type">Video</span>\
                                    <a target="_blank" href="#" class="box_title"></a>\
                                    <span class="box_date"></span>\
                                </p>\
                            </div>');
                                
            $box.css({
                width: (boxWidth * plugin.o.boxVideoRow) - 2 * plugin.o.border,
                height: (boxHeight * plugin.o.boxVideoCol) - 2 * plugin.o.border,
                'background-color': '#27c1e5',
                'float': 'left',
                'border-style': 'solid',
                'border-width': plugin.o.border,
                'border-color': plugin.o.borderColor,
                'overflow': 'hidden'});
                                
            $box
                .find('.box_vid')
                .attr('title', feed.Title.replace('\"', '"'))
                .attr('href', feed.Link)
                .css({
                    'background': '#000 url(' + feed.previewimageurl + ') center center no-repeat',
                    'overflow': 'hidden',
                    'display': 'block'
                });
                
            $box
                .find('.box_title')
                .html(feed.Title.replace('\"', '"'))
                .attr('href', feed.Link)
                .css({'display': 'block'});
                
            $box.find('.box_date')
                .html(feed.RelativeTime ? feed.RelativeTime : feed.pubDate);    
                
            _truncate($box.find('.box_title'), 55);
            
            return $box;
        }
        
        var _setScrubWidth = function () {
            return ($slide_wrapper.width() / totalWidth * 100) + '%';
        }

        var _getMediaType = function (mediaType, subMediaType) {
            switch (mediaType) {
                case 0:
                    // news is MediaType = 0, SubMediaType = 2
                    if (subMediaType === 2) {
                        return "News";
                    }
                    else {
                        return "Blog";                        
                    }
                case 2:
                    return "Video";                    
                case 3:
                    return "Social";
                case 5:
                    return "Event";
                default:
                    return "Blog";
            }        
        }

        var _truncate = function ($para, truncate) {
            // Check if the para is longer than the limit then perfom truncate
            if ($para.text().length > truncate) {
                // Find the charatcer limit
                var limit_str = $para.text().substr(0, truncate);
                var space_pos = limit_str.lastIndexOf(' ');
                var final_str = limit_str.substr(0, space_pos);

                // If the last postion is a period. Add a space to it
                if (final_str[space_pos - 1] == '.')
                final_str += ' ';

                // Print out the truncated paragraph
                $para.html(final_str + '&hellip;');
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