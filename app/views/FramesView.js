define([
  'jquery','underscore','backbone'  
], function($, _, Backbone ){
  var FramesView = Backbone.View.extend({
    isFramesView : true,    
    events : {
      "click .frame-nav a" : "goToFrameEvent"
    },    
    constructor: function(options) {   
      // options
      this.default_options = {
        enable_scrolling: false, // turn scrolling on and off
        scroll_distance: 300, // the distance between frame updates, if scrolling enabled
        frames_offset_top:0, // the distance of the frames section to the top
        frames_offset_bottom:0 // the distance of the frames section to the bottom
      };
      this.options = $.extend(true, this.default_options, options);               
      
      // make sure scrolling offset makes sense
      if (this.options.enable_scrolling) {
        this.options.enable_scrolling = (this.options.scroll_distance < 10 ) ? false : true;
      }
      
      // frames
      this.frames = [];     
      
      // init scroll position
      if (this.options.enable_scrolling){
        this.lastScrollTop = $(document).scrollTop();;
      
        // bind scroll event
        $(window).scroll(_.debounce(_.bind(this.scrolled, this),1));  
      }      
      // Call the original constructor
      Backbone.View.apply(this, arguments);         
    },        
    render : function(){
      this.setupFrame();
    },
    setupFrames : function(){
      // set height for full-height frames
      this.$('.frame.fill-screen').each(function(){
        $(this).css('min-height',$(window).height());
      });          
      
      
      // if scrolling
      if (this.options.enable_scrolling){
        // calculate offsets
        this.options.frames_offset_top = this.options.frames_offset_top +
                  this.$('.frames-context-above').outerHeight();
        this.options.frames_offset_bottom = this.options.frames_offset_bottom +
                  this.$('.frames-context-above').outerHeight();
                  
        // set up frames
        var that = this;
        this.$('.frames .frame').each(function(index){
          //var frame_top = index*that.options.scroll_distance;
          that.frames[index] = {
            $frame  : $(this),          
            //top     : frame_top, // relative offset to frames           
            active  : false,
            height  : $(this).outerHeight()
          };
          $(this).css('top',that.options.frames_offset_top);        
        });
        this.$('.frames-wrapper').addClass('scrolling');
        
        // set element heights
        // height is height of frames section (incl scroll_distance) plus 
        var frames_height =
            (this.$('.frames .frame').length)*this.options.scroll_distance
          + this.frames[this.frames.length-1].height;
  
        this.$('.frames').height(frames_height);
                
        this.$('.frames-context-above ').height(this.options.frames_offset_top);
        this.$('.frames-context-below ').height(this.options.frames_offset_bottom);
        this.$('.frames-context-below-inner ').css('top',this.options.frames_offset_top + this.frames[0].height);
        
        // set wrapper height
        var wrapper_height = frames_height 
                + this.options.frames_offset_top      
                + this.options.frames_offset_bottom;
        this.$('.frames-wrapper').height(wrapper_height);      
        
        this.apparentHeight = this.frames[this.frames.length-1].height 
                + this.options.frames_offset_top      
                + this.options.frames_offset_bottom;
        
        console.log('wrapper_height '+ wrapper_height);
              
      // if not scrolling  
      } else {
        
        // set up frames     
        var that = this;
        this.$('.frames .frame').each(function(index){
          that.frames[index] = {
            $frame : $(this),          
            top_above : 0,
            top_below : 0
          };
        });        
      }
      this.frames[0].$frame.addClass('visible');
      
      
      this.$('.frames-wrapper').addClass('init');
    },
    scrolled : function(){
      if (this.options.enable_scrolling){

        var scrollTopRelative = $(document).scrollTop() - this.$el.offset().top;
        //var scrollDown = (scrollTopRelative > that.lastScrollTop) ? true : false;
               
        // when inside section 
        if ( scrollTopRelative > 0
          && scrollTopRelative <= this.apparentHeight + this.options.frames_offset_top
        ) {
          console.log('inside');
          if (!this.$('.frames-wrapper').hasClass('active')) {
            this.$('.frames-wrapper').addClass('active'); 
            this.$('.frames-wrapper').removeClass('below'); 
            this.$('.frames-wrapper').removeClass('above'); 
          }
          // calculate frame number 
          var index = 
            Math.max(
              Math.min(
                Math.floor((scrollTopRelative) / this.options.scroll_distance),
                this.frames.length-1),
              0);
          // show frame
          this.$('.frames .frame').removeClass('visible');
          this.frames[index].$frame.addClass('visible');
        // when outside section  
        } else {
          // show first when above
          if ( scrollTopRelative < 0) {
            console.log('above');
            this.$('.frames-wrapper').addClass('above'); 
            this.$('.frames .frame').removeClass('visible');
            this.frames[0].$frame.addClass('visible');                      
          }
          // show last when below
          if (scrollTopRelative >= this.apparentHeight + this.options.frames_offset_top) {
            console.log('below');
            this.$('.frames-wrapper').addClass('below');                                  
            this.$('.frames .frame').removeClass('visible');
            this.frames[this.frames.length-1].$frame.addClass('visible');          
          }          
          if (this.$('.frames-wrapper').hasClass('active')) {
            this.$('.frames-wrapper').removeClass('active');
          }
        }       
       
        this.lastScrollTop = scrollTopRelative; 
      }
    },
    goToFrameEvent : function(e){
      e.preventDefault();      
      this.goToFrame($(e.currentTarget).data('target'));
    },
    goToFrame : function(frameIndex, duration, callback) {
      if (this.options.enable_scrolling){
        if (typeof this.frames[frameIndex] !== 'undefined') {
          $(this.el).trigger('scrollEvent',{
            offset:this.offset_top + this.frames[frameIndex].top_above ,
            duration: typeof duration !== 'undefined' ? duration : 0,
            callback: callback
          });
        }
      } else {
        if (typeof this.frames[frameIndex] !== 'undefined') {
          this.frames[frameIndex].active = true;
          this.$('.frames .frame').removeClass('visible');          
          this.frames[frameIndex].$frame.addClass('visible');            
        }        
      }
    },            
    
  });

  return FramesView;
  
});