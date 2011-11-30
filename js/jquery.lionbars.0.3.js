(function( $ ) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    };
	$.fn.lionbars = function(color, showOnMouseOver, visibleBar, visibleBg) {
		// Initialization
		var elements = $(this),
			id = 0,
			vScrollWidth=0, hScrollWidth=0,
			addHScroll=false, addVScroll=false,
			paddingTop=0, paddingLeft=0, paddingBottom=0, paddingRight=0,
			borderTop=0, borderRight=0, borderBottom=0, borderLeft=0,
			scrollHeight=0, scrollWidth=0, offsetWidth=0, offsetHeight=0, clientWidth=0, clientHeight=0;
		
		// Main Loop
		mainLoop();
		
		function mainLoop() {
			for (var i=0; elements[i] !== undefined; i++) {
				if (needScrollbars(elements[i]) && !$(elements[i]).hasClass('nolionbars')) {
					// add the element to the main array
					target = elements[i];
					
					// get some values before the element is wrapped
					getDimentions(target);
					
					// wrap the element
					wrap(target, addVScroll, addHScroll);
					
					// hide the default scrollbar
					hideScrollbars(target, addVScroll, addHScroll);
					reduceScrollbarsWidthHeight(target);
					setSlidersHeight(target);
					
					// prepare for next element
					resetVars();
				}
			}
		}
		
		// Core functions
		function setSlidersHeight(elem) {
			var el = $(elem);
			var hmin, hmax, gap, height, width;
			
			if (el.find('.lb-v-scrollbar').length != 0) {
				hmin = 10;
				gap = offsetHeight - el.find('.lb-v-scrollbar').height();
				hmax = offsetHeight - gap - hmin;
				height = Math.round((offsetHeight*hmax)/scrollHeight);
			}
			if (el.find('.lb-h-scrollbar').length != 0) {
				hmin = 10;
				gap = offsetWidth - el.find('.lb-h-scrollbar').width();
				hmax = offsetWidth - gap - hmin;
				width = Math.round((offsetWidth*hmax)/scrollWidth);
			}
			
			el.find('.lb-v-scrollbar-slider').css({ "height" : height });
			el.find('.lb-h-scrollbar-slider').css({ "width" : width });
		}
		function resetVars() {
			vScrollWidth = 0;
			hScrollWidth = 0;
			addHScroll=false;
			addVScroll=false;
			paddingTop = 0;
			paddingLeft = 0;
			paddingBottom = 0;
			paddingRight = 0;
			borderTop = 0;
			borderLeft = 0;
			borderBottom = 0;
			borderRight = 0;
			scrollHeight = 0;
			scrollWidth = 0;
			offsetWidth = 0;
			offsetHeight = 0;
			clientWidth = 0;
			clientHeight = 0;
		}
		function reduceScrollbarsWidthHeight(elem) {
			var el = $(elem);
			
			if (addVScroll && addHScroll) {
				el.find('.lb-v-scrollbar').css({ "height" : el.height()-12 });
				el.find('.lb-h-scrollbar').css({ "width" : el.width()-12 });
			} else {
				el.find('.lb-v-scrollbar').css({ "height" : el.height()-4 });
				el.find('.lb-h-scrollbar').css({ "width" : el.width()-4 });
			}
		}
		function hideScrollbars(elem, vscroll, hscroll) {
			var el = $(elem);
			
			if (vscroll || hscroll) {
				el.css({ "overflow" : 'hidden' });
				movePadding(el, el.find('.lb-wrap'));
				resizeMainBox(el);
				resizeInnerWrap(el, el.find('.lb-wrap'));
			}
		}
		function resizeMainBox(elem) {
			var el = $(elem);
			el.css({ "width" : el.width() + paddingLeft + paddingRight, "height" : el.height() + paddingTop + paddingBottom });
		}
		function movePadding(from, to) {
			var fromEl = $(from);
			var toEl = $(to);
			
			fromEl.css({ "padding" : 0 });
			toEl.css({
				"padding-top" : paddingTop+'px',
				"padding-left" : paddingLeft+'px',
				"padding-bottom" : paddingBottom+'px',
				"padding-right" : paddingRight+'px' 
			});
		}
		function resizeInnerWrap(main, child) {
			var mainEl = $(main);
			var childEl = $(child);
			mainEl.css({ "position" : 'relative' });
			childEl.css({
				"width" : mainEl.width()+vScrollWidth - paddingLeft - paddingRight, 
				"height" : mainEl.height()+hScrollWidth - paddingTop - paddingBottom 
			});
		}
		function setVScrollbarWidth(elem) {
			var el = $(elem);
			el.css({ "overflow" : 'auto' });
			vScrollWidth = offsetWidth - clientWidth - borderLeft - borderRight;
			el.css({ "overflow" : 'hidden' });
		}
		function setHScrollbarWidth(elem) {
			var el = $(elem);
			el.css({ "overflow" : 'auto' });
			hScrollWidth = offsetHeight - clientHeight - borderTop - borderBottom;
			el.css({ "overflow" : 'hidden' });
		}
		function wrap(elem, vscroll, hscroll) {
			var el = $(elem);
			var elemId = el.attr('id');
			var wrap = 0;
			
			if (elemId !== undefined) {
				el.wrapInner('<div class="lb-wrap" id="lb-wrap-'+id+'-'+elemId+'"></div>');
				wrap = $('#lb-wrap-'+id+'-'+elemId);
			} else {
				el.wrapInner('<div class="lb-wrap" id="lb-wrap-'+id+'"></div>');
				wrap = $('#lb-wrap-'+id);
			}
			wrap.wrapInner('<div class="lb-content"></div>');
			if (vscroll) {
				el.prepend('<div class="lb-v-scrollbar"></div>');
				el.find('.lb-v-scrollbar').append('<div class="lb-v-scrollbar-slider"></div>');
			}
			if (hscroll) {
				el.prepend('<div class="lb-h-scrollbar"></div>');
				el.find('.lb-h-scrollbar').append('<div class="lb-h-scrollbar-slider"></div>');
			}

			// preparation for the next element
			id = id + 1;
		}
		function needScrollbars(elem) {
			var el = $(elem);
			addVScroll = false;
			addHScroll = false;
			
			getPadding(el);
			getBorders(el);
			
			el.css({ "overflow" : 'hidden' });
			
			// check for vertical scrollbars
			if (el.get(0).scrollHeight > el.get(0).clientHeight) {
				addVScroll = true;
				// setVScrollbarWidth(el);
			}
			
			// check for horizontal scrollbars
			if (el.get(0).scrollWidth > el.get(0).clientWidth) {
				addHScroll = true;
				// setHScrollbarWidth(el);
			}
			
			el.css({ "overflow" : 'auto' });
			
			if (addVScroll || addHScroll) {
 				return true;
 			}			
		}
		function getPadding(elem) {
			var el = $(elem);
			
			paddingTop = parseInt(el.css('padding-top').replace('px', ''));
			paddingLeft = parseInt(el.css('padding-left').replace('px', ''));
			paddingBottom = parseInt(el.css('padding-bottom').replace('px', ''));
			paddingRight = parseInt(el.css('padding-right').replace('px', ''));
			
			// console.log(paddingTop, paddingLeft, paddingBottom, paddingRight);
		}
		function getBorders(elem) {
			var el = $(elem);
			
			borderTop = parseInt(el.css('border-top-width').replace('px', ''));
			borderRight = parseInt(el.css('border-right-width').replace('px', ''));
			borderBottom = parseInt(el.css('border-bottom-width').replace('px', ''));
			borderLeft = parseInt(el.css('border-left-width').replace('px', ''));
		}
		function getDimentions(elem) {
			var el = $(elem).get(0);
			
			scrollHeight = el.scrollHeight;
			scrollWidth = el.scrollWidth;
			clientHeight = el.clientHeight;
			clientWidth = el.clientWidth;
			offsetHeight = el.offsetHeight;
			offsetWidth = el.offsetWidth;
			
			setVScrollbarWidth($(elem));
			setHScrollbarWidth($(elem));
			
			
			console.log(vScrollWidth);
		}
		
		return this.each(function() {
			//var $this = $(this);
		});
	};
})( jQuery );