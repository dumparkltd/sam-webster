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
        enable_scrolling: true, // turn scrolling on and off. options off, scrolling, skrollr
        scrolling: 'none', // turn scrolling on and off. options off, scrolling, skrollr
        fill_screen: false, //         
        scroll_distance: 300, // the distance between frame updates, if scrolling enabled
        frames_offset_top:0, // the distance of the frames section to the top
        frames_offset_bottom:0, // the distance of the frames section to the bottom
        offset_top:0
      };
      this.options = $.extend(true, this.default_options, options);               
      
      // make sure scrolling offset makes sense
      this.options.scrolling = (this.options.scroll_distance >= 10 )? this.options.scrolling : 'off';
      if (this.options.scrolling !== 'off' ) {
        this.options.enable_scrolling = (this.options.scrolling !== 'off' )   ? true : false;        
      }

      // frames
      this.currentFrame = 0;
      this.frames = [];     
      this.img_loaded = false;
      this.totalImg = 0;
      this.scrollLength = 0;
      
      // init scroll position
      if (this.options.enable_scrolling){
        this.lastScrollTop = $(document).scrollTop();;
      
        // bind scroll event
        $(window).scroll(_.debounce(_.bind(this.scrolled, this),1));  
      }      
      $(window).resize(_.debounce(_.bind(this.render, this),10));
     
      
      // Call the original constructor
      Backbone.View.apply(this, arguments);          
    },  
    getHeight : function(){
      return this.scrollLength  
              + this.max_frame_height 
              + this.$('.frames-context-above').outerHeight()  
              + this.$('.frames-context-below').outerHeight()
              + this.options.scroll_distance;
    },
    render : function(){
      this.setupFrames();
    },
    setupFrames : function(){
      console.log("setupframes");
      var that = this;
      
      
      
      // if scrolling
      if (this.options.enable_scrolling){
        if (this.options.scrolling === 'scrolling') {
        
          // calculate offsets
          this.options._frames_offset_top = this.options.frames_offset_top;
          if (this.$('.frames-context-above').length > 0) 
            this.options._frames_offset_top += this.$('.frames-context-above').outerHeight();
          this.options._frames_offset_bottom = this.options.frames_offset_bottom;
          if (this.$('.frames-context-below').length > 0) 
            this.options._frames_offset_bottom += this.$('.frames-context-below').outerHeight();

          // set up frames
          this.max_frame_height = 0;
          this.$('.frames .frame').each(function(index){
            that.frames[index] = {
              $frame  : $(this),          
              height  : $(this).outerHeight()
            };
            $(this).css('top',that.options._frames_offset_top);        
            that.max_frame_height = Math.max(that.max_frame_height,$(this).outerHeight());
          });
          this.$('.frames-wrapper').addClass('scrolling');

          // set element heights
          // height is height of frames section (incl scroll_distance) plus 
          if (this.options.fill_screen && ($(window).height() > this.max_frame_height)){
            this.scrollLength = this.frames.length * this.options.scroll_distance + ($(window).height()-this.max_frame_height);               
          } else {        
            this.scrollLength = this.frames.length * this.options.scroll_distance;              
          }        
          var frames_height =
                this.scrollLength
              + this.max_frame_height;              

          this.$('.frames').height(frames_height);

          this.$('.frames-context-above ').height(this.options._frames_offset_top);
          this.$('.frames-context-below ').height(this.options._frames_offset_bottom);
          this.$('.frames-context-below-inner ').css('top',this.options._frames_offset_top + this.max_frame_height);

          // set wrapper height

          this.$('.frames-wrapper').height(frames_height 
                + this.options._frames_offset_top      
                + this.options._frames_offset_bottom); 

          // call scrolled once to setup classes        
          this.scrolled();
          
          this.showFrame(this.currentFrame);        
          
        } else if (this.options.scrolling === 'skrollr') {   
            var that = this;
            
            
            // set up frames
            this.max_frame_height = 0;
            this.$('.frames .frame').each(function(index){
              that.frames[index] = {
                $frame  : $(this),          
                height  : $(this).outerHeight()
              };
              that.max_frame_height = Math.max(that.max_frame_height,$(this).outerHeight());
            });
            // the total length of this frame
            this.scrollLength = this.frames.length * this.options.scroll_distance; 
            
            
            var bottom = this.options.offset_top + this.scrollLength;
            var end = bottom + this.$el.outerHeight();            
            
            //var offset_top_bottom = this.$el.offset().top;
            
            // context above
            // before section: set it at top of element
            var above_height = this.$('.frames-context-above').outerHeight();
            this.$('.frames-context-above ').attr('data-0','top:'+ this.options.offset_top +'px');
            // during set it to the top of the element
            this.$('.frames-context-above ').attr('data-' + this.options.offset_top ,'top:0px');
            // keep it until the end of section            
            this.$('.frames-context-above ').attr('data-' + bottom ,'top:0px');
            // move out of view
            this.$('.frames-context-above ').attr('data-' + end,'top:-'+this.$el.outerHeight()+'px');
            
//            var frame_top = top + above_height;
//            var frame_top_trigger = top;            
//            var frame_bottom_trigger = top + this.options.scroll_distance;      
            var offset_top = this.options.offset_top;

            _.each(this.frames,function(frame, index){
              // before section: set it at top of element             
              if (index === 0) {
                frame.$frame.attr('data-0','top:'+ (offset_top + above_height) +'px');
              } else {
                frame.$frame.attr('data-0','top:'+ (offset_top + above_height) +'px;display:none;');                
              }              
              
              // during set it to the top of the element
              frame.$frame.attr('data-' + offset_top, 'display:block;top:'+above_height+'px');           
              
              offset_top += that.options.scroll_distance;
              
              // keep it until the end of section      
              if (index+1 === that.frames.length) {              
                frame.$frame.attr('data-' + offset_top, 'display:block;top:'+above_height+'px');
              } else {
                frame.$frame.attr('data-' + offset_top, 'display:none;top:'+above_height+'px');
              }
              // then move outside of view
              frame.$frame.attr('data-' + end,'top:-'+(that.$el.outerHeight()-above_height)+'px');                           
            });
    
            offset_top = above_height + this.max_frame_height + this.options.scroll_distance;
                      
            // context below
            // before section: set it at top of element            
            this.$('.frames-context-below ').attr('data-0','top:'+ (this.options.offset_top + offset_top) +'px');
            // during set it to the top of the element            
            this.$('.frames-context-below ').attr('data-' + this.options.offset_top ,'top:'+ (offset_top) +'px');
            // keep it until the end of section            
            this.$('.frames-context-below ').attr('data-' + bottom ,'top:'+ (offset_top) +'px');
//            this.$('.frames-context-below ').attr('data-' +(end+ below_height),'top:-'+ below_height); 
            this.$('.frames-context-below ').attr('data-' + end,'top:-'+(this.$el.outerHeight() - offset_top)+'px');
            
            
        }  
      // if not scrolling  
      } else {
        
        // set up frames     
        var that = this;
        this.max_frame_height = 0;        
        this.$('.frames .frame').each(function(index){
          that.frames[index] = {
            $frame    : $(this),          
            height  : $(this).outerHeight()            
          };

          that.max_frame_height = Math.max(that.max_frame_height,$(this).outerHeight());
        });   
        
        this.$('.frames').height(this.max_frame_height);
        this.showFrame(this.currentFrame);        
        
        
      }
//      // re-run this once all images have been loaded
//      var $img = this.$('.frames img');
//      this.totalImg = $img.length;
//      $img.each(function() {
//
//          $(this)
//              .load(_.bind(that.waitImgDone,that))
//              .error(_.bind(that.waitImgDone,that));
//      });       
      
      
      this.$('.frames-wrapper').addClass('init');
    },
    waitImgDone : function() {
        this.totalImg--;
        if ((this.totalImg===0) && (!this.img_loaded)) {
          this.img_loaded = true;
          this.setupFrames();              
        }
    },
    scrolled : function(){
//      console.log('scrolled: ' + $(document).scrollTop() );
      if (this.options.enable_scrolling){
        if (this.options.scrolling === 'scrolling') {

          // scroll position relative to scroll
          var scrollTopRelative = $(document).scrollTop() - this.$el.offset().top;

          // if above
          if (scrollTopRelative < 0) {
              this.$('.frames-wrapper').removeClass('inside'); 
              this.$('.frames-wrapper').addClass('above'); 
              this.showFrame(0);                  
              this.$('.frames-context-above-inner').css('top',0);            
          // if below
          } else if (scrollTopRelative > this.scrollLength) {
              this.$('.frames-wrapper').removeClass('inside'); 
              this.$('.frames-wrapper').addClass('below');                                  
              this.showFrame(this.frames.length-1);      
              this.$('.frames-context-above-inner').css('top',this.scrollLength);            
          // if inside
          } else {                               
            if (!this.$('.frames-wrapper').hasClass('inside')) {            
              this.$('.frames-wrapper').removeClass('below'); 
              this.$('.frames-wrapper').removeClass('above'); 
              this.$('.frames-wrapper').addClass('inside'); 
            }
            // show frame
            this.showFrame(Math.floor(scrollTopRelative / this.options.scroll_distance));                  
            this.$('.frames-context-above-inner').css('top',0);
          }       
        }
      }
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