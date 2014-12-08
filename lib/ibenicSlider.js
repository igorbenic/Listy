/*!
 * ibenic Slider
 * Original author: @igorbenic
 * 
 * Licensed under the MIT license
 */


// the semi-colon before the function invocation is a safety 
// net against concatenated scripts and/or other plugins 
// that are not closed properly.
;(function ( $, window, document, undefined ) {
    
    // undefined is used here as the undefined global 
    // variable in ECMAScript 3 and is mutable (i.e. it can 
    // be changed by someone else). undefined isn't really 
    // being passed in so we can ensure that its value is 
    // truly undefined. In ES5, undefined can no longer be 
    // modified.
    
    // window and document are passed through as local 
    // variables rather than as globals, because this (slightly) 
    // quickens the resolution process and can be more 
    // efficiently minified (especially when both are 
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'ibenicSlider',
        defaults = {
            itemNo: 3,
            resize: true,
            handleLeft: '.goLeft',
            handleRight: '.goRight',
            itemSlideNo: 1,
            container: null,
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        var self = this;
        this.element = element;
        
        this.ul = $(this.element).find("ul").first();
        this.initalItemW = this.ul.find("li").first().outerWidth(true);
        // jQuery has an extend method that merges the 
        // contents of two or more objects, storing the 
        // result in the first object. The first object 
        // is generally empty because we don't want to alter 
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;
        
        var $defaults =  $.extend( {}, defaults, options) ;
        this._defaults = $defaults;
       
        this._name = pluginName;
        
        this.init();
        this.events();
        this.resize = function(newV){
            
             
            if(self._defaults.itemNo < newV){
             self.options.itemNo = self._defaults.itemNo;
            } else {
            self.options.itemNo = newV;
            }
          
            if(self._defaults.itemSlideNo > newV){
                self.options.itemSlideNo = newV;
            } else {
            	self.options.itemSlideNo = self._defaults.itemSlideNo;
            }
           self.init();
        }
        
        if(this.options.resize){
            var ww = $(window).width();
            
                
                
                var itemNo = Math.floor(ww/self.itemWidth);
                 
                if(itemNo == 0){
                	itemNo = 1;

                	
                }
                self.resize(itemNo);
            
          $(window).resize( function(e){
           var ww = $(window).width();
            
                
                
                var itemNo = Math.floor(ww/self.initalItemW);
               if(itemNo == 0){
                	itemNo = 1;
                	
                } 


                self.resize(itemNo);
            
        });
        }
      
    }

    Plugin.prototype.init = function () {
        // Place initialization logic here
        // You already have access to the DOM element and
        // the options via the instance, e.g. this.element 
        // and this.options
        this.itemWidth = $(this.element).find("li").first().outerWidth(true);
         var ww = $(window).width();
         ww = ww * 0.8;
        if(this.initalItemW > ww) {
        	this.itemWidth = ww;
        	$(this.element).find("li").outerWidth(ww);
        	$(this.element).find("li").css("height", "auto");
        } else {
        	this.itemWidth = this.initalItemW;
        	$(this.element).find("li").outerWidth(this.itemWidth);
        }
        this.containerWidth = this.options.itemNo * this.itemWidth;
        
        this.liNumber = $(this.element).find("li").length;
        this.ulWidth = this.liNumber * this.itemWidth;
        $(this.element).find("ul").width(this.ulWidth);
        $(this.element).width(this.containerWidth);
        if(this.options.container != null){
           $(this.options.container).width(this.containerWidth);
        }
        
    };
    
    Plugin.prototype.events = function(){
        var parseData = {
            options: this.options,
            element: this.element, 
            ul:this.ul,
            itemW: this.itemWidth 
            
        };
        $(this.options.handleLeft).click(parseData,this.goLeft);
        $(this.options.handleRight).click(parseData,this.goRight);
        
        
    };
    
 Plugin.prototype.goLeft = function(e){
            
            var $getMarginLeft = e.data.ul.css("marginLeft");
            var $getMarginLeftNumber = parseInt($getMarginLeft);
            var marginLeft = e.data.itemW  * e.data.options.itemSlideNo;
     if(marginLeft > Math.abs($getMarginLeftNumber)){
     marginLeft = Math.abs($getMarginLeftNumber)
     }
    
            var $getNewMarginLeft = $getMarginLeftNumber + marginLeft;
            e.data.ul.animate({
            marginLeft: $getNewMarginLeft+"px"
            });
     
          
            
    };
    
  Plugin.prototype.goRight = function(e){
            var itemNo = e.data.options.itemNo;
            var showW = itemNo * e.data.itemW;
            var totalW = e.data.ul.find("li").length * e.data.itemW;
      
            var $getMarginLeft = e.data.ul.css("marginLeft");
            var $getMarginLeftNumber = parseInt($getMarginLeft);
            var marginLeft = e.data.itemW  * e.data.options.itemSlideNo;
            var subedW = totalW + $getMarginLeftNumber;
            var leftW = subedW - showW;
      if(leftW < e.data.itemW  * e.data.options.itemSlideNo){
             marginLeft = leftW;
      }
      var $getNewMarginLeft = $getMarginLeftNumber - marginLeft;
              
                    
                    e.data.ul.animate({
                    marginLeft: $getNewMarginLeft+"px"
                    });
              
          
            
    };
    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );
