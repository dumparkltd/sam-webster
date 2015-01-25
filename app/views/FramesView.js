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
      this.default_options = {frame_offset: 300};
      this.options = $.extend(true, this.default_options, options);               
      
      // frames
      this.frames = {};     
      
      // init scroll position
      this.lastScrollTop = $(document).scrollTop();;
      
      // bind scroll event
      $(window).scroll(_.debounce(_.bind(this.scrolled, this),1));  
            
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
      
      // set up frames
      var that = this;
      this.$('.frames .frame').each(function(index){
        that.frames[index] = {
          $frame : $(this),          
          top_initial : index*that.options.frame_offset,
          top_after : (index+1)*that.options.frame_offset,
          active: false
        };
        $(this).css('top',index*that.options.frame_offset);
      });
      this.$('.frames .frame').first().addClass('visible');
      
      // set up frames container
      this.$('.frames').height(
          (this.$('.frames .frame').length)*this.options.frame_offset
        + this.$('.frames .frame').last().height()
      );
      this.$('.frames').addClass('init');
    },
    scrolled : function(){
      this.$('.frames').addClass('active'); 
      var that = this;
      
      var scrollTop = $(document).scrollTop();;
      var scrollDown = (scrollTop > that.lastScrollTop) ? true : false;
      // adjust view-height 
      if ( scrollTop >= this.$el.offset().top
        && scrollTop < this.$el.offset().top + this.$el.height()
      ) {
        //this.$el.height(this.$el.height() + scrollTop - this.lastScrollTop); 
      }       
      
      // adjust frames
      _.each(this.frames,function(frame){
        // if inside frame 
        if ( !frame.active 
          &&    (scrollDown // down
                  && scrollTop >= frame.top_initial + that.$el.offset().top
                  && scrollTop <  frame.top_initial + that.$el.offset().top + that.options.frame_offset)  
            ||  (!scrollDown // up
                  && scrollTop >= frame.top_after + that.$el.offset().top - that.options.frame_offset
                  && scrollTop <  frame.top_after + that.$el.offset().top )  
        ) {      
          console.log('entering frame ' + frame.$frame.attr('class'));
          frame.active = true;
          
          frame.$frame.css('top',frame.$frame.parent().offset().top - that.$el.offset().top + 'px');          
          // fix frame
          frame.$frame.addClass('fixed');
          // show frame
          that.$('.frames .frame').removeClass('visible');
          frame.$frame.addClass('visible');  
        }


        // if leaving frame scrolling down
        if (frame.active && scrollDown ){
          if ( scrollTop >= frame.top_initial + that.$el.offset().top + that.options.frame_offset) {
            console.log('leaving frame scrolling down ' + frame.$frame.attr('class'));
            frame.active = false;
            // 1. unfix frame
            frame.$frame.removeClass('fixed');
            // 2. assign initial position + frame_offset
            frame.$frame.css('top',frame.top_after);

          }
        // if leaving frame scrolling up
        } else if (frame.active && !scrollDown ){
          if (scrollTop < frame.top_after + that.$el.offset().top - that.options.frame_offset) {
            console.log('leaving frame scrolling up ' + frame.$frame.attr('class'));
            
            frame.active = false;
            // 1. unfix frame
            frame.$frame.removeClass('fixed');
            // 2. assign initial position + frame_offset
            frame.$frame.css('top',frame.top_initial);            
          }
        }
      });
      this.lastScrollTop = scrollTop;        
  
    },
    goToFrameEvent : function(e){
      e.preventDefault();      
      this.goToFrame($(e.currentTarget).data('target'))
    },
    goToFrame : function(frameIndex, duration, callback) {
      if (typeof this.frames[frameIndex] !== 'undefined') {
        $(this.el).trigger('scrollEvent',{
          offset:this.$el.offset().top + this.frames[frameIndex].top_initial,
          duration: typeof duration !== 'undefined' ? duration : 0,
          callback: callback
        });
      }
    },            
    
  });

  return FramesView;
  
});