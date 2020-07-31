(function(window, jQuery){
	$ = jQuery;

	function fe(el, options){
		if($(el).prop("tagName") !== 'FORM'){
			console.error("Tagname have to be form");
			return false;
    }
    
		this.options = {
      fe_root: options && options.fe_root ? options.fe_root : '/',
      ln: options && options.ln ? options.ln : 'en',
			show_tooltip: options && options.show_tooltip ? options.show_tooltip : true,
			reactive_form: options && options.reactive_form ? options.reactive_form : true
    }

		this.errors = [];
		this.el = el;
    this.$el = $(el);
    this.ln = {};

		this.init = function(ln){
      var self = this;
      self.ln = JSON.parse(ln);

			if(this.options.reactive_form){
				$(this.el.elements).each(function(i, val){
          $this = $(this);
          var type = $this.attr('type');
          if(type == "hidden" || type == "submit") return;

          self.addStyles($this);
          /*add event */
					$this.on('blur', function(event){
						self.validateOne(self, this)
					});
				});
			} 

			self.$el.on("submit", function(event){
				var va = self.validateAll(self);
				if(!va){
					event.preventDefault();
				}
			});

			self.$el.find('input').each(function(i, val){
				$(this).fltooltip();
			});
			self.$el.find('textarea').each(function(i, val){
				$(this).fltooltip();
			});
    }
    this.__loadJSON(this, this.init.bind(this), this.options.fe_root + 'ln/' + this.options.ln + '.json');
  }

  fe.prototype.removeStyles = function($el){
    var $elementWrap = $el.closest('.fe-element-wrap');
    $el.unwrap();
    $elementWrap.find(".fa").remove();
  }
   
  fe.prototype.addStyles = function($el){
    var height = $el.css('height');
    var width = $el.css('width');
    var minWidth = $el.css('min-width');
    var maxWidth = $el.css('max-width');
    var margin = $el.css('margin');
    var border = $el.css('border');
    if(!border){
      $el.css({
        border: '1px solid transparent'
      });
    }

    $el.addClass('fe-element');

    $el.wrap("<div class='fe-element-wrap'></div>");

    var $elementWrap = $el.closest('.fe-element-wrap');

    $elementWrap.css({
      height: height ? height : 'auto',
      width: width ? width : 'auto',
      minWidth: minWidth ? minWidth : 0,
      maxWidth: maxWidth ? maxWidth : 'none',
      margin: margin ? margin : 0
    });

    $el.after('<i class="fa fa-check faa-bounce animated faa-fast"></i>');
    $el.after('<i class="fa fa-close faa-bounce animated faa-fast"></i>');

    var $fa = $elementWrap.find('.fa');
    var faHeight = $fa.height();
    var faTop = parseInt(height) / 2 - faHeight / 2
    $fa.css({top: faTop }); 

    /* Check telephone number */
    if($el.attr('type') == 'tel' && $el.attr('placeholder')){
      var placeholder = $el.attr('placeholder');
      if ($el.mask) {
        $el.mask('+0 (000) 000 00 00', {placeholder: placeholder});
      }
    }
  }

	fe.prototype.beforeSubmit = function(){
		return this.validateAll(this);
	}

	fe.prototype.__loadJSON = function(self, callback, path) {  
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open('GET', path, true); 
		xobj.onreadystatechange = function () {
			if (xobj.readyState == 4 && xobj.status == "200") {
				callback(xobj.responseText);
				self.$el.trigger('fe_ln_loaded');
			}
		};
		xobj.send(null);  
	}

	fe.prototype.validateOne = function(self, el){
		var $el = $(el);
		var name = self.__getElementName(el);
		var val = $el.val();
		var is_error = false;
		/*Check required*/
		if($el.prop('required')){
			if(!val){
				self.addError(el, name + ' ' + self.ln.error_required);
				return;
			} 
    }
    


		/*check email*/
		if($el.attr('type') == 'email' ){
			if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)){
				self.addError(el, name + ' ' + self.ln.error_email);
				return;
			}
		}

		/*check repeat fields*/
		if($el.attr('repeat_to')){
			var compare_value = self.$el.find(['name="' + $el.attr('repeat_to') + '"']).val();

			if(compare_value != val){
				self.addError(el, name + ' ' + self.ln.repeat_error);
				return;
			}
		}
		

		if(!is_error){
			self.addSuccess(el);
		}
	}

	fe.prototype.__getElementName = function(el){
		var name = $(el).attr('fe-name');
		if(!name){
			name = $(el).attr('name');
		}

		return name;
	}

	fe.prototype.validateAll = function(self){
		self.resetErrors();

		var is_error = false;
		var errors = [];
		/*Check required fields*/

		self.$el.find('[required]').each(function(i, val){
      var $cur_el = $(this);
			var name = self.__getElementName(this);

			if(!$cur_el.val()){
				var error = name + " " + self.ln.error_required;
				self.addError(this, error);
				errors.push(error);
				is_error = true;
			}
		});

		/*Check emails*/
		self.$el.find('[type="email"]').each(function(i, val){
			var $cur_el = $(this);
			var name = self.__getElementName(this);

			if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($cur_el.val())){
				var error = name + " " + self.ln.error_email;
				self.addError(this, error);
				errors.push(error);
				is_error = true;
			}
		});

		self.$el.find('[repeat_to]').each(function(i, val){
			var $cur_el = $(this);
			var name = self.__getElementName(this);
			var compare_value = self.$el.find(['name="' + $cur_el.attr('repeat_to') + '"']).val();


			if(compare_value != $cur_el.val()){
				var error = name + ' ' + self.ln.repeat_error;
				self.addError(this,  error);
				errors.push(error);
				is_error = true;
			}
		});

		if(is_error){
      err_str = self.errorToString(errors);
      self.$el.trigger("fe-error", [err_str]);
			return false;
		}
    
    self.$el.trigger("fe-suc", [self.ln.success_send]);

		return true;
	}

	fe.prototype.errorToString = function(err_arr){
		var err_str = '';
		if(err_arr.length > 0){
			err_str += '<div class="fe-errors"><div class="fe-line">' + this.ln.error_send + '</div>';
			for(var i = 0; i < err_arr.length; i++){
				err_str += '<div class="fe-line">' + err_arr[i] + '</div>';
			}

			err_str += '</div>';
		}

		return err_str;
	}

	fe.prototype.addSuccess = function(el){
    var $el = $(el);
    var $par = $el.closest('.fe-element-wrap');
		$par.removeClass('fe-error');
		$par.addClass('fe-suc');
		this.removeNotification($el);
	}

	fe.prototype.addError = function(el, error_message){
    var $el = $(el);
    var $par = $el.closest('.fe-element-wrap');
    $par.removeClass('fe-suc');
		$par.addClass('fe-error');
		var cl = $el.attr('name');
		this.errors.push(error_message);
		if(this.options.show_tooltip){
			$el.attr('data-original-title', error_message).attr('title', error_message).fltooltip('show');
		}
	}

	fe.prototype.removeNotification = function($el){
		$el.fltooltip('hide');
	}

	fe.prototype.resetErrors = function(){
		var self = this;
		this.errors = [];
		for(var i = 0; i < this.el.elements.length; i++){
			$(self.el.elements[i]).removeClass('fe-error');
		}

		this.$el.find('input').each(function(i, val){
			$(this).fltooltip('hide');
		});
		this.$el.find('textarea').each(function(i, val){
			$(this).fltooltip('hide');
		});
	}

  /*functions for external usage*/
	fe.prototype.validate = function(){
		var res = this.validateAll(this);
		return res;
	}

	window.fe = fe;
})(window, jQuery);
