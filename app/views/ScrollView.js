define([
  'jquery','underscore','backbone'  
], function($, _, Backbone ){

  var ScrollView = Backbone.View.extend({
    constructor: function(options) {   
      this.default_options = {
        frame_offset: 200
      };

      this.options = $.extend(true, this.default_options, options);               
      this.frame = undefined;
      this.scrollElements = [];     
      Backbone.View.apply(this, arguments);   
      // bind to window
      $(window).scroll(_.debounce(_.bind(this.scrolled, this),10));        
    },        
    events : {
    },
    render : function(){
      this.initScroll();
    },
    initScroll : function(){
      var that = this;
      // set height of helper div elements      
      this.$('.frame-helper').css('height',this.options.frame_offset+'px');
     
      
      
      // define update
      // when helper div hits top of screen show corresponding frame
      
      // activate first frame
      // remember id of first frame
      //this.frame = this.$('.frame').data('id');
      
    
    },
    isScrollView : true,
    scroll : function(route) {
      console.log(route);
      var scrollElement = this.scrollElements[route];
      if (typeof scrollElement !== 'undefined') {
        
      } else {
        $(this.el).trigger('scrollEvent',{offset:this.$el.offset().top});
      }
    },
    scrolled : function(){
     // console.log('scrollView.scrolled');
      
      // if top of section reaches top of window: $('html').scrollTop() > this.$el.offset().top 
      // -> fix frames
                  
      // scrolled into section: $('html').scrollTop() - this.$el.offset().top
      // show (frames[Math.floor(($('html').scrollTop() - this.$el.offset().top) / this.options.frame_offset)]
      
      if ($('html').scrollTop() < this.$el.offset().top - $(window).height()
        || $('html').scrollTop() > this.$el.offset().top + this.$el.height()
      ) {
        if (this.inView) this.exit();        
      } else {
        if (!this.inView) this.enter();
      }
      if ($('html').scrollTop() > this.$el.offset().top ) {
        this.top();
        //console.log(Math.floor(($('html').scrollTop() - this.$el.offset().top) / this.options.frame_offset));
      }
//      if ($('html').scrollTop() > this.$el.offset().top + this.$el.height()) {
//        this.top();
//      }      
    },
    enter : function(){
      console.log('enter');      
      this.inView = true;      
    },
    exit : function(){
      console.log('exit');      
      this.inView = false;
    },
    top : function(){
      console.log('top');
      
    },
    
  });

  return ScrollView;
  
});