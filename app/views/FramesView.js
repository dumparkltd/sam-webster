define([
  'jquery','underscore','backbone'  
], function($, _, Backbone ){
  var FramesView = Backbone.View.extend({
    isFramesView : true,    
    events : {
      "click .frame-link" : "goToFrameEvent",
      "click .frame-next" : "goToNextFrameEvent",
      "click .frame-prev" : "goToPreviousFrameEvent"
    },    
    constructor: function(options) {   
      // options
      this.default_options = {
        fill_screen: false, //         
        scroll_distance: 300 // the distance between frame updates, if scrolling enabled
      };
      this.options = $.extend(true, this.default_options, options);               
      
      // frames
      this.currentFrame = 0; 
      this.el_height = 0;
      this.scrollLength = 0;
      this.skroll_data = [];            
      
      $(window).scroll(_.debounce(_.bind(this.scrolled, this),10));  
       
      // Call the original constructor
      Backbone.View.apply(this, arguments);          
    },  
    getHeight : function(){
      return this.scrollLength + this.el_height;
    },
    setupFrames : function(offset_top){      
      offset_top = typeof offset_top !== 'undefined' ? offset_top :this.options.offset_top;  
      
      // reset skroll data
      this.removeSkrollData();
      
      // set up frames
      var that = this;
      this.frames = [];   
      this.max_frame_height = 0;
      this.$('.frames .frame').each(function(index){
        that.frames[index] = {
          $frame  : $(this),
          skroll_data : []
        };
        that.max_frame_height = Math.max(that.max_frame_height,$(this).outerHeight());
      });
      
      var above_height      = this.$('.frames-context-above').outerHeight();      
      this.el_height        = above_height + this.$('.frames-context-below').outerHeight() + this.max_frame_height;      
      this.scrollLength     = this.frames.length * this.options.scroll_distance;      
      var offset_bottom     = offset_top    + this.scrollLength; // the bottom trigger
      var offset_end        = offset_bottom + this.el_height; 
      var offset_top_below  = above_height  + this.max_frame_height;
      
      // context above
      this.$('.frames-context-above ')
        .attr('data-0',               'top:'+ offset_top +'px')// before section: set it at top of element
        .attr('data-' + offset_top ,  'top:0px')// during set it to the top of the element
        .attr('data-' + offset_bottom,'top:0px')// keep it until the end of section            
        .attr('data-' + offset_end,   'top:-'+ this.el_height +'px');// move out of view
      // context below
      this.$('.frames-context-below ')
        .attr('data-0',               'top:'+ (offset_top + offset_top_below) +'px')// before section: set it at top of element  
        .attr('data-' + offset_top,   'top:'+ offset_top_below +'px')// during set it to the top of the element    
        .attr('data-' + offset_bottom,'top:'+ offset_top_below +'px')// keep it until the end of section   
        .attr('data-' + offset_end,   'top:-'+(this.el_height-offset_top_below)+'px'); 
      //remember skroll-data
      this.skroll_data.push('data-0');
      this.skroll_data.push('data-' + offset_top);
      this.skroll_data.push('data-' + offset_bottom);
      this.skroll_data.push('data-' + offset_end);
      
      // the frames
      var offset_top_frame = offset_top; // the top trigger for frames       
      _.each(this.frames,function(frame, index){
        // before section: set it at top of element           
        var offset_top_frame_new = offset_top_frame + that.options.scroll_distance;
        
        var display_top     = (index === 0) ? 'block' : 'none';
        var display_bottom  = (index+1 === that.frames.length) ? 'block' : 'none';
        frame.$frame
          .attr('data-0',
                'top:'  + (offset_top_frame + above_height) +'px;display:' + display_top)
          .attr('data-' + offset_top_frame, 
                'top:'  + above_height + 'px;display:block')
          .attr('data-' + offset_top_frame_new, 
                'top:'  + above_height + 'px;display:' + display_bottom)
          .attr('data-' + offset_end,
                'top:-' + (that.el_height-above_height)+'px'); 
        //remember skroll-data
        frame.skroll_data.push('data-0');
        frame.skroll_data.push('data-' + offset_top_frame);
        frame.skroll_data.push('data-' + offset_top_frame_new);        
        frame.skroll_data.push('data-' + offset_end);
        
        offset_top_frame = offset_top_frame_new;
        
      });
    },     
    removeSkrollData : function(){
      var that = this;
      _.each(this.skroll_data,function(sd){
        that.$('.frames-context-above').removeAttr(sd);
        that.$('.frames-context-above').removeData(sd);
        that.$('.frames-context-below').removeAttr(sd);
        that.$('.frames-context-below').removeData(sd);        
      });
      this.skroll_data = [];
      
      _.each(this.frames,function(frame, index){      
        _.each(frame.skroll_data,function(sd){
          frame.$frame.removeAttr(sd);
          frame.$frame.removeData(sd);
        });      
        frame.skroll_data = [];
      });
      
    },
    scrolled : function(){
      var that = this;
      _.each(this.frames,function(frame, index){
        if (frame.$frame.css('display') === 'block'){
          that.currentFrame = frame.$frame.attr('data-id').split('frame')[1];
        }
      });
      this.$('.frame-nav .frame-link').removeClass('active');
      this.$('.frame-nav .frame-link-'+this.currentFrame).addClass('active');         
    },
    goToFrameEvent : function(e){
      e.preventDefault();      
      this.goToFrame($(e.currentTarget).data('target'));
    },
    goToNextFrameEvent : function(e){
      e.preventDefault();
      this.goToFrame((this.currentFrame + 1) % (this.frames.length));
    }, 
    goToPreviousFrameEvent : function(e){
      e.preventDefault();
      this.goToFrame((this.currentFrame - 1) >= 0 ? (this.currentFrame - 1) : this.frames.length-1);
    }, 
    goToFrame : function(frameIndex, duration, callback) {
      if (typeof this.frames[frameIndex] !== 'undefined') {
        $(this.el).trigger('scrollEvent',{
          offset:   this.$el.offset().top 
                  + (this.options.scroll_distance * (frameIndex + 0.5)),
          duration: typeof duration !== 'undefined' ? duration : 0,
          callback: callback
        });
      } 
    },            
    
  });

  return FramesView;
  
});