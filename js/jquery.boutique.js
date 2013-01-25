(function($){
	jQuery.fn.boutique = function(options){

		// OPTION DEFAULTS
		var opt = $.extend({
			starter:			1,				// Which frame to start with
			speed:				600,			// Overall animation speed in ms
			hovergrowth:		0.08,			// How much the front item will enlarge on mouse-over in percentage
			behind_opac:		0.4,			// Opacity of the furter back items
			back_opac:			0.15,			// Opacity of the furthest back items
			behind_size:		0.7,			// Size of the further back images in percentage
			back_size:			0.4,			// Size of the furthest back images in percentage
			autoplay:			false,			// Autoplay on/off
			autointerval:		3000,			// Autoplay interval in ms
			freescroll:			true,			// Whether you can still navigate while animatispeedng
			easing:				'easeInOutQuad',// Standard easing type if the easing plugin is provided
			move_twice_easein:	'easeInCirc',	// Easing type for the first part of moving twice
			move_twice_easeout:	'easeOutCirc'	// Easing type for the second part of moving twice
		},options);

		$(this).each(function(){

			// Set constants
			var autotimer, easingplugin, header, hoverspeed, $newitem1, $newitem2, $newitem3, $newitem4, $newitem5, eazing, zpeed, next, iegrow, container_height;
			var containerid		= $(this).attr('id');
			var item1id			= containerid+'_item1';
			var item2id			= containerid+'_item2';
			var item3id			= containerid+'_item3';
			var item4id			= containerid+'_item4';
			var item5id			= containerid+'_item5';
			var busy			= false;
			var current			= opt.starter;
			var items			= $(this).find(' li').length;
			var ie				= false;
			var ie6				= false;
			
			if(opt.hoverspeed){
				hoverspeed = opt.hoverspeed;
			}else{
				hoverspeed = (opt.speed/4);
			}
			if(opt.starter > items){
				opt.starter = items;
			}

			// Easing type for easing plugin:
			if( $.easing.def ){
				easingplugin = true;
				$.easing.def = opt.easing;
			}else{
				easingplugin = false;
			}

			// Element caching
			var $container	= $(this);
			var $lis		= $('li',$container);

			// For each list item...
			var x=1;
			var $li = new Array();
			$lis.each(function(){

				// Number all items
				$(this).addClass('li'+x);

				// Set headers from alt tags
				header = $(this).find('img').attr('alt');
				if( !$(this).find('span').length ){
					if( $(this).find('a').length ){$(this).children('a').append('<span/>');}
					else{$(this).append('<span/>');}
					if(header==''){
						$(this).find('span').hide();
					}
				}
				$(this).find('span').prepend('<h6>'+header+'</h6>');
				if(header==''){
					$(this).find('h6').hide();
				}

				// Cache the element:
				$li[x] = $('.li'+x,$container);
				x++;
			});

			// Set order id's
			if( items==1 ){
				$li[1].clone().attr('id',item1id).prependTo($container);
				$li[1].clone().attr('id',item2id).prependTo($container);
			}
			else if( opt.starter == 2 ){
				$li[1].clone().attr('id',item2id).prependTo($container);
				$li[items].clone().attr('id',item1id).prependTo($container);
			}
			else if( opt.starter == 1 ){
				$li[items-1].clone().attr('id',item1id).prependTo($container);
				$li[items].clone().attr('id',item2id).prependTo($container);
			}
			else{
				$li[opt.starter-1].clone().attr('id',item2id).prependTo($container);
				$li[opt.starter-2].clone().attr('id',item1id).prependTo($container);
			}
			$li[opt.starter].clone().attr('id',item3id).prependTo($container);
			if( items==1 ){
				$li[1].clone().attr('id',item4id).prependTo($container);
				$li[1].clone().attr('id',item5id).prependTo($container);
			}
			else if( opt.starter == (items-1) ){
				$li[items].clone().attr('id',item4id).prependTo($container);
				$li[1].clone().attr('id',item5id).prependTo($container);
			}
			else if( opt.starter == items ){
				$li[1].clone().attr('id',item4id).prependTo($container);
				$li[2].clone().attr('id',item5id).prependTo($container);
			}
			else{
				$li[opt.starter+1].clone().attr('id',item4id).prependTo($container);
				$li[opt.starter+2].clone().attr('id',item5id).prependTo($container);
			}

			// Cache the first 5
			var $item1 = $('#'+item1id);
			var $item2 = $('#'+item2id);
			var $item3 = $('#'+item3id);
			var $item4 = $('#'+item4id);
			var $item5 = $('#'+item5id);

			// Set CSS classes
			//$('#'+item1id+', #'+item5id).show().animate({ opacity:0 },0).addClass('back');
			$item1.show().animate({ opacity:0 },0).addClass('back');
			$item2.show().animate({ opacity:0 },0).addClass('behind');
			$item3.show().animate({ opacity:0 },0).addClass('front');
			$item4.show().animate({ opacity:0 },0).addClass('behind');
			$item5.show().animate({ opacity:0 },0).addClass('back');

			// Set variables based on CSS classes
			var $back				= $('.back',$container);
			var $behind				= $('.behind',$container);
			var $front				= $('.front',$container);
			var container_width		= parseInt($container.css('width'));
			var li_border			= parseInt( $lis.css('borderLeftWidth') );
			var li_padding			= parseInt( $lis.css('padding-left') );
			var front_img_width		= parseInt($('img',$front).css('width'));
			var front_img_height	= parseInt($('img',$front).css('height'));
			var front_header		= $('h6',$front).css('font-size');
			var front_span			= $('span',$front).css('font-size');
			var front_top			= $front.css('margin-top');
			var front_margin		= parseInt($('img',$front).css('margin-left'));
			var front_width			= Math.round( front_img_width + (front_margin*2) + (li_padding*2) + (li_border*2) );
			var front_height		= Math.round( front_img_height + (front_margin*2) + (li_padding*2) + (li_border*2) );
			var behind_img_width	= Math.round(front_img_width * opt.behind_size );
			var behind_img_height	= Math.round(front_img_height * opt.behind_size );
			var behind_header		= $('h6',$behind).css('font-size');
			var behind_span			= $('span',$behind).css('font-size');
			var behind_top			= $behind.css('margin-top');
			var behind_margin		= parseInt($('img',$behind).css('margin-left'));
			var behind_width		= Math.round( behind_img_width + (behind_margin*2) + (li_padding*2) + (li_border*2) );
			var behind_height		= Math.round( behind_img_height + (behind_margin*2) + (li_padding*2) + (li_border*2) );
			var back_img_width		= Math.round(front_img_width * opt.back_size );
			var back_img_height		= Math.round(front_img_height * opt.back_size );
			var back_header			= $('h6',$back).css('font-size');
			var back_span			= $('span',$back).css('font-size');
			var back_top			= $back.css('margin-top');
			var back_margin			= parseInt($('img',$back).css('margin-left'));
			var back_width			= Math.round( back_img_width + (back_margin*2) + (li_padding*2) + (li_border*2) );
			var back_height			= Math.round( back_img_height + (back_margin*2) + (li_padding*2) + (li_border*2) );
			var item2_pos			= Math.round( (container_width/4)-(behind_width/2) );
			var item3_pos			= Math.round( (container_width/2)-(front_width/2) );
			var item4_pos			= (container_width - item2_pos - behind_width );
			var item5_pos			= (container_width - back_width );

			// Remove CSS classes
			$back.removeClass('back');
			$behind.removeClass('behind');
			$front.removeClass('front');

			// Deal with the text container <span> padding for future animation
			var front_span_paddingTop = $('span',$lis).css('padding-top');
			var front_span_paddingRight = $('span',$lis).css('padding-right');
			var front_span_paddingBottom = $('span',$lis).css('padding-bottom');
			var front_span_paddingLeft = $('span',$lis).css('padding-left');
			var behind_span_paddingTop = Math.round( parseInt(front_span_paddingTop)*0.8 )+'px';
			var behind_span_paddingRight = Math.round( parseInt(front_span_paddingRight)*0.8 )+'px';
			var behind_span_paddingBottom = Math.round( parseInt(front_span_paddingBottom)*0.8 )+'px';
			var behind_span_paddingLeft = Math.round( parseInt(front_span_paddingLeft)*0.8 )+'px';
			var back_span_paddingTop = Math.round( parseInt(front_span_paddingTop)*0.6 )+'px';
			var back_span_paddingRight = Math.round( parseInt(front_span_paddingRight)*0.6 )+'px';
			var back_span_paddingBottom = Math.round( parseInt(front_span_paddingBottom)*0.6 )+'px';
			var back_span_paddingLeft = Math.round( parseInt(front_span_paddingLeft)*0.6 )+'px';
			var front_span_animate = {'font-size':front_span, 'padding-top':front_span_paddingTop, 'padding-right':front_span_paddingRight, 'padding-bottom':front_span_paddingBottom, 'padding-left':front_span_paddingLeft};
			var behind_span_animate = {'font-size':behind_span, 'padding-top':behind_span_paddingTop, 'padding-right':behind_span_paddingRight, 'padding-bottom':behind_span_paddingBottom, 'padding-left':behind_span_paddingLeft};
			var back_span_animate = {'font-size':back_span, 'padding-top':back_span_paddingTop, 'padding-right':back_span_paddingRight, 'padding-bottom':back_span_paddingBottom, 'padding-left':back_span_paddingLeft};
			if(ie6){
				var front_span_margin = (parseInt($('span:visible',$front).css('margin-left')) + parseInt($('span:visible',$front).css('margin-right')));
				var behind_span_margin = (parseInt($('span:visible',$behind).css('margin-left')) + parseInt($('span:visible',$behind).css('margin-right')));
				var back_span_margin = (parseInt($('span:visible',$back).css('margin-left')) + parseInt($('span:visible',$back).css('margin-right')));
				var ie6_front_span_animate = $.extend({ width:front_width-parseInt(front_span_paddingRight)-parseInt(front_span_paddingLeft)-front_span_margin-(li_border*2) },front_span_animate);
				var ie6_behind_span_animate = $.extend({ width:behind_width-parseInt(behind_span_paddingRight)-parseInt(behind_span_paddingLeft)-behind_span_margin-(li_border*2) },behind_span_animate);
				var ie6_back_span_animate = $.extend({ width:back_width-parseInt(back_span_paddingRight)-parseInt(back_span_paddingLeft)-back_span_margin-(li_border*2) },back_span_animate);
			}

			// Get total container height
			var front_space = (front_height + parseInt(front_top));
			var behind_space = (behind_height + parseInt(behind_top));
			var back_space = (back_height + parseInt(back_top));
			if( front_space > behind_space && front_space > back_space  ){ container_height = front_space; }
			else if( behind_space > front_space && behind_space > back_space  ){ container_height = behind_space; }
			else{ container_height = back_space; }

			// Starting positions
			$container.height( container_height );

			$item1.css({ left:0, top:back_top }).animate({ opacity:opt.back_opac },0)
				.find('img').animate({ width:back_img_width+'px', height:back_img_height+'px', margin:back_margin+'px', opacity:1 },0)
				.siblings('span:visible').css(back_span_animate)
				.children('h6:visible').css({'font-size':back_header});
			$item2.css({ left:item2_pos+'px', top:behind_top, 'z-index':2 }).animate({ opacity:opt.behind_opac },0)
				.find('img').animate({width:behind_img_width+'px', height:behind_img_height+'px', margin:behind_margin+'px', opacity:1},0)
				.siblings('span:visible').css(behind_span_animate)
				.children('h6:visible').css({'font-size':behind_header});
			$item3.css({ left:item3_pos+'px', top:front_top, 'z-index':3 }).animate({ opacity:1 },0)
				.find('a *').css({ cursor:'pointer' }).end()
				.find('img').animate({width:front_img_width+'px', height:front_img_height+'px', margin:front_margin+'px', opacity:1},0)
				.siblings('span:visible').css(front_span_animate)
				.children('h6:visible').css({'font-size':front_header});
			$item4.css({ left:item4_pos+'px', top:behind_top, 'z-index':2 }).animate({ opacity:opt.behind_opac },0)
				.find('img').animate({width:behind_img_width+'px', height:behind_img_height+'px', margin:behind_margin+'px', opacity:1},0)
				.siblings('span:visible').css(behind_span_animate)
				.children('h6:visible').css({'font-size':behind_header});
			$item5.css({ left:item5_pos+'px', top:back_top }).animate({ opacity:opt.back_opac },0)
				.find('img').animate({width:back_img_width+'px', height:back_img_height+'px', margin:back_margin+'px', opacity:1},0)
				.siblings('span:visible').css(back_span_animate)
				.children('h6:visible').css({'font-size':back_header});
			if(ie6){
				$('span:visible',$back).css(ie6_back_span_animate);
				$('span:visible',$behind).css(ie6_behind_span_animate);
				$('span:visible',$front).css(ie6_front_span_animate);
			}

// FUNCTIONS

			// Autoplay functions
			function stopInterval(){
				if( autotimer ){
					clearInterval(autotimer);
					autotimer=false;
				}
			}
			function startInterval(){
				if( autotimer ){
					stopInterval();
				}
				autotimer = setInterval( "$('#"+item4id+"').click()" ,opt.autointerval);
			}

			// Move right
			function moveRight(times){
				busy=true;

				// Set easing type and easing speed
				eazing = '';
				zpeed = opt.speed;
				if(easingplugin){
					if(times=='twice'){
						eazing = opt.move_twice_easein;
						zpeed = Math.round(opt.speed*0.5);
					}else if(times=='twice_end'){
						eazing = opt.move_twice_easeout;
					}else{
						eazing = opt.easing;
					}
				}

				// Pause autoplay
				if(opt.autoplay){
					stopInterval();
				}

				// Set next item number
				if( current == (items-2) ){
					next = 1;
				}else if( current == (items-1) ){
					next = 2;
					if(next > items){next = 1;}
				}else if( current == items ){
					next = 3;
					if(next > items){next = 1;}
				}
				else{
					next = (current+3);
				}

				// Move
				$('#'+item1id).removeAttr('id','').addClass('remove').css('z-index',-1);

				$newitem1 = $('#'+item2id);
				$newitem1.attr('id',item1id).stop().animate({ opacity:opt.back_opac, left:0, top:back_top },zpeed,eazing)
					.find('img').stop().animate({ width:back_img_width+'px', height:back_img_height+'px', margin:back_margin+'px', opacity:1 },zpeed,eazing)
					.end().find('h6:visible').stop().animate({ 'font-size':back_header },zpeed,eazing);
				if(ie6){ $newitem1.find('span:visible').stop().animate(ie6_back_span_animate,zpeed,eazing); }
				else{ $newitem1.find('span').stop().animate(back_span_animate,zpeed,eazing); }
				setTimeout( function(){ $newitem1.css('z-index',1); }, (zpeed/4));

				$newitem2 = $('#'+item3id);
				$newitem2.attr('id',item2id).stop().animate({ opacity:opt.behind_opac, left:item2_pos+'px', top:behind_top },zpeed,eazing)
					.find('img').stop().animate({ width:behind_img_width+'px', height:behind_img_height+'px', margin:behind_margin+'px', opacity:1 },zpeed,eazing)
					.end().find('h6:visible').stop().animate({ 'font-size':behind_header },zpeed,eazing);
				if(ie6){ $newitem2.find('span:visible').stop().animate(ie6_behind_span_animate,zpeed,eazing); }
				else{ $newitem2.find('span').stop().animate(behind_span_animate,zpeed,eazing); }
				setTimeout( function(){ $newitem2.css('z-index',2); }, (zpeed/4));

				$newitem3 = $('#'+item4id);
				$newitem3.attr('id',item3id).stop().animate({ opacity:1, left:item3_pos+'px', top:front_top },zpeed,eazing)
					.find('img').stop().animate({ width:front_img_width+'px', height:front_img_height+'px', margin:front_margin+'px', opacity:1 },zpeed,eazing)
					.end().find('h6:visible').stop().animate({ 'font-size':front_header },zpeed,eazing);
				if(ie6){ $newitem3.find('span:visible').stop().animate(ie6_front_span_animate,zpeed,eazing); }
				else{ $newitem3.find('span').stop().animate(front_span_animate,zpeed,eazing); }
				setTimeout( function(){ $newitem3.css('z-index',3); }, (zpeed/4));

				$newitem4 = $('#'+item5id);
				$newitem4.attr('id',item4id).stop().animate({ opacity:opt.behind_opac, left:item4_pos+'px', top:behind_top },zpeed,eazing)
					.find('img').stop().animate({width:behind_img_width+'px', height:behind_img_height+'px', margin:behind_margin+'px', opacity:1 },zpeed,eazing)
					.end().find('h6:visible').stop().animate({ 'font-size':behind_header },zpeed,eazing);
				if(ie6){ $newitem4.find('span:visible').stop().animate(ie6_behind_span_animate,zpeed,eazing); }
				else{ $newitem4.find('span').stop().animate(behind_span_animate,zpeed,eazing); }
				setTimeout( function(){ $newitem4.css('z-index',2); }, (zpeed/4));

				$li[next].clone()
					.attr('id',item5id)
					.prependTo($container)
					.show()
					.animate({ opacity:0, left:item5_pos+'px', top:back_top },0)
					.animate({ opacity:opt.back_opac },zpeed,function(){
						// When done animating:
						// Remove pointer cursor from previous item
						$('#'+item2id+' a *').css({ cursor:'default' });
						// Continue autoplay
						if(opt.autoplay){
							startInterval();
						}
						// Move 2nd time if requested
						if(times=='twice'){
							moveRight('twice_end');
						}
						// Add pointer cursor if front frame has a link
						else{
							$('#'+item3id+' a *').css({ cursor:'pointer' });
						}
						if(!$('#'+item3id).is(":animated")){
							// Reenable click events
							busy = false;
							// Make sure old items are removed
							$('.remove').stop().fadeOut(zpeed,function(){ $(this).remove(); });
						}
					})
					.find('img').animate({ width:back_img_width+'px', height:back_img_height+'px', margin:back_margin+'px', opacity:1 },0)
					.end().find('h6:visible').css({ 'font-size':back_header });
				if(ie6){ $('#'+item5id).find('span:visible').animate(ie6_back_span_animate,0); }
				else{ $('#'+item5id).find('span').animate(back_span_animate,0); }

				// Remove the out of range item
				$('.remove').fadeOut(zpeed,function(){ $(this).remove(); });

				// Set new current
				if(current==items){
					current = 1;
				}else{
					current = (current+1);
				}
			}

			// Move left
			function moveLeft(times){
				busy = true;

				// Set easing type and easing speed
				eazing = '';
				zpeed = opt.speed;
				if(easingplugin){
					if(times=='twice'){
						eazing = opt.move_twice_easein;
						zpeed = Math.round(opt.speed*0.5);
					}else if(times=='twice_end'){
						eazing = opt.move_twice_easeout;
					}else{
						eazing = opt.easing;
					}
				}

				// Pause autoplay
				if(opt.autoplay){
					stopInterval();
				}

				// Set next item number
				if( current == 3 ){
					next = items;
				}else if( current == 2 ){
					next = (items-1);
					if(next < 1){next = items;}
				}else if( current == 1 ){
					next = (items-2);
					if(next < 1){next = items;}
				}
				else{
					next = (current-3);
				}

				// Move
				$('#'+item5id).removeAttr('id').addClass('remove').css('z-index',-1);

				$newitem5 = $('#'+item4id);
				$newitem5.attr('id',item5id).stop().animate({ opacity:opt.back_opac, left:item5_pos+'px', top:back_top },zpeed,eazing)
					.find('img').stop().animate({ width:back_img_width+'px', height:back_img_height+'px', margin:back_margin+'px', opacity:1 },zpeed,eazing)
					.end().find('h6:visible').stop().animate({ 'font-size':back_header },zpeed,eazing);
				if(ie6){ $newitem5.find('span:visible').stop().animate(ie6_back_span_animate,zpeed,eazing); }
				else{ $newitem5.find('span').stop().animate(back_span_animate,zpeed,eazing); }
				setTimeout( function(){ $newitem5.css('z-index',1); }, (zpeed/4));

				$newitem4 = $('#'+item3id);
				$newitem4.attr('id',item4id).stop().animate({ opacity:opt.behind_opac, left:item4_pos+'px', top:behind_top },zpeed,eazing)
					.find('img').stop().animate({ width:behind_img_width+'px', height:behind_img_height+'px', margin:behind_margin+'px', opacity:1 },zpeed,eazing)
					.end().find('h6:visible').stop().animate({ 'font-size':behind_header },zpeed,eazing);
				if(ie6){ $newitem4.find('span:visible').stop().animate(ie6_behind_span_animate,zpeed,eazing); }
				else{ $newitem4.find('span').stop().animate(behind_span_animate,zpeed,eazing); }
				setTimeout( function(){ $newitem4.css('z-index',2); }, (zpeed/4));

				$newitem3 = $('#'+item2id);
				$newitem3.attr('id',item3id).stop().animate({ opacity:1, left:item3_pos+'px', top:front_top },zpeed,eazing)
					.find('img').stop().animate({ width:front_img_width+'px', height:front_img_height+'px', margin:front_margin+'px', opacity:1 },zpeed,eazing)
					.end().find('h6:visible').stop().animate({ 'font-size':front_header },zpeed,eazing);
				if(ie6){ $newitem3.find('span:visible').stop().animate(ie6_front_span_animate,zpeed,eazing); }
				else{ $newitem3.find('span').stop().animate(front_span_animate,zpeed,eazing); }
				setTimeout( function(){ $newitem3.css('z-index',3); }, (zpeed/4));

				$newitem2 = $('#'+item1id);
				$newitem2.attr('id',item2id).stop().animate({ opacity:opt.behind_opac, left:item2_pos+'px', top:behind_top },zpeed,eazing)
					.find('img').stop().animate({width:behind_img_width+'px', height:behind_img_height+'px', margin:behind_margin+'px', opacity:1 },zpeed,eazing)
					.end().find('h6:visible').stop().animate({ 'font-size':behind_header },zpeed,eazing);
				if(ie6){ $newitem2.find('span:visible').stop().animate(ie6_behind_span_animate,zpeed,eazing); }
				else{ $newitem2.find('span').stop().animate(behind_span_animate,zpeed,eazing); }
				setTimeout( function(){ $newitem2.css('z-index',2); }, (zpeed/4));

				$li[next].clone()
					.attr('id',item1id)
					.prependTo($container)
					.show()
					.animate({ opacity:0, left:0, top:back_top },0)
					.animate({ opacity:opt.back_opac },zpeed,function(){
						// When done animating:
						// Remove pointer cursor from previous item
						$('#'+item4id+' a *').css({ cursor:'default' });
						// Continue autoplay
						if(opt.autoplay){
							startInterval();
						}
						// Move 2nd time if requested
						if(times=='twice'){
							moveLeft('twice_end');
						}
						// Add pointer cursor if front frame has a link
						else{
							$('#'+item3id+' a *').css({ cursor:'pointer' });
						}
						if(!$('#'+item3id).is(":animated")){
							// Reenable click events
							busy = false;
							// Make sure old items are removed
							$('.remove').stop().fadeOut(zpeed,function(){ $(this).remove(); });
						}
					})
					.find('img').animate({ width:back_img_width+'px', height:back_img_height+'px', margin:back_margin+'px', opacity:1 },0)
					.end().find('h6:visible').css({ 'font-size':back_header });
				if(ie6){ $('#'+item1id).find('span:visible').animate(ie6_back_span_animate,0); }
				else{ $('#'+item1id).find('span').animate(back_span_animate,0); }

				// Remove the out of range item
				$('.remove').fadeOut( zpeed,function(){ $(this).remove(); });

				// Set new current
				if(current==1){
					current = items;
				}else{
					current = (current-1);
				}
			}

// ACTIONS

			// Frame 1 click (move 2 steps left)
			$('#'+item1id).live('click',function(){
				if(opt.freescroll || !busy){
					moveLeft('twice');
				}
			});

			// Frame 2 click (move 1 step left)
			$('#'+item2id).live('click',function(){
				if(opt.freescroll || !busy){
					moveLeft();
				}
			});

			// Frame 4 click (move 1 step right)
			$('#'+item4id).live('click',function(){
				if(opt.freescroll || !busy){
					moveRight();
				}
			});

			// Frame 5 click (move 2 steps right)
			$('#'+item5id).live('click',function(){
				if(opt.freescroll || !busy){
					moveRight('twice');
				}
			});

			$('#'+item3id).live('hover', function(event){
				// Mouse-over center frame: zoom in
				if(event.type == 'mouseover' && !busy){
					if(opt.autoplay){
						stopInterval();
					}
					$(this).addClass('zoomed')
						.stop(true,true).animate({ left:'-='+(front_img_width*(opt.hovergrowth/2))+'px', top:'-='+(front_img_height*opt.hovergrowth)+'px' },hoverspeed)
						.find('img').stop().animate({ width:(front_img_width*(1+opt.hovergrowth))+'px', height:(front_img_height*(1+opt.hovergrowth))+'px' },hoverspeed);
					$('#'+item2id).stop(true,true).animate({ left:'-='+(behind_img_width*opt.hovergrowth)+'px' },hoverspeed);
					$('#'+item4id).stop(true,true).animate({ left:'+='+(behind_img_width*opt.hovergrowth)+'px' },hoverspeed);
					// Set span width for IE6
					if(ie6){
						iegrow = Math.round(opt.hovergrowth*front_img_width);
						$(this).find('span:visible').animate({ width:'+='+iegrow },hoverspeed);
					}
				}
				// Mouse-out center frame: zoom out
				else if(!busy){
					if(opt.autoplay){
						startInterval();
					}
					$(this).stop().animate({ left:item3_pos+'px', top:front_top },hoverspeed)
						.find('img').stop().animate({ width:front_img_width+'px', height:front_img_height+'px' },hoverspeed,function(){ $('#'+item3id).removeClass('zoomed'); });
					$('#'+item2id).stop().animate({ left:item2_pos },hoverspeed);
					$('#'+item4id).stop().animate({ left:item4_pos },hoverspeed);
					// Set span width for IE6
					if(ie6){
						iegrow = Math.round(opt.hovergrowth*front_img_width);
						$container.find('.zoomed span:visible').animate({ width:'-='+iegrow },hoverspeed);
					}
				}
			});

			// Also zoom in if center frame is slided in under your cursor (Excluding IE)
			if(!ie){
				$('#'+item3id+':not(.zoomed)').live('mousemove', function(){ $('#'+item3id).mouseover(); });
			}

			// Prevent anchor links except for frame 3
			$('#'+item1id+' a, #'+item2id+' a, #'+item4id+' a, #'+item5id+' a').live('click',function(event){
				event.preventDefault();
			});

			// Keystrokes
			$(document).keydown(function(event){
				// Enter key = move right
				if( event.keyCode==13 ){ $('#'+item4id).click(); }
				// Space key = move right
				if( event.keyCode==32 ){ event.preventDefault(); $('#'+item4id).click(); }
				// Left arrow = move left
				if( event.keyCode==37 ){ event.preventDefault(); $('#'+item2id).click(); }
				// Right arrow = move right
				if( event.keyCode==39 ){ event.preventDefault(); $('#'+item4id).click(); }
			});

			// Initiate first autoplay
			if(opt.autoplay){
				startInterval();
			}

		// End plugin wrap
		});
	}
})(jQuery);