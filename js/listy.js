/*!
 * Listy Slider
 * Original author: @igorbenic
 * CodeCanyon: http://codecanyon.net/user/docttor
 * 
 */

;(function ( $, window, document, undefined ) {
    
   
    // Create the defaults once
    var pluginName = 'Listy',
        defaults = {
             configDefault: {items:3,sliding:3},
             config: {
                        "480": {
                           items: 1,
                           sliding: 1
                        },
                        "768": {
                          items:2,
                          sliding:1
                        },
                        "991": {
                          items: 3,
                          sliding: 2
                        },
                       

                    },
            handleLeft: '.goLeft',
            handleRight: '.goRight',
            container: null,
            animationDuration: 500,
            animationEffect: "linear",
            autoWidth: true,
            fullWidth: false,
            fullPage: false,
            vertical: false,
            timer: null,
            onKeyPress: false
        };

    // The actual plugin constructor
    function ListyPlugin( element, options ) {

        /**
         * Pointer to itself
         * @type object
         */
        var self = this;

        /**
         * The element on which the plugin is called
         * @type {String}
         */
        this.element = element;

        /**
         * Container of slider items
         * @type {jQuery Object}
         */
        this.slider = $(element).find("ul");

        /**
         * The number of items inside the slider
         * @type {Number}
         */
        this.numberOfItems = this.slider.children().length;

        /**
         * Options of this plugin. Here are the defaults extended by the provided options
         * @type {Object}
         */
        this.options = $.extend( {}, defaults, options) ;

        /**
         * Indicator if the slider is animating or not. 
         * By animating, it is meant if the current slider items are in motion or not.
         * @type {Boolean}
         */
        this.animating = false;

        /**
         * The configuration container for the resizing feature
         * @type {Object | null}
         */
        this.config = null;

        /**
         * Holder of the plugin name
         * @type {String}
         */
        this._name = pluginName;

        /**
         * Indicator of the items which are set to the left of the visible slider container
         * @type {Number}
         */
        this.itemsToLeft = 0;

        /**
         * Style property of the slider which is used to calculate the margin 
         * needed for the items that are hidden on the left side
         * @type {String}
         */
        this.property = "margin-left";


         /**
         * Container of the timeout function so that it can iterate through time
         */
        self.timerFunction;

        /**
         * The direction in which the slider items will move
         * @type {String}
         */
        self.timerDirection  ="r"
     
        /**
         * Check if the transition property is supported by the browser
         * @return {Boolean} Returns true if he browser supports the transition poperty
         */
        self.checkTransitionSupport = function(){
             var thisBody = document.body || document.documentElement,
            thisStyle = thisBody.style,
            support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
            return support;
        }

         /**
         * Check if the transform property is supported by the browser
         * @return {Boolean} Returns true if he browser supports the transform poperty
         */
       self.checkTransformSupport = function(){
             var thisBody = document.body || document.documentElement,
            thisStyle = thisBody.style,
            support = thisStyle.transform !== undefined || thisStyle.WebkitTransform !== undefined || thisStyle.MozTransform !== undefined || thisStyle.MsTransform !== undefined || thisStyle.OTransform !== undefined;
            return support;
        }
        
        /**
         * Sets the property to look after for the calculation. 
         */
        self.setProperty = function(){
            
            if(this.checkTransformSupport()){
                this.property = "transform";
            } else {
                if(this.options.vertical){
                    this.property = "margin-top";
                }
            }

        }

        /**
         * Gets the configuration for the current width
         * @return {Object} Configuration object with slider parameters for items
         */
        self.getConfigByWidth = function(){
            var windowWidth = $(window).width();
            var theConfig = null;
            if(this.options.config != null){
                for(width in this.options.config){
                    var numericWidth = parseInt(width);
                    if(numericWidth >= windowWidth){
                        theConfig = this.options.config[width];
                        break;
                    }
                }
            }
            
            if(theConfig == null){
                theConfig = this.options.configDefault;
            }
          
            return theConfig;
            
        }
        
        /**
         * Gets the width of the first element in the slider. 
         * All elements have the same width.
         * @return {[type]} [description]
         */
        self.getWidthOfElement = function(){
            
            return this.slider.children().first().outerWidth(true);
        }

        /**
         * Gets the height of the first element in the slider.
         * @return {[type]} [description]
         */
        self.getHeightOfElement = function(){
            
            return this.slider.children().first().outerHeight(true);
        }
        
        /**
         * Sets the width of the element if the options for full width or full page is set ON
         * It also sets the width on all elements and also sets the config to 1 item per slide.
         */
        self.setWidthOfElement = function(){
            
           if(self.options.fullWidth || self.options.fullPage){
                 var windowWidth = window.innerWidth;
                self.slider.children().outerWidth(windowWidth);
                self.config = {items:1, sliding:1};
           }

        }
        

        /**
         * Sets the height to all elements if the full page option is set ON
         */
        self.setHeightOfElement = function(){
            
           if(self.options.fullPage){
                var windowHeight = $(window).height();
                self.slider.children().height(windowHeight);
                $(self.element).height(windowHeight);
           }

        }

        /**
         * Sets the slider height if the full page option is set ON
         */
        self.setSliderHeight = function(){
            if(self.options.fullPage){
                var height = self.getHeightOfElement() * self.numberOfItems;
                self.slider.height(height);
            }
            
        }

        /**
         * Sets the slider width
         */
        self.setSliderWidth = function(){
            var width = this.getWidthOfElement() * this.numberOfItems;
            if(self.options.vertical){
                width = this.getWidthOfElement() * this.config.items;
            }
            this.slider.width(width);
            if(this.options.autoWidth){
               var containerWidth = this.getWidthOfElement() * self.config.items;
              
                $(self.element).width(containerWidth);
                if(this.options.container != null){
                    $(this.options.container).width(containerWidth);
                } 
            }
            
        }
        
        /**
         * Sets the slider transition property
         */
        self.setSliderTransition = function(){
            if(self.checkTransitionSupport()){
                var timing = self.options.animationDuration/1000;
                self.slider.css("transition",self.property + " "+timing+"s "+self.options.animationEffect);
                self.slider.css("-webkit-transition",self.property + " "+timing+"s "+self.options.animationEffect);
                self.slider.css("-moz-transition",self.property + " "+timing+"s "+self.options.animationEffect);
                self.slider.css("-o-transition",self.property + " "+timing+"s "+self.options.animationEffect);
            }
        }

        /**
         * Set slider CSS. It is used to move the items in the slider
         * @param {Object} arrayValue Holds the parameters to set the CSS
         */
        self.setSliderCSS = function(arrayValue){
             var valueArray = {};
             valueArray[this.property] = arrayValue.move;
             if(this.property == "transform"){
                valueArray[this.property] = "translate("+arrayValue.move+",0)";
             }
             this.slider.css(valueArray); 
        }

        /**
         * Sets the slider (width, height, transition)
         */
        self.setSlider = function(){
            self.setSliderWidth();
            self.setSliderHeight();
            self.setSliderTransition();
        }
        
        /**
         * Gets the margin-left property of the slider
         * @return {Number} The number of pixels the slider has on margin-left property
         */
        self.getMarginLeft = function(){
            return  parseInt(this.slider.css("marginLeft"));
        }
        
        /**
         * Gets the transform matrix 
         * @return {String} The string that holds the matrix configuration
         */
        self.getTransformMatrix = function(){
            return  this.slider.css("transform");
        }
        
        /**
         * Gets the value of X or Y coordinate
         * @param  {String} property The coordinate we are looking for
         * @return {Number}          The number of pixels
         */
        self.getMatrixProperty = function(property){
                var matrix = this.getTransformMatrix();
               
                    /*matrix: matrix(a, b, c, d, X, Y)*/
                    var matrixArray = matrix.split(", ");
                    var value = null;
                    switch(property){
                        case 'x':
                        case 'X':
                            value = parseInt(matrixArray[4]);
                            break;
                        case 'y':
                        case 'Y':
                            value = parseInt(matrixArray[5]);
                            break;
                        default:
                            break;
                    }
                    return value;
                
        }
        
        /**
         * Gets the property value.
         * @return {Number} The current number of pixels that are moved
         */
        self.getPropertyValue = function(){
            if(self.checkTransformSupport()){
                var coordinate = "x";
                if(self.options.vertical){
                    coordinate = "y";
                }
                var matrixValue = self.getMatrixProperty(coordinate);

                if(isNaN(matrixValue)){
                    return 0;
                }
                return matrixValue;
            } else {
                return self.getMarginLeft();
            }
        }
        
        /**
         * Gets the number of items that are hidden right of the viewable slider area
         * @return {Number} Number of items remaining
         */
        self.remainingItemsOnRight = function(){
            
            var totalItems = this.numberOfItems;

            var remainingItems = 0;
             if(this.options.vertical){
                remainingItems = Math.ceil(totalItems/this.config.items)-1;
             } else {
                remainingItems = totalItems - this.config.items;
             }
             
            remainingItems = remainingItems - this.itemsToLeft;
            
            return remainingItems;
        }
        
        /**
         * Slider initialization
         * @param  {Boolean} first Indicates if this is the first initialization to load events
         */
        self.init = function (first) {
            this.config = this.getConfigByWidth();
            this.setWidthOfElement();
            this.setHeightOfElement();
            this.setProperty();
            this.setSlider();
                 
            /**
             * Load the event triggers only on the first load of the current slider
             * By doing this we are stoping the event triggers to register once more on the same elements
             */
            if(first){
                this.events();
            }
        };
        
        /**
         * Move items to the left
         */
        self.goLeft = function(){
           
            var marginLeft = self.getPropertyValue();

            var itemsToSlide = 0;
            
            if(self.itemsToLeft > 0){
               
                if(self.config.sliding > self.itemsToLeft){
                    itemsToSlide = self.itemsToLeft;
                } else {
                    itemsToSlide = self.config.sliding;
                }
                
                var slidingWidth = self.getWidthOfElement() * itemsToSlide;

                var newMarginLeft = -1*self.itemsToLeft*self.getWidthOfElement() + slidingWidth;

                if(self.options.vertical){
                    itemsToSlide = 1;
                var slidingHeight= self.getHeightOfElement() * itemsToSlide;

                newMarginLeft = -1*self.itemsToLeft*self.getHeightOfElement() + slidingHeight;

                } 
                
                var itemsToLeft = self.itemsToLeft
                itemsToLeft -= itemsToSlide;
                self.animate(self.slider, {move: newMarginLeft+"px",itemsToLeft: itemsToLeft});
            }
        


        }
        
        /**
         * Move items to the right
         */
        self.goRight = function(){
            
            var marginLeft = self.getPropertyValue();
            var itemsToSlide = null;
            var remainingItemsOnRight = self.remainingItemsOnRight();
            if(remainingItemsOnRight > 0 ){
                
                if(self.config.sliding > remainingItemsOnRight){
                    itemsToSlide = remainingItemsOnRight;
                } else {
                    itemsToSlide = self.config.sliding;
                }

               

                var slidingWidth = self.getWidthOfElement() * itemsToSlide;
               
                newMarginLeft = -1*self.itemsToLeft*self.getWidthOfElement() - slidingWidth;
                
                if(self.options.vertical){
                    itemsToSlide = 1;
                     var slidingHeight= self.getHeightOfElement() * itemsToSlide;

                    newMarginLeft = -1*self.itemsToLeft*self.getHeightOfElement() - slidingHeight;

                }
               var itemsToLeft = self.itemsToLeft
                itemsToLeft += itemsToSlide;
               
                self.animate(self.slider, {move: newMarginLeft+"px",itemsToLeft: itemsToLeft});
            }
          
        }

        /**
         * Register the events to move left or right
         */
        self.events = function(){
            $(this.options.handleLeft).click(this.goLeft);
            $(this.options.handleRight).click(this.goRight);
            if(this.options.onKeyPress){
                            $(document).keydown(function(e) {
                                if(!self.options.vertical){
                                    switch(e.keyCode){
                                        case 37:
                                        self.goLeft();
                                        break;
                                        case 39:
                                        self.goRight();
                                        break;
                                    }
                                } else {
                                    switch(e.keyCode){
                                        case 38:
                                        self.goLeft();
                                        break;
                                        case 40:
                                        self.goRight();
                                    }
                                }
                            });
            }

            if(this.options.timer != null){
               self.timer();
            }
        }

       /**
        * Sets the timer on the slider
        */
        self.timer = function(){
             var timing = parseInt(self.options.timer);
             timerFunction = setTimeout(function() {
                   
                    var right = self.remainingItemsOnRight();
                    if(right == 0){
                        self.timerDirection = "l";
                    } 
                    if(self.itemsToLeft == 0){
                        self.timerDirection = "r";
                    }
                    if(self.timerDirection == "l"){
                        self.goLeft();
                    } else {
                        self.goRight();
                    }
                    
                    timerFunction = setTimeout(self.timer, timing);
            }, timing);
        }
        
        /**
         * Sets the margin left property
         */
        self.setMarginLeft = function(){
            var currentElementWidth = self.getWidthOfElement();
            var currentItemsToLeft = self.itemsToLeft;
            marginToAdd = 0;
            if(currentItemsToLeft > 0){
                var itemsShouldBeSeen = self.config.items;
                var itemsRight = self.remainingItemsOnRight();
                if(itemsRight < 0 ){
                    itemsRight = 0;
                }
                var itemsShouldBeLeft = self.numberOfItems - itemsShouldBeSeen - itemsRight;
               
                if(currentItemsToLeft > itemsShouldBeLeft){
                    /**/
                    var itemsWeSee = self.numberOfItems - currentItemsToLeft;
                    var itemsToAdd = self.config.items - itemsWeSee;
                    var totalItemsThatWeSee = itemsWeSee + itemsToAdd;
                    currentItemsToLeft = self.numberOfItems - totalItemsThatWeSee;
                }
                if(self.options.fullWidth){
                    currentElementWidth = $(window).width();
                }
                marginToAdd = currentItemsToLeft * currentElementWidth;
                self.setSliderCSS({move: "-"+marginToAdd+"px"});
              
            }
        }
        
        /**
         * Animates the items in motion
         * @param  {Object} element    the slider itself on which the animation will be done
         * @param  {Object} arrayValue parameters for the animation 
         */
        self.animate = function(element, arrayValue){
            var self = this;
            
            //If it is already animating, dont animate again
            if(!this.animating){
                var valueArray = {};
                self.itemsToLeft = arrayValue.itemsToLeft;
                valueArray[this.property] = arrayValue.move;
                if(this.checkTransitionSupport()){
                    if(this.checkTransformSupport()){
                        var transformValue = "translate("+arrayValue.move+",0)";
                        if(self.options.vertical){
                            transformValue = "translate(0,"+arrayValue.move+")";
                        }
                        valueArray[this.property] = transformValue;

                    } 
                    element.css(valueArray);
                    setTimeout(function() {
                        self.animating = false;

                    }, this.options.animationDuration);
                } else {
                    if(self.options.animationEffect != "liner" && self.options.animationEffect != "swing"){
                        self.options.animationEffect = "linear";
                    }
                    element.animate(
                        valueArray, 
                        {
                            duration: self.options.animationDuration, 
                            easing: self.options.animationEffect,
                            complete: function() {
                            self.animating = false;
                        }
                    });
                }
            }
                
        
    }
        
        /**
         * Creating the Slider
         */
        self.init(true);
       
       /**
        * Sets the new margin to the left (window is now smaller or wider)
        * Initialize the slider again, reconstruct it but do not register the events 
        */
        $(window).resize( function(e){
            
            self.setMarginLeft();
            self.init(false);
        });
        
        
       

       
    }

    
    
    
   



    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new ListyPlugin( this, options ));
            }
        });
    }

})( jQuery, window, document );
