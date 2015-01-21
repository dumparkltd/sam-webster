define([
  'jquery','underscore','backbone'  
], function($, _, Backbone ){

  var ScrollView = Backbone.View.extend({
    constructor: function(options) {   
      this.default_options = {
        frame_offset: 200
      };

      this.options = $.extend(true, this.default_options, options);      
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
      
      if (this.$('.frames').outerHeight() < $(window).height()) {
        this.$('.frames').height($(window).height());
        
      } 
      this.frame_height = this.$('.frames').outerHeight(); 
      
      // allow scroll width
      this.$el.height(this.frame_height * this.options.frame_offset);      
      
      // hide all frames but first
      
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
      console.log('scrollView.scrolled');
      
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
        console.log(Math.floor(($('html').scrollTop() - this.$el.offset().top) / this.options.frame_offset));
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