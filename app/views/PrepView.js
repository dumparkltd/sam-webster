define([
  'jquery','underscore','backbone',  
  'views/PrepNutritionFramesView','views/PrepVideoView',//subviews
  'text!templates/prepTemplate.html'
], function($, _, Backbone, PrepNutritionFramesView, PrepVideoView, template){

  var PrepView = Backbone.View.extend({
    initialize : function(options){
      this.options = options;
      this.render();                  
      this.hasFramesView = true;
    },       
    events : function(){
    },    
    render: function(){         
      this.$el.html(template);
      
      this.videoView = new PrepVideoView({
        el:this.$('.video-view')
      });  
      this.framesView = new PrepNutritionFramesView({
        el:this.$('.frames-view'),
        scrolling:'skrollr',
        scroll_distance:200,
        offset_top: this.options.offset_top + this.$('.frames-view').position().top
      });  
      
      
            
      return this;
    },
    goToFrame : function(frameIndex, duration, callback){
      this.framesView.goToFrame(frameIndex, duration, callback);
    },
    initPlayers : function(){
      this.videoView.initPlayers();
    },
    getHeight : function(){
      return this.$el.outerHeight() - this.framesView.$el.outerHeight() + this.framesView.getHeight();
    },            
  });

  return PrepView;
  
});
