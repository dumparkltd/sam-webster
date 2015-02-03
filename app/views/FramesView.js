define([
  'jquery','underscore','backbone'  
], function($, _, Backbone ){
  var FramesView = Backbone.View.extend({
    isFramesView : true,    
    events : {
      "click a.frame-link" : "goToFrameEvent",
      //"click .frames-wrapper.inside .onMouseOver .frame-link" : "goToFrameEvent",
      "click  .frame-link" : "goToFrameEvent",
      "click a.frame-next" : "goToNextFrameEvent",
      "click a.frame-prev" : "goToPreviousFrameEvent"
    },    
    constructor: function(options) {   
      // options
      this.default_options = {
        fill_screen: false, //         
        scroll_distance: 300, // the distance between frame updates, if scrolling enabled
        offset_top:0
      };
      this.options = $.extend(true, this.default_options, options);               
      
      // frames
      this.currentFrame = 0;
              
      this.scrollLength = 0;
      this.skroll_data_above = [];            
      this.skroll_data_below = [];                      
       
      // Call the original constructor
      Backbone.View.apply(this, arguments);          
    },  
    getHeight : function(){
      return this.scrollLength  
              + this.max_frame_height 
              + this.$('.frames-context-above').outerHeight()  
              + this.$('.frames-context-below').outerHeight();
    },
    setupFrames : function(offset_top){      
      offset_top = typeof offset_top !== 'undefined' ? offset_top :this.options.offset_top;  
      
      // setup skroll data
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
      // the total length of this frame
      this.scrollLength = this.frames.length * this.options.scroll_distance; 
      
      var above_height = this.$('.frames-context-above').outerHeight();
      var below_height = this.$('.frames-context-below').outerHeight();
      var el_height = above_height + below_height + this.max_frame_height;
      

      
      var offset_bottom = offset_top    + this.scrollLength; // the bottom trigger
      var offset_end    = offset_bottom + el_height; 
      
      // context above
      
      
      this.$('.frames-context-above ')
        .attr('data-0',               'top:'+ offset_top +'px')// before section: set it at top of element
        .attr('data-' + offset_top ,  'top:0px')// during set it to the top of the element
        .attr('data-' + offset_bottom,'top:0px')// keep it until the end of section            
        .attr('data-' + offset_end,   'top:-'+ el_height +'px');// move out of view
      this.skroll_data_above.push('data-0');
      this.skroll_data_above.push('data-' + offset_top);
      this.skroll_data_above.push('data-' + offset_bottom);
      this.skroll_data_above.push('data-' + offset_end);
      
      // the frames
      var offset_top_frame = offset_top; // the top trigger for frames       
      _.each(this.frames,function(frame, index){
        // before section: set it at top of element             
        if (index === 0) {
          frame.$frame.attr('data-0','top:'+ (offset_top_frame + above_height) +'px');
        } else {
          frame.$frame.attr('data-0','top:'+ (offset_top_frame + above_height) +'px;display:none;');                
        }              
        frame.skroll_data.push('data-0');
        // during set it to the top of the element
        frame.$frame.attr('data-' + offset_top_frame, 'display:block;top:'+above_height+'px');           
        frame.skroll_data.push('data-' + offset_top_frame);
        offset_top_frame += that.options.scroll_distance;
        // keep it until the end of section      
        if (index+1 === that.frames.length) {              
          frame.$frame.attr('data-' + offset_top_frame, 'display:block;top:'+above_height+'px');
        } else {
          frame.$frame.attr('data-' + offset_top_frame, 'display:none;top:'+above_height+'px');
        }
        frame.skroll_data.push('data-' + offset_top_frame);
        // then move outside of view
        frame.$frame.attr('data-' + offset_end,'top:-'+(el_height-above_height)+'px');                           
        frame.skroll_data.push('data-' + offset_end);
      });
      
      
      // context below
      var offset_top_below = above_height + this.max_frame_height;

      // context below
                
      this.$('.frames-context-below ')
              .attr('data-0',               'top:'+ (offset_top + offset_top_below) +'px')// before section: set it at top of element  
              .attr('data-' + offset_top,   'top:'+ offset_top_below +'px')// during set it to the top of the element    
              .attr('data-' + offset_bottom,'top:'+ offset_top_below +'px')// keep it until the end of section   
              .attr('data-' + offset_end,   'top:-'+(el_height-offset_top_below)+'px');       
      this.skroll_data_below.push('data-0');
      this.skroll_data_below.push('data-' + offset_top);
      this.skroll_data_below.push('data-' + offset_bottom);
      this.skroll_data_below.push('data-' + offset_end);      

      this.$('.frames-wrapper').addClass('init');
    },     
    removeSkrollData : function(){
//      console.log('this.$(.skrollable).length'+this.$('.skrollable').length);
//      this.$('.skrollable').each( function() {
//        var $skroll = $(this);
//        console.log(this.attributes);
//        $.each(this.attributes, function() {
//          if (this.name.indexOf('data') === 0) {
//            console.log(this.name + 'starts with data');
//            $skroll.removeAttr(this.name);            
//            $skroll.removeData(this.name);
//          } else {
//            console.log(this.name + 'does not starts with data');
//          }
//        });
//        console.log(this.attributes);
//      });
      var that = this;
      _.each(this.skroll_data_above,function(sd){
        that.$('.frames-context-above').removeAttr(sd);
        that.$('.frames-context-above').removeData(sd);
      });
      this.skroll_data_above = [];
      
      _.each(this.skroll_data_below,function(sd){
        that.$('.frames-context-below').removeAttr(sd);
        that.$('.frames-context-below').removeData(sd);
      });
      this.skroll_data_below = [];
      
      _.each(this.frames,function(frame, index){      
        _.each(frame.skroll_data,function(sd){
          frame.$frame.removeAttr(sd);
          frame.$frame.removeData(sd);
        });      
        frame.skroll_data = [];
      });
      
    },

    showFrame : function(index){      
      // validate index
      index = Math.max(Math.min(index,this.frames.length-1),0);      
      // show frame
      this.$('.frames .frame').removeClass('visible');
      this.frames[index].$frame.addClass('visible');
      // activate navs
      this.$('.frame-nav .frame-link').removeClass('active');
      this.$('.frame-nav .frame-link-'+index).addClass('active');   
      
      this.currentFrame = index;
      
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
      if (this.options.enable_scrolling){        
        if (typeof this.frames[frameIndex] !== 'undefined') {
          $(this.el).trigger('scrollEvent',{
            offset:   this.$el.offset().top 
                    + (this.options.scroll_distance * (frameIndex + 0.5)),
            duration: typeof duration !== 'undefined' ? duration : 200,
            callback: callback
          });
        }
      } else {
        if (typeof this.frames[frameIndex] !== 'undefined') {
          // show/hide frames
          this.showFrame(frameIndex);
        }        
      }
    },            
    
  });

  return FramesView;
  
});