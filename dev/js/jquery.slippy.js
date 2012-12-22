/*!
 * jQuery slippy v1.0.1
 * https://github.com/psyrendust/slippy
 * Copyright 2012, Larry Gordon
 *
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

// (function(e){e.setAttribute("src","http://10.0.1.14:8081/target/target-script-min.js#anonymous");document.getElementsByTagName("body")[0].appendChild(e);})(document.createElement("script"));
(function($){
	
	$.fn.slippy = function(options) {
		var defaults = {
			speed          : 500,			// integer - in ms, duration of time slide transitions will occupy
			easing         : 'swing',		// string - 'swing', used with jquery.easing.1.3.js - see http://gsgd.co.uk/sandbox/jquery/easing/ for available options
			auto           : false,			// true, false - make slideshow change automatically
			autoStart      : true,			// true, false - if false show will wait for 'start' control to activate
			pauseOnHover   : true,			// true, false - if true show will pause on mouseover
			delayStart     : 0,				// integer - in ms, the amount of time before starting the auto show
			pause          : 3000,			// integer - in ms, the duration between each slide transition
			startingSlide  : 1,				// integer - starting slide
			delayUntilEvent: false,
		
			// infinite width settings
			infiniteWidth  : false,			// true, false - if true make the carousel infinite width
			widthSpeed     : 400,			// integer - in ms, duration of time infinite width transitions will occupy
			minWidth       : 960,			// integer - the minimum width of the carousel
			minHeight      : 0,				// integer - the minimum height of the carousel
			widthEasing    : 'swing',		// used with jquery.easing.1.3.js - see http://gsgd.co.uk/sandbox/jquery/easing/ for available options
		
			// auto height settings
			autoHeight     : false,			// true, false - if true change the height of the carousel to the height of the current slide
			heightSpeed    : 1000,			// integer - in ms, duration of time height transitions will occupy
			heightEasing   : 'swing',		// used with jquery.easing.1.3.js - see http://gsgd.co.uk/sandbox/jquery/easing/ for available options
			
			// callbacks
			onBeforeSlide  : function(){},	// function()
			onAfterSlide   : function(){},	// function()
			onLastSlide    : function(){},	// function()
			onFirstSlide   : function(){},	// function()
			onNextSlide    : function(){},	// function()
			onPrevSlide    : function(){},	// function()
			onInitComplete : function(){}	// function()
		};
		options = $.extend(defaults, options);
		
		// private variables
		var base         = this;
		var $base        = $(this);
		var $kids        = $base.children();
		var $window      = $(window);
		var currentSlide = options.startingSlide;
		var totalSlides  = $kids.length;
		var interval, $wrapper, slideWidth, slideLeft, winWidth, minWidth, minHeight,
			speed, easing, auto, autoStart, pauseOnHover, delayStart, pause, startingSlide,
			infiniteWidth, widthSpeed, widthEasing, autoHeight, heightSpeed, heightEasing,
			prevSlide, $pager, $pagerKids, isHovering = false, timeoutIntervalID, delayUntilEvent;
		isWorking = false;
		
		// public methods
		this.getCurrentSlide = function(){
			return currentSlide;
		};
		this.startSlippy = function(){
			// console.log('startSlippy');
			if(!auto || isHovering) return;
			delayUntilEvent = false;
			isWorking = false;
			// console.log('startSlippy: setTimeout start');
			timeoutIntervalID = window.setTimeout(function(){
				base.nextSlide();
			}, pause);
			// console.log('startSlippy: setTimeout end');
		};
		this.stopSlippy = function(){
			// console.log('stopSlippy');
			// console.log('    stopSlippy', timeoutIntervalID);
			isWorking = true;
			window.clearTimeout(timeoutIntervalID);
			// console.log('    stopSlippy', timeoutIntervalID);
		};
		this.resumeSlippy = function(){
			// console.log('resumeSlippy');
			isWorking = false;
			base.startSlippy();
		};
		this.nextSlide = function(){
			// console.log('nextSlide');
			if(isWorking) return;
			var newSlide = currentSlide+1;
			if(newSlide > totalSlides){
				newSlide = 1;
			}
			base.gotoSlide(newSlide);
		};
		this.prevSlide = function(){
			// console.log('prevSlide');
			if(isWorking) return;
			var newSlide = currentSlide-1;
			if(newSlide < 1){
				newSlide = totalSlides;
			}
			base.gotoSlide(newSlide);
		};
		this.gotoSlide = function(newSlide, hasClicked){
			// console.log('gotoSlide', isWorking, hasClicked);
			window.clearTimeout(timeoutIntervalID);
			if(!isWorking || hasClicked){
				var $currentSlide = $kids.eq(newSlide-1);
				$pagerKids.removeClass('selected').data('isSelected', false);
				$pagerKids.eq(newSlide-1).addClass('selected').data('isSelected', true);
				currentSlide = newSlide;
				options.onBeforeSlide();
				onBeforeSlideAutoHeight($currentSlide);
				var left = -(slideWidth * (currentSlide-1));
				var delay = 0;
				if(isWorking){
					delay = heightSpeed;
				}
				isWorking = true;
				// console.log('  delay:', delay);
				$wrapper.delay(delay).animate({ left:left }, speed, widthEasing, function(){
					isWorking = false;
					onAfterSlideAutoHeight($currentSlide);
					base.startSlippy();
					options.onAfterSlide();
				});
			}
		};
		
		// private methods
		function init(){
			$base.wrapInner('<div class="wrapper" />');
			$wrapper       = $base.children('.wrapper');
			winWidth       = $window.width();
			minWidth       = options.minWidth;
			minHeight      = (options.minHeight <= 0) ? $base.height() : options.minHeight;
			speed          = options.speed;
			easing         = options.easing;
			auto           = options.auto;
			autoStart      = options.autoStart;
			pauseOnHover   = options.pauseOnHover;
			delayStart     = options.delayStart;
			pause          = options.pause;
			delayUntilEvent= options.delayUntilEvent;
			startingSlide  = options.startingSlide;
			infiniteWidth  = options.infiniteWidth;
			widthSpeed     = options.widthSpeed;
			widthEasing    = options.widthEasing;
			autoHeight     = options.autoHeight;
			heightSpeed    = options.heightSpeed;
			heightEasing   = options.heightEasing;
			$base.css({
				'overflow': 'hidden',
				'width'   : '100%',
				'height'  : minHeight
			}).addClass('slippy');
			$wrapper.css({
				'position': 'absolute',
				'width'   : '999990px',
				'top'     : '0px',
				'left'    : '0px',
				'z-index' : '1'
			});
			$kids.css({
				'position': 'relative',
				'width'   : '1600px',
				'margin'  : '0px',
				'padding' : '0px',
				'float'   : 'left'
			});
			$kids.children('.background').css({
				'position': 'absolute',
				'z-index' : 1,
				'width'   : '100%',
				'height'  : minHeight,
				'background-position': 'top left',
				'background-repeat'  : 'repeat-x'
			});
			$kids.children('.content').css({
				'position': 'relative',
				'width'   : minWidth,
				'margin'  : '0px auto',
				'z-index' : 10
			});
			// create pager controls
			var pager = '<div class="slippy-pager">';
			for(var i=1; i<=totalSlides; i++){
				pager += '<a href="" class="slippy-pager-link">'+i+'</a>';
			}
			pager += '</div>';
			$base.append(pager);
			$pager = $('.slippy-pager');
			$pagerKids = $pager.children('.slippy-pager-link');
			// setup pager events\
			$pagerKids.each(function(i){
				$(this).click(function(e){
					// console.log('click: ', i, base);
					base.gotoSlide(i+1, true);
					e.preventDefault();
				}).hover(function(){
					if(!$(this).data('isSelected')){
						$(this).addClass('selected');
					}
				}, function(){
					if(!$(this).data('isSelected')){
						$(this).removeClass('selected');
					}
				});
			});
			// check for infiniteWidth
			if(infiniteWidth){
				// Requires jquery.debouncedresize.js.
				if(!$.event.special.debouncedresize){
					throw "Requires jquery.debouncedresize.js. Get it " +
					      "here: https://github.com/louisremi/jquery-smartresize";
				}
				$window.on('debouncedresize', function(event){
					updateWidth();
				});
				updateWidth(0);
			}
			setPauseOnHover();
			initFirstSlide(startingSlide);
			options.onInitComplete();
			if(autoStart && !delayUntilEvent){
				base.startSlippy();
			}
		};
		/**
		 * Handles hover events slider
		 */
		function setPauseOnHover(){
			if(pauseOnHover) {
				$wrapper.hover(function(){
					if(auto && !delayUntilEvent){
						isHovering = true;
						base.stopSlippy();
					}
				}, function(){
					if(auto && !delayUntilEvent){
						isHovering = false;
						base.startSlippy();
					}
				});
			}else{
				$base.unbind('hover');
			}
		}
		/**
		 * Infinite Width helper function
		 */
		function updateWidth(speedOverride){
			winWidth = $(window).width();
			var maskWidth = minWidth;
			var maskLeft    = 0;
			var itemWidth   = 1600;
			var speed = (speedOverride === 0) ? speedOverride : widthSpeed;
			if(winWidth > maskWidth){
				maskWidth = winWidth;
				maskLeft = -(winWidth * (base.getCurrentSlide()-1));
			}else{
				maskLeft = -(maskWidth * (base.getCurrentSlide()-1));
			}
			if(winWidth > itemWidth){
				itemWidth = winWidth;
			}
			$base.animate({width:maskWidth}, speed, widthEasing);
			$wrapper.animate({left:maskLeft}, speed, widthEasing);
			// if($pager) $pager.animate({width:maskWidth}, speed, widthEasing);
			$kids.animate({width:maskWidth}, speed, widthEasing);
			slideLeft = maskLeft;
			slideWidth = maskWidth;
		}
		function onBeforeSlideAutoHeight(currentSlideHtmlObject){
			// console.log('onBeforeSlideAutoHeight: ', isWorking);
			if(!autoHeight) return;
			var currHeight = $base.outerHeight();
			var newHeight = $(currentSlideHtmlObject).outerHeight();
			if(currHeight!=newHeight && newHeight <= minHeight){
				isWorking = true;
				$base.animate({height:minHeight}, heightSpeed, heightEasing);
			}
		}
		function onAfterSlideAutoHeight(currentSlideHtmlObject){
			// console.log('onAfterSlideAutoHeight: ', isWorking);
			if(!autoHeight) return;
			var currHeight = $base.outerHeight();
			var newHeight = $(currentSlideHtmlObject).outerHeight();
			if(currHeight!=newHeight && newHeight > minHeight){
				$base.animate({height:newHeight}, heightSpeed, heightEasing);
			}
		}
		function initFirstSlide (newSlide){
			// console.log('initFirstSlide', newSlide);
			var $currentSlide = $kids.eq(newSlide-1);
			$pagerKids.removeClass('selected').eq(newSlide-1).addClass('selected');
			currentSlide = newSlide;
			var left = -(slideWidth * (currentSlide-1));
			$wrapper.css({ left:left });
			var currHeight = $base.outerHeight();
			var newHeight = $currentSlide.outerHeight();
			if(currHeight!=newHeight && newHeight > minHeight){
				$base.css({height:newHeight});
			}
			
		}
		
		this.each(function(){
			if($(this).children().length > 0){
				init();
			}
		});
		return this;
	};
})(jQuery);