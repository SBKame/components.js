/*!
* components.js
*
* @version beta
* @author GNOME FACTORY
*/

(function($){

	/*
	 *	Image Rollover
	 */
	$.fn.rollover = function(options){
		var opt = options ? options : {};
		return this.each(function(){
			new $.Rollover(this,opt);
		});
	};
	
	$.Rollover = function(_this,opt){
		this.$elem = $(_this);
		this.setting = $.extend(this.setting,opt);
		this.src = this.$elem.attr('src');
		this.ovSrc = this.src.replace(/\.[a-z]+$/, this.setting.suffix + '$&');
		this.init();
	};
	
	$.Rollover.prototype = {
		init : function(){
			var self = this;
			this.preload();
			
						
			this.$elem.mouseover(function(){
				self.over();
			}).mouseout(function(){
				if( !$(this).is('.keep') ){
					self.out();
				};
			});
		},
		preload : function(){
			$('<img />').attr('src',this.ovSrc);
		},
		over : function(){
			this.$elem.attr('src',this.ovSrc);
		},
		out : function(keep){
			if( !keep ){
				this.$elem.attr('src',this.src);
			};
		},
		setting : {
			suffix: "_on",
			keep: false
		}
	};


	/*
	 *	Opacity Rollover
	 */	
	$.fn.opover = function(options){
		var settings = {
			speed : 0,
			opacity : 0.7
		};
		var opt = options ? options : {};
		settings = $.extend( settings, opt );
		this.hover(function(){
			$(this).animate({ opacity : settings.opacity }, settings.speed);
		},function(){
			$(this).animate({ opacity : 1 }, settings.speed);
		});
	};


	/*
	 *	Slide Scroll
	 */
	$.slideScroll = function( options ){
		var $a = $('a[href^="#"]');
		var slider = $.support.boxModel ? navigator.appName.match(/Opera/) ? "html" : "html,body" : "body";
		var opt = options || {};
		var settings = {
			easing : 'normal',
			speed : 300
		};
		settings = $.extend( settings, opt );
		$a.click(function(e){
			e.preventDefault();
			var _target = $(this).attr('href');
			var _pos = $(_target).offset().top;
			$(slider).animate({
				scrollTop : _pos
			},{
				duration : settings.speed,
				easing : settings.easing,
				queue : false
			});
		});
	};


	/*
	 *	Linker
	 */	
	$.linker = function( options ){
		this.settings = {
			icon : {
				blank : '/img/icon_blank.gif',
				pdf : '/img/icon_pdf.gif',
				word : '/img/icon_doc.gif',
				excel : '/img/icon_xls.gif'
			},
			spanClass : '.anchorInner',
			notIconClass : '.notIcon',
			blankLink : [],
			extendLink : '.boxLink'
		};
		var opt = options || {};
		this.settings = $.extend( this.settings, opt );
		this.domain = document.domain;
		this.init();
	};

	$.linker.prototype = {
		init : function(){
			var self = this;
			$(this.target()).each(function(){
				$(this).data('blank',true);
				if( self.settings.icon && !$(this).is( self.settings.notIconClass+' a') && !$(this).is( self.settings.notIconClass ) ){
					self.setIcon( this );
				};
			}).click(function(e){
				e.preventDefault();
				var _href = $(this).attr('href');
				window.open( _href, '_blank' );
			});

			this.extendLink();
		},
		target : function(){
			var _target = new String;
			_target =	'a[href ^= "http://"]:not([href *= "'+ this.domain +'"]),' +
						'a[href ^= "https://"]:not([href *= "'+ this.domain +'"]),' +
						this.blankLinks() +
			  			'a[href $= ".pdf"],' +
						'a[href $= ".xls"], a[href $= ".xlsx"],' +
						'a[href $= ".doc"],a[href $= ".docx"]';
			return _target;
		},
		blankLinks : function(){
			var blankLinks = new String;
			var len = this.settings.blankLink.length;
			for( var i = -1; ++i < len; ){
				blankLinks += 'a[href *= "'+ this.domain + this.settings.blankLink[i] +'"],';
			};
			return blankLinks;
		},
		setIcon : function( _this ){
			var self = this;
			var image, _src, _alt;
			if( $(_this).is('[href $= ".pdf"]') ){
				_src = this.settings.icon.pdf;
				_alt = 'PDF\u30d5\u30a1\u30a4\u30eb\u304c\u958b\u304d\u307e\u3059';
			}else if( $(_this).is('[href $= ".xls"]') || $(_this).is('[href $= ".xlsx"]') ){
				_src = this.settings.icon.excel;
				_alt = 'EXCEL\u30d5\u30a1\u30a4\u30eb\u304c\u958b\u304d\u307e\u3059';	
			}else if( $(_this).is('[href $= ".doc"]') || $(_this).is('[href $= ".docx"]') ){
				_src = this.settings.icon.word;
				_alt = 'WORD\u30d5\u30a1\u30a4\u30eb\u304c\u958b\u304d\u307e\u3059';
			}else {
				_src = this.settings.icon.blank;
				_alt = '\u5225\u30a6\u30a3\u30f3\u30c9\u30a6\u3067\u958b\u304d\u307e\u3059';
			};
			image = '<img src="' +_src+ '" alt="' +_alt+ '" />';
			if( $(_this).css('text-decoration') == 'underline' ){
				$(_this).addClass('noLine');
			};
			$(_this).not(':has("img")').wrapInner('<span class="'+ self.settings.spanClass.replace(/^\./,'') +'" />').append( image );
			return;
		},
		extendLink : function(){
			$('a',this.settings.extendLink).off('click');
			$(this.settings.extendLink).click(function(){
				var $a = $(this).find('a');
				var _href = $a.attr('href');
				if( $a.data('blank') ){
					window.open( _href, '_blank' );
				}else{
					window.open( _href, '_self' );
				};
				return false;
			});
		}
	};


	/*
	 *	Navigation Active
	 */
	$.NavActive = function( _this, opt ){
		this.$wrap = $(_this);
		this.$a = this.$wrap.find('a');
		this.settings = $.extend( this.settings, opt );
		if( this.$a.is(':has("img")') ){
			this.isImage = true;
			this.$a.children('img').rollover();
		};
		this.sort();
	};

	$.NavActive.prototype = {
		sort : function(){
			var self = this;
			var _href;
			var _globalURL = this.locate('path');
			this.$a.each(function(){
				_href = $(this).attr('href').replace( self.locate('location') , '' );
				if( _globalURL.search( _href ) == 0 ){
					$(this).addClass('active');
					if( self.isImage ){
						$(this).children('img').addClass('keep').trigger('mouseover');
					}
				};
			});
		},
		locate : function( _call ){
			if( !_call ) return false;
			switch( _call ){
				case 'path' :
					return this.url.path;
				case 'location' :
					return this.url.protocol + '//' + this.url.domain;
				case 'domain' :
					return this.url.domain;
				case 'protocol' :
					return this.url.protocol;
			};
		},
		url : {
			protocol : location.protocol,
			domain : location.hostname,
			path : location.pathname
		},
		isImage : false,
		settings : {
			activeClass : 'active'
		}
	};

	$.fn.navActive = function( options ){
		var opt = options || {};
		return this.each(function(){
			new $.NavActive( this, opt );
		});
	};


	/*
	 *	Tab Navigator
	 */
	$.JTabNavigator = function(_this,opt){
		this.content = _this;
		this.setting = $.extend(this.setting,opt);
		this.$nav = $('.'+this.setting.navClass, this.content).find('a');
		this.isImage = this.$nav.children('img').length ? true : false;
		this._hash = location.hash;
		this.hashSwitch = $(this._hash,this.content).length ? true : false;		
		this.init();
	};
	
	$.JTabNavigator.prototype = {
		init: function(){
			var self = this;
			
			this.$nav.each(function(i){
				var target = new String,
					img = new Object;
				
				target = $(this).attr('href');
				if( self.isImage ){
					img = $(this).children('img');
					img.rollover({
						suffix : self.setting.imgSuffix
					});
				};
				
				if( (!self.hashSwitch && i==0) || (self.hashSwitch && target == self._hash) ){
					self.show(this,target,img);
					if(self.hashSwitch){
						var _top = $('body').offset().top;
						var _body = $.support.boxModel ? navigator.appName.match(/Opera/) ? "html" : "html,body" : "body";
						$(_body).scrollTop(_top);
					};
				}else{
					self.hide(this,target,img);
				};
				
			}).click(function(){
				var $target = new String,
					$img = new Object,
					$other = new Object,
					$otherTarget = new String,
					$otherImg = new Object;
				
				$target = $(this).attr('href');
				$other = self.$nav.not($(this));
				$other.each(function(){
					$otherTarget += $(this).attr('href')+',';
				});
								
				if(self.isImage){
					$img = $(this).children('img');
					$otherImg = $other.children('img');
				};
				
				self.show(this,$target,$img);
				self.hide($other,$otherTarget,$otherImg);
				
				return false;
			});
		},
		show : function(nav,target,img){
			if(this.isImage){
				$(img).addClass('keep').trigger('mouseover');
			};
			
			$(target)
				.css({
					"position": "static",
					"top": null,
					"left": null
				})
				.add(nav)
				.addClass(this.setting.activeClass);
		},
		hide : function(nav,target,img){
			if(this.isImage){
				$(img).removeClass('keep').trigger('mouseout');
			};
			
			$(target)
				.css({
					"position": "absolute",
					"top": "-9999px",
					"left": "-9999px"
				})
				.add(nav)
				.removeClass(this.setting.activeClass);
		},
		setting : {
			activeClass : "active",
			navClass : "tab",
			imgSuffix : '_on'
		}
	};
	
	$.fn.jTabNavigator = function(options){
		if( $(this).length < 1 ){
			return false;
		};
		var opt = options ? options : {};
		return this.each(function(){
			new $.JTabNavigator(this,opt);
		});	
	};


	/*
	 *	Flat Columns
	 */
	$.fn.flatColumns = function(options){
		var opt = options ? options : {};
		this.each(function(){
			return new $.FlatColumns(this,opt);
		});
	};

	$.FlatColumns = function(_this,opt){
		var self = this;
		this.$elem = $(_this);
		this.setting = $.extend({
			'target' : false,
			'column' : -1
		},opt);
		this.$target = this.setting.target ? this.$elem.find(self.setting.target) : this.$elem.children();
		this.init();
	};

	$.FlatColumns.prototype = {
		init : function(){
			var self = this;
			this.isSet = false;
			this.group = [];
			this.tmp = [];
			this._slice();
			this.send();
		},
		_slice : function(){
			var self = this;
			var num = this.setting.column;
			
			self.$target.each(function(i){
				if( num ){
					self.isSet = (i+1)%num == 0 && (i+1)/num > 0;
				};
				self.tmp.push($(this));
				if( self.isSet ){
					self.group.push(self.tmp);
					self.tmp = [];
				};
			});
			if(this.tmp.length){
				this.group.push(this.tmp);
			};
		},
		send : function(){
			$.flatCore.flat(this.group);
			$.flatCore.observer.monitor(this.group);
		}
	};

	$.flatCore = {
		flat : function(group){
			var size = group.length;
			for( i=0; i<size; ++i ){
				var _max = 0;
				$(group[i]).each(function(){
					var _h = $(this).innerHeight();
					if( _h > _max ){
						_max = _h;
					};
				}).height(_max);
			};
		},
		reFlat : function(group){
			var size = group.length;
			//console.log(group.length)
			for( j=0;  j<size; ++j ){
				$(group[j]).height('auto');
			};
			this.flat(group);
		},
		observer : {
			$elem : $('<div id="observer" />').text('observer').css({
				'position':'absolute',
				'top':'-9999px',
				'left':'-9999px'
			}),
			init : function(){
				var $base = $('#contents').length ? $('#contents') : $('body');
				$base.append($.flatCore.observer.$elem);
				this._size = $('#observer').height();
				this.keep = [];
			},
			monitor : function(group){
				this.keep.push(group);
				var self = this;
				setInterval(function(){
					if(self.isChange()){
						var size = self.keep.length;
						for( k=0; k<size; ++k ){
							$.flatCore.reFlat(self.keep[k]);
						};
					}
				},500);
			},
			isChange : function(){
				var $obj = $('#observer');
				var _size = $obj.height();
				if(this._size == _size){
					return false;
				}else{
					this._size = _size;
					return true;
				}
			}
		}
	}

	$.flatCore.observer.init();


	/*
	 *	Font Size Switch
	 */
	$.fn.fontSize = function(options){
		var opt = options ? options : {};
		var setting = {
			'targetArea' : '#contents',
			'sizes' : '87%,100%,114%',
			'btnId' : 'fontSmall,fontMidium,fontLarge'
		};	
		$.extend(setting,opt);
		
		var defoSize;
		var cookies = document.cookie.split("; ");
		for(var i=0; i<cookies.length; ++i){
			var cookieStr = cookies[i].split('=');
			if( cookieStr[0] == 'fontSize' ){
				defoSize = cookieStr[1];
				break;
			};
		};	
		
		var btnTxt = ['\u5c0f','\u4e2d','\u5927'];
		var sizeArr = setting.sizes.split(',');
		var idArr = setting.btnId.split(',');
		var btnNum = sizeArr.length;
		if( btnNum < idArr.length ){
			idArr.splice(1,1);
			btnTxt.splice(1,1);
		};
		
		$(this).append('<ul id="fontSizeBtn" />');
		
		
		for( i=0; i<btnNum; ++i ){
			$('#fontSizeBtn').append('<li id="' + idArr[i] + '"><span>' + btnTxt[i] + '</span></li>');
			$('#'+idArr[i]).data('size',sizeArr[i]);
			if( defoSize == 'undefined' && sizeArr[i] == '100%' ){
				defoSize = sizeArr[i];
			};
		};
		
		var $btn = $('#fontSizeBtn').children('li');
		$btn.on('click',function(){
			var changeSize = $(this).data('size');
			$( setting.targetArea ).css('font-size',changeSize);
			document.cookie = 'fontSize='+changeSize;
		});
		
		$( setting.targetArea ).css('font-size',defoSize);
	};



	/*
	 *	Accordion
	 */
	$.fn.jAccordion = function(options){
		return this.each(function(){
			new $.JAccordion(this,options);
		});
	};
	
	$.JAccordion = function(_this,options){
		this.setting = $.extend({
			headClass: 'head',
			openClass: 'open',
			closeClass: 'close',
			speed: 0,
			easing: 'swing',
			autoClose: false
		},options);
		
		this.wrap = $(_this);
		this.head = this.wrap.find('.'+this.setting.headClass);
		this.content = this.head.next();
		this.init();
	};
	
	$.JAccordion.prototype = {
		init: function(){
			var self = this;
			
			this.head.css('cursor','pointer');
			
			this.content.each(function(){
				var _head = $(this).prev('.'+self.setting.headClass);
				
				if($(this).hasClass(self.setting.openClass)){
					_head.addClass(self.setting.openClass);
				}else{
					$(this)
						.add(_head)
						.addClass(self.setting.closeClass)
						.end()
						.hide();
				};
			});
			
			this.action();
		},
		action: function(){
			var self = this;
			
			this.head.click(function(){
				var target = $(this).next();
				
				if($(this).hasClass(self.setting.openClass)){
					self.close($(this),target);
				}else{
					self.open($(this),target);
					if(self.setting.autoClose){
						var clicked = $(this);
						var parent_head = clicked.closest(self.content).prev();
						var close_head = $(self.head,self.wrap).not(clicked).not(parent_head);
						var close_target = close_head.next();
						self.close(close_head,close_target);
					};
				};
			});
		},
		open: function(head,content){
			content
				.animate({
					height: 'show'
				},{
					duration: this.setting.speed,
					easing: this.setting.easing,
					queue: false
				})
				.add(head)
				.removeClass(this.setting.closeClass)
				.addClass(this.setting.openClass);
		},
		close: function(head,content){
			content
				.animate({
					height: 'hide'
				},{
					duration: this.setting.speed,
					easing: this.setting.easing,
					queue: false
				})
				.add(head)
				.removeClass(this.setting.openClass)
				.addClass(this.setting.closeClass);
		}
	};

}(jQuery));
